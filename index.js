var express = require('express');
var app = express();
var Pusher = require('pusher');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var pusher = new Pusher({
  appId: '147172',
  key: 'b28b26456e66e4d0c1a8',
  secret: 'c9e78aa0a2e0fd437a55',
  encrypted: true
});
pusher.port = 443;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/client'));

// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// app.get('/', function(request, response) {
//   response.render('client/index');
// });

app.post('/sendmessage', function(req, res) {
  pusher.trigger('ads3r4', 'message', req.body);
});

app.post('/createroom', function(req, res) {
  var uri = 'mongodb://dbuser:userpass123@ds035664.mongolab.com:35664/heroku_d99f88bs';
  console.log(req.body);
  var room = [req.body];
  mongodb.MongoClient.connect(uri, function(err, db) {
    if (err) throw err;

    var songs = db.collection('rooms');

    songs.insert(room, function(err, result) {
      if (err) throw err;

      console.log(result);
    });


  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
