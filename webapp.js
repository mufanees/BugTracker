var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var app = express();
var bodyParser = require('body-parser');
var db;

app.use(express.static('static'));

// var bugData = [
//   {id: 1, priority: 'P1', status:'Open', owner:'Ravan', title:'Syrup is too sweet'},
//   {id: 2, priority: 'P2', status:'New', owner:'Eddie', title:'Chocolate spilled on counter'}
// ];

app.get('/api/bugs', function(req, res) {
  db.collection('bugs').find().toArray(function(err, data) {
    res.json(data);
  });
  // .status(200)
  // .send(JSON.stringify(bugData));
});

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/api/bugs', function(req, res) {
  console.log('req body:', req.body);
  db.collection('bugs').insertOne(newBug, function(err, result) {
    var newId = result.insertedId;
    db.collection('bugs').find({_id: newId}).next(function(err, data) {
      res.json(data);
    });
  });
  var newBug = req.body;
  newBug.id = bugData.length + 1;
  bugData.push(newBug);
  res.json(newBug);
});

var dbName = 'bugsdb';
var url = 'mongodb://localhost/' + dbName;

MongoClient.connect(url, function(err, dbConnection) {
  assert.equal(null, err);
  // db.close();
  db = dbConnection;
  console.log('Connected successfully to database', dbName);
  var server = app.listen(3000, function() {
  	var port = server.address().port;
  	console.log("Started server at port", port);
  });
});
