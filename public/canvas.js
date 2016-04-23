/*eslint-env browser */
var canvas = document.getElementById("playerCanvas");

var botPaddleWidth = 15;
var topPaddleWidth = 15;

var fps = 30;
var ballRadius = 2;
var paddleHeight = 5;

var brickHeight = 5;
var brickWidth = 10;


var botPaddleX = canvas.width/2;
var topPaddleX = canvas.width/2;

var balls;
var bricks = [];

var keys = [];

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

function drawPaddles() {
    var context = canvas.getContext('2d');

    //Left arrow key
    if (keys[37]) {
        if (botPaddleX > 0) {
            botPaddleX -= 5;
	}
    } else if (keys[39]) { //Right arrow key (defaults to left if both pressed)
        if (botPaddleX + botPaddleWidth < canvas.width) {
            botPaddleX += 5;
	}
    }

    //Draw bottom paddle
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FF0000";
    context.beginPath();
    context.fillRect(botPaddleX, canvas.height - paddleHeight, botPaddleWidth, paddleHeight);

    //Draw top paddle
    context.beginPath();
    context.fillRect(topPaddleX, 0, topPaddleWidth, paddleHeight);
}

function setupGame() {
    var topBall = {x: canvas.width/2, y: 15, xSpeed: 2, ySpeed: 2};
    var botBall = {x: canvas.width/2, y: canvas.height - 15, xSpeed: 2, ySpeed: -2};
    balls = [topBall, botBall];
   
    setInterval(redrawCanvas, 1000/fps);
    generateBricks();
}

function drawBall(ball) {
    var context = canvas.getContext('2d');

    context.beginPath();
    context.arc(ball.x, ball.y, ballRadius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
}

function moveBall(ball) {
    ball.x += ball.xSpeed;
    ball.y += ball.ySpeed;

    //Handle bottom paddle
    if (ball.y + ballRadius > canvas.height - paddleHeight) {
	if (ball.x >= botPaddleX && ball.x <= botPaddleX + botPaddleWidth) {
	    ball.y = canvas.height - paddleHeight - ballRadius;
	    ball.ySpeed *= -1;
	}
    }

    //Handle right wall
    if (ball.x + ballRadius >= canvas.width) {
	ball.x = canvas.width - ballRadius;
	ball.xSpeed *= -1;
    }

    //Handle top paddle
    if (ball.y - ballRadius <= paddleHeight) {
	if (ball.x >= topPaddleX && ball.x <= topPaddleX + topPaddleWidth) {
	    ball.y = paddleHeight + ballRadius;
	    ball.ySpeed *= -1;
	}
    }

    //Handle left wall
    if (ball.x - ballRadius <= 0) {
	ball.x = ballRadius;
	ball.xSpeed *= -1;
    }

    for (var i = 0; i < bricks.length; i++) {
	var brick = bricks[i];
	if (ball.y + ballRadius >= brick.y && ball.y - ballRadius <= brick.y + brickHeight) {
	    if (ball.x + ballRadius >= brick.x && ball.x - ballRadius <= brick.x + brickWidth) {
		
		console.log("Hit brick");
		ball.ySpeed *= -1;
		bricks.splice(i--, 1);
		break;
	    }
	}
    }
}

function drawBrick(brick) {
    var context = canvas.getContext('2d');
    context.fillStyle = "#00FF00";
    context.strokeStyle = "#000000";
    context.beginPath();
    context.lineWidth = 0.5;
    context.rect(brick.x, brick.y, brickWidth, brickHeight);
    context.stroke();
    context.fill()
}

function generateBricks() {
    var minBrickY = 60;
    var maxBrickY = canvas.height - minBrickY;

    var currentBrickX = 0;
    var currentBrickY = minBrickY;
    while (currentBrickY + brickHeight <= maxBrickY) {
	while (currentBrickX + brickWidth <= canvas.width) {
	    var newBrick = {x: currentBrickX, y: currentBrickY};
	    drawBrick(newBrick);
	    currentBrickX += brickWidth;
	    bricks.push(newBrick);
	}
	currentBrickX = 0;
	currentBrickY += brickHeight;
    }
}

function redrawCanvas() {
    drawPaddles();
    balls.forEach(function(ball) {
    	moveBall(ball);
	drawBall(ball);
    });

    bricks.forEach(function(brick) {
	drawBrick(brick);
    });
}
