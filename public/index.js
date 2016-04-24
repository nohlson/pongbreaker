//index.js
var lobbyjs = require('lobby');


/*eslint-env node, browser*/
function play_button_click() {
	console.log("Button click");
	window.open("lobby.html", '_blank');
	window.open("ingame.html", '_blank');
}

function connect(username) {
    console.log("Beginning connect");

    var socket = io();
    var username = document.getElementById("username").value
    socket.emit("newuserconnect", {user: username});
   
    console.log("Finished connect");
}