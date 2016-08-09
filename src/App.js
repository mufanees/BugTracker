// var bugData = [
//   {id: 1, priority: 'P1', status:'Open', owner:'Ravan', title:'App crashes on open'},
//   {id: 2, priority: 'P2', status:'New', owner:'Eddie', title:'Misaligned border on panel'}
// ];

var BugFilter = React.createClass({
  render: function() {
    console.log("Rendering BugFilter");
    return (
      <div>A way to filter the list of bugs would come here.</div>
    )
  }
});


// var BugRow = React.createClass({
//   render: function() {
//     return (
//       <tr>
//         <td>{this.props.id}</td>
//         <td>{this.props.status}</td>
//         <td>{this.props.priority}</td>
//         <td>{this.props.owner}</td>
//         <td>{this.props.title}</td>
//       </tr>
//     );
//   }
// });

var BugRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.bug._id}</td>
        <td>{this.props.bug.status}</td>
        <td>{this.props.bug.priority}</td>
        <td>{this.props.bug.owner}</td>
        <td>{this.props.bug.title}</td>
      </tr>
    );
  }
});

var BugTable = React.createClass({
  render: function() {
    console.log('Rendering bug table, num items:', this.props.bugs.length);

    //map the data source (bugs) - passed down from BugList, according to BugRow formatting
    //the argument bug is assigned to each element in the array this.props.bugs
    var bugRows = this.props.bugs.map(function(bug) {
      return (
        <BugRow key={bug._id} bug={bug} />
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Owner</th>
            <th>Title</th>
          </tr>
        </thead>

        <tbody>
          {bugRows}
        </tbody>
      </table>
    );
  }
});

var BugAdd = React.createClass({
  render: function() {
    console.log("Rendering BugAdd");
    return (
      <form name="bugAdd">
        {/* <label for="owner">Owner:</label> */}
        <input type="text" id="owner" name="owner_name" placeholder="Owner" />

        {/* <label for="title">Title:</label> */}
        <input type="text" id="title" name="title_text" placeholder="Title" />

        <button onClick={this.handleSubmit}>Add Bug</button>
      </form>
    )
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var form = document.forms.bugAdd;
    this.props.addBug({owner: form.owner.value, title: form.title.value, status: 'New', priority: 'P1'});

    //clear the form
    form.owner.value = '';
    form.title.value = '';
  }
});

var BugList = React.createClass({
  getInitialState: function() {
    return {bugs: []}
  },

  componentDidMount: function() {
    $.ajax({
      url: '/api/bugs',
      dataType: 'json',
      cache: false,
      success: function(bugData) {
        this.setState({bugs: bugData});
      }.bind(this)

    //   $.ajax('/api/bugs').done(function(data) {
    //   this.setState({bugs: data});
    //   }.bind(this));
    // // In production, we'd also handle errors.
    });
  },
  render: function() {
    console.log('Rendering bug list, num items', this.state.bugs.length);
    return (
      <div>
        <h1>Bug Tracker</h1>
        <BugFilter />
        <hr />
        {/* passing bugs as a property from BugList down to BugTable class */}
        <BugTable bugs={this.state.bugs}/>
        <hr />
        {/* addBug here is the proprty being made available to BugAdd class. */}
        {/* the BugAdd class can callback when the user submits the form */}
        {/* this.addBug is a method to handle data from the child element */}
        <BugAdd addBug={this.addBug}/>
      </div>
    );
  },

  addBug: function(bug) {
    // var bugsModified = this.state.bugs.slice();
    // bug.id = this.state.bugs.length + 1;
    // bugsModified.push(bug);
    // this.setState({bugs: bugsModified});

    console.log('Adding bug:', bug);
    $.ajax({
      url: '/api/bugs',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(bug),
      success: function(data) {
        console.log('test');
        var bug = data;
        var bugsModified = this.state.bugs.concat(bug);
        this.setState({bugs: bugsModified});
      }.bind(this)
    });
  }
});

ReactDOM.render(
  <BugList />,
  document.getElementById('main')
);
