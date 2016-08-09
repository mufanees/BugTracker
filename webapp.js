var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('static'));

var bugData = [
  {id: 1, priority: 'P1', status:'Open', owner:'Ravan', title:'Syrup is too sweet'},
  {id: 2, priority: 'P2', status:'New', owner:'Eddie', title:'Chocolate spilled on counter'}
];

app.get('/api/bugs', function(req, res) {
  res.json(bugData);
  // .status(200)
  // .send(JSON.stringify(bugData));
});

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/api/bugs', function(req, res) {
  console.log('req body:', req.body);
  var newBug = req.body;
  newBug.id = bugData.length + 1;
  bugData.push(newBug);
  res.json(newBug);
});

var server = app.listen(3000, function() {
	var port = server.address().port;
	console.log("Started server at port", port);
});
