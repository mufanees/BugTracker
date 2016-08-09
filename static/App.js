// var bugData = [
//   {id: 1, priority: 'P1', status:'Open', owner:'Ravan', title:'App crashes on open'},
//   {id: 2, priority: 'P2', status:'New', owner:'Eddie', title:'Misaligned border on panel'}
// ];

var BugFilter = React.createClass({
  displayName: "BugFilter",

  render: function () {
    console.log("Rendering BugFilter");
    return React.createElement(
      "div",
      null,
      "A way to filter the list of bugs would come here."
    );
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
  displayName: "BugRow",

  render: function () {
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        null,
        this.props.bug.id
      ),
      React.createElement(
        "td",
        null,
        this.props.bug.status
      ),
      React.createElement(
        "td",
        null,
        this.props.bug.priority
      ),
      React.createElement(
        "td",
        null,
        this.props.bug.owner
      ),
      React.createElement(
        "td",
        null,
        this.props.bug.title
      )
    );
  }
});

var BugTable = React.createClass({
  displayName: "BugTable",

  render: function () {
    console.log('Rendering bug table, num items:', this.props.bugs.length);

    //map the data source (bugs) - passed down from BugList, according to BugRow formatting
    //the argument bug is assigned to each element in the array this.props.bugs
    var bugRows = this.props.bugs.map(function (bug) {
      return React.createElement(BugRow, { key: bug.id, bug: bug });
    });

    return React.createElement(
      "table",
      null,
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement(
            "th",
            null,
            "Id"
          ),
          React.createElement(
            "th",
            null,
            "Status"
          ),
          React.createElement(
            "th",
            null,
            "Priority"
          ),
          React.createElement(
            "th",
            null,
            "Owner"
          ),
          React.createElement(
            "th",
            null,
            "Title"
          )
        )
      ),
      React.createElement(
        "tbody",
        null,
        bugRows
      )
    );
  }
});

var BugAdd = React.createClass({
  displayName: "BugAdd",

  render: function () {
    console.log("Rendering BugAdd");
    return React.createElement(
      "form",
      { name: "bugAdd" },
      React.createElement("input", { type: "text", id: "owner", name: "owner_name", placeholder: "Owner" }),
      React.createElement("input", { type: "text", id: "title", name: "title_text", placeholder: "Title" }),
      React.createElement(
        "button",
        { onClick: this.handleSubmit },
        "Add Bug"
      )
    );
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var form = document.forms.bugAdd;
    this.props.addBug({ owner: form.owner.value, title: form.title.value, status: 'New', priority: 'P1' });

    //clear the form
    form.owner.value = '';
    form.title.value = '';
  }
});

var BugList = React.createClass({
  displayName: "BugList",

  getInitialState: function () {
    return { bugs: [] };
  },

  componentDidMount: function () {
    $.ajax({
      url: '/api/bugs',
      dataType: 'json',
      cache: false,
      success: function (bugData) {
        this.setState({ bugs: bugData });
      }.bind(this)

      //   $.ajax('/api/bugs').done(function(data) {
      //   this.setState({bugs: data});
      //   }.bind(this));
      // // In production, we'd also handle errors.
    });
  },
  render: function () {
    console.log('Rendering bug list, num items', this.state.bugs.length);
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h1",
        null,
        "Bug Tracker"
      ),
      React.createElement(BugFilter, null),
      React.createElement("hr", null),
      React.createElement(BugTable, { bugs: this.state.bugs }),
      React.createElement("hr", null),
      React.createElement(BugAdd, { addBug: this.addBug })
    );
  },

  addBug: function (bug) {
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
      success: function (data) {
        var bug = data;
        var bugsModified = this.state.bugs.concat(bug);
        this.setState({ bugs: bugsModified });
      }.bind(this)
    });
  }
});

ReactDOM.render(React.createElement(BugList, null), document.getElementById('main'));