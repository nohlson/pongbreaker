/*eslint-env browser */
var canvas = document.getElementById("playerCanvas");

var botPaddleWidth = 15;
var topPaddleWidth = 15;

var paddleHeight = 5;

var botPaddleX = 0;
var topPaddleX = 0;

var Canvas = function() {
    
    _canvasObj,
    _canvasCtx,
    WIDTH,    
    HEIGHT,
    canvasMinX,
    canvasMaxX,
    canvasMinY,
    canvasMaxY;
    
    
    // right
    this.player1 = {
        x : 0,
        y : 0
    },
    // left
    this.player2 = {
        x : 0,
        y : 0
    },
    
    _setLimits = function () {
        canvasMinX = _canvasObj.offsetLeft;
        canvasMaxX = canvasMinX + _canvasObj.width;
        canvasMinY = _canvasObj.offsetTop;
        canvasMaxY = canvasMinY + _canvasObj.height;
    }
    
    function clearCanvas() {
	_canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    
    
    
    this.draw() = function(){
    	//Draw everything
    	
    	
    }
    
    
    _canvasObj = document.getElementById('playerCanvas');
    WIDTH = _canvasObj.width;
    HEIGHT = _canvasObj.height;

    _canvasCtx = _canvasObj.getContext("2d");

    this.obj = _canvasObj;
    this.ctx = _canvasCtx;
    
}

function handleArrowKeys(event) {
    var key=event.which;
    
    switch(key){
    case 37:  // left key
	
        if (botPaddleX > 0) {
            botPaddleX -= 5;
	}
        break;

    case 39:  // right key

        if (botPaddleX + botPaddleWidth < canvas.width) {
            botPaddleX += 5;
	}
        break;
    }

    redrawCanvas();
}

function redrawCanvas() {
    var context = canvas.getContext('2d');

    //Draw bottom paddle
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FF0000";
    context.beginPath();
    context.fillRect(botPaddleX, canvas.height - paddleHeight, botPaddleWidth, paddleHeight);

    //Draw top paddle
    context.beginPath();
    context.fillRect(topPaddleX, 0, topPaddleWidth, paddleHeight);
    
}
