//index.js

var lobbyjs = require('lobby');


/*eslint-env node, browser*/
function play_button_click() {
	console.log("Button click");
	
}

function connect() {
    console.log("Beginning connect");

    var socket = io();
    var username = document.getElementById("username").value
    socket.emit("newuserconnect", {user: username});
    window.open("ingame.html", '_blank');  
    console.log("Finished connect");
}