//index.js
/*eslint-env node, browser*/

var connecting = 0;


function connect() {
	if (!connecting) {
		connecting = 1;
	    console.log("Beginning connect");
	    document.getElementById("loadingimage").style.visibility = "visible";

	    var socket = io();

	    var username = document.getElementById("username").value;
	    socket.emit("newuserconnect", {user: username});

	    console.log("Finished connect");
	}
}