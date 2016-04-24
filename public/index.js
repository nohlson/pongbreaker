//index.js
/*eslint-env node, browser*/
function connect() {
    console.log("Beginning connect");

    var socket = io();
    var username = document.getElementById("username").value
    socket.emit("newuserconnect", {user: username});
    window.open("ingame.html", '_blank');  
    console.log("Finished connect");
}