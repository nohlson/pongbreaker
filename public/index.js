//index.js
/*eslint-env node, browser*/

function play() {
    var username = document.getElementById("username").value;
    localStorage.setItem("pbusername", username);
    window.open('ingame.html', '_self');
}