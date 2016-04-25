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
			uuid:uuid
		};

		games.push(game);
		p1.socket.emit('matched', {});
		p1.socket.emit('matched', {});
		setTimeout(function(){
			p1.socket.emit('gameinfo', {username:p1.username, opponent:p2.username, uuid:uuid});
			p2.socket.emit('gameinfo', {username:p2.username, opponent:p1.username, uuid:uuid});
			console.log("New game created between " + p1.username + " and " + p2.username);
		}, 2000);
		
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

    socket.on('disconnect', function() {
	console.log('User disconnected');
    });
});
