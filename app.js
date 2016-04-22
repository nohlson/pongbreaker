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

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

function connect(username) {
    console.log("Beginning connect");
    var server = require("net").createServer();  
    var io = require("socket.io")(server);

    var handleClient = function (socket) {  
	// we've got a client connection
	socket.emit("tweet", {user: "nodesource", text: "Hello, world!"});
    };

    io.on("connection", handleClient);

    server.listen(80);
    console.log("Finished connect");
}

function addRow(userName)
{
    //If getElementsByTagName isn't defined then return
    if (!document.getElementsByTagName) return;

    newRow = document.createElement("tr");
    newUserName = document.createElement("td");
    newPlayButtonColumn = document.createElement("td");
    newPlayButton = document.createElement("button");
    newPlayButtonColumn.appendChild(newPlayButton);
    newPlayButton.innerText = "Play";
    newUserName.innerText = userName;

    newRow.appendChild(newUserName);
    newRow.appendChild(newPlayButtonColumn);

    tableBody = document.getElementsByTagName("tbody")[0];
    tableBody.appendChild(newUserName);
    tableBody.appendChild(newPlayButtonColumn);
}

