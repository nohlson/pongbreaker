//index.js
/*eslint-env node, browser*/

var connecting = 0;
var socket;


function connect() {
	if (!connecting) {
		connecting = 1;
	    console.log("Beginning connect");
	    document.getElementById("loadingimage").style.visibility = "visible";

	    socket = io();

	    var username = document.getElementById("username").value;
	    socket.emit("newuserconnect", {user: username});
	    socket.on('matched', function(data) {
			window.open("ingame.html", '_blank');
		});

	    console.log("Finished connect");
	}
}


