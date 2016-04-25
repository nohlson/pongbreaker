//index.js
/*eslint-env node, browser*/

var connecting = 0;
var socket;

var canvas = require('./canvas.js');


function connect() {
	if (!connecting) {
		connecting = 1;
	    console.log("Beginning connect");
	    document.getElementById("loadingimage").style.visibility = "visible";

	    socket = io();

	    var username = document.getElementById("username").value;
	    socket.emit("newuserconnect", {user: username});
	    socket.on('matched', function(data) {
	    	canvas.setupGame(username, data.opusername, data.uuid);

		});

	    console.log("Finished connect");
	}
}


