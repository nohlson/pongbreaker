/*eslint-env browser */
var canvas = document.getElementById("playerCanvas");

var botPaddleWidth = 15;
var topPaddleWidth = 15;

var ballRadius = 2;
var paddleHeight = 5;

var botPaddleX = canvas.width/2;
var topPaddleX = canvas.width/2 + 15;

var balls;

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
            botPaddleX -= 10;
	}
        break;

    case 39:  // right key

        if (botPaddleX + botPaddleWidth < canvas.width) {
            botPaddleX += 10;
	}
        break;
    }
}

function setupGame() {
    var topBall = {x: canvas.width/2, y: 15, xSpeed: 2, ySpeed: 2};
    var botBall = {x: canvas.width/2, y: canvas.height - 15, xSpeed: 2, ySpeed: -2};
    balls = [topBall, botBall];
    setInterval(redrawCanvas, 50);
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

    for (var i = 0; i < balls.length; i++) {
	var ball = balls[i];
	moveBall(ball);
	drawBall(ball);
    }
}
