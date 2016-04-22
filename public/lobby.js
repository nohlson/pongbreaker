var appjs = require('app')


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

function play_button_click() {


}

function main() {



}