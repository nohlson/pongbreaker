function connect(username) {
    console.log("Beginning connect");

    var socket = io();
    var username = document.getElementById("username").value
    socket.emit("newuserconnect", {user: username});
   
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
    appjs.main()
    window.open("app.html", '_blank');

}
