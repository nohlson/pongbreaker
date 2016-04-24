/*eslint-env browser */
var canvas = document.getElementById("playerCanvas");

var botPaddleWidth;
var topPaddleWidth;

var fps = 30;
var ballRadius;
var paddleHeight;
var paddleSpeed;

var brickHeight;
var brickWidth;


var botPaddleX;
var topPaddleX;

var balls;
var bricks = [];

var keys = [];

var STARTED = false,
MATCH_POINTS = 3,

scores = {
	p1: {
            board: document.getElementById("Top"),
            points: 0
        },
    p2: {
            board: document.getElementById("Bottom"),
            points: 0
        }
    };
    
    playerID;

function resetGame() {
    botPaddleWidth = 35;
    topPaddleWidth = 35;

    ballRadius = 5;
    paddleHeight = 10;

    brickHeight = 10;
    brickWidth = 30;


    botPaddleX = canvas.width/2;
    topPaddleX = canvas.width/2;

    bricks = [];
    keys = [];

    paddleSpeed = 8;
    
    var topBall = {x: canvas.width/2, y: 15, xSpeed: 5, ySpeed: 5};
    var botBall = {x: canvas.width/2, y: canvas.height - 15, xSpeed: 5, ySpeed: -5};
    balls = [topBall, botBall];
    generateBricks();
}

function drawPaddles() {
    var context = canvas.getContext('2d');

    //Left arrow key
    if (keys[37]) {
    	if (playerID == 'p2') {
        	if (botPaddleX > 0) {
            	botPaddleX -= paddleSpeed;
        } else {
       		if (topPaddleX > 0) {
            	topPaddleX -= paddleSpeed;
        	
        }

	}
    } else if (keys[39]) { //Right arrow key (defaults to left if both pressed)
    	if (playerID == 'p2'){
        	if (botPaddleX + botPaddleWidth < canvas.width) {
            	botPaddleX += paddleSpeed;
        } else {
        	if (topPaddleX + topPaddleWidth < canvas.width) {
            	topPaddleX += paddleSpeed;
        	
        }

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
	resetGame();
	setInterval(redrawCanvas, fps);
    
}

function startGame() {
	
	
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

    //Handle hitting a brick
    for (var i = 0; i < bricks.length; i++) {
	var brick = bricks[i];
	if (ball.y + ballRadius >= brick.y && ball.y - ballRadius <= brick.y + brickHeight) {
	    if (ball.x + ballRadius >= brick.x && ball.x - ballRadius <= brick.x + brickWidth) {
		ball.ySpeed *= -1;
		bricks.splice(i--, 1);
		break;
	    }
	}
    }

    if (ball.y - ballRadius < 0) {
    	
	console.log("Bottom wins");
	resetGame();
    } else if (ball.y + ballRadius > canvas.height) {
	console.log("Top wins");
	resetGame();
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
    var minBrickY = 220;
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




