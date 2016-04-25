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
		var game = {
			p1:p1,
			p2:p2
		};

		games.push(game);
		var sock1 = p1.socketID;
		var sock2 = p2.socketID;
		sock1.emit('matched', {opponent:p2.username});
		sock2.emit('matched', {opponent:p1.username});
		console.log("New game created between " + p1.username + " and " + p2.username);

	}
	
}

function addPlayerToQueue(data, socket) {
	console.log('Username: ' + data.user)
	var username = data.username;
	var socketID = socket.id;
	var player = {
		username:username,
		socketID:socketID
	};
	playerQueue.push(player);
	checkToMatch();
}



io.on('connection', function(socket) {
    console.log('A user connected');
    socket.on('newuserconnect', addPlayerToQueue(data, socket));

    socket.on('disconnect', function() {
	console.log('User disconnected');
    });
});
