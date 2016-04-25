/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

/*
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
*/
http.listen(appEnv.port, function() {
    console.log('listening on *:' + appEnv.port);
});

var cloudant = {
	url : "https://eecdbd58-d40a-4885-ae70-8543496471cc-bluemix.cloudant.com" 		 
};
var nano = require('nano')(cloudant.url);
var db = nano.db.use('test');
app.get('/save_score', function(request, response) {
  var name = request.query.name;
  var score = request.query.score;

  var scoreRecord = { 'name': name, 'score' : parseInt(score), 'date': new Date() };
  db.insert(scoreRecord, function(err, body, header) {
    if (!err) {       
      response.send('Successfully added one score to the DB');
    }
  });
});

var playerQueue = [];
var games = [];


function checkToMatch() {
	while (playerQueue.length > 1) {
		var p1 = playerQueue.pop();
		var p2 = playerQueue.pop();
		var uuid = new Date().valueOf();
		var game = {
			p1:p1,
			p2:p2,
			uuid:uuid,
			topPaddleX: 0,
			botPaddleX: 0,
			cycle:0 //cycle 0: no heartbeats, cycle 1: one heartbeat, cycle 2: both heartbeats
		};

		games.push(game);
		p1.socket.emit('matched', {pid:1, username:p1.username, opponent:p2.username, uuid:uuid});
		p2.socket.emit('matched', {pid:2, username:p2.username, opponent:p1.username, uuid:uuid});
		console.log("New game created between " + p1.username + " and " + p2.username);
		
	}
	
}

function addPlayerToQueue(data, socket) {
	console.log('Username: ' + data.user)
	var username = data.user;
	var player = {
		username:username,
		socket:socket
	};
	playerQueue.push(player);
	checkToMatch();
}



io.on('connection', function(socket) {
    console.log('A user connected');
    socket.on('newuserconnect', function(data) {
    	addPlayerToQueue(data, socket);
    });
    socket.on('heartbeat', function(data) {
		//lookup game id, update game status, return

		for (var i = 0; i < games.length; i++) {
			if (data.uuid == games[i].uuid) {
				if (data.pid == 1) {
					games[i].botPaddleX = data.botPaddleX;
				} else {
					games[i].topPaddleX = data.topPaddleX;
				}
				games[i].cycle++;
				if (games[i].cycle == 2) {
					games[i].p1.socket.emit('update', {topPaddleX:games[i].topPaddleX});
					games[i].p2.socket.emit('update', {botPaddleX:games[i].botPaddleX});
					games[i].cycle = 0;
				}
				break;
			}
		}
	});

	socket.on('endgame', function(data) {
		for (var i =0; i < games.length; i++) {
			if (data.uuid == games[i].uuid) {
				var games[i] = games[i];
				games[i].p1.socket.emit('resetgame', {});
				games[i].p2.socket.emit('resetgame', {});
				games[i].cycle = 0;
			}
			break;
		}

	})

    socket.on('disconnect', function() {
	console.log('User disconnected');
    });
});




