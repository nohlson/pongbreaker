/*eslint-env browser */
function resizeCanvas(){

  var canvas = document.getElementById('playerCanvas');

  var width  = window.innerWidth;
  var height = window.innerHeight;

  width = width - 200;
  var temp = width % 10;
  width = width - temp;

  height = height - 200;
  temp = height % 10;
  height = height - temp;

  canvas.width = width;
  canvas.height = height;

}