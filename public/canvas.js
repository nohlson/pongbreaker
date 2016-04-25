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

var STARTED = false;
var MATCH_POINTS = 3;

var socket;

var scores = {
	p1: {
            board: document.getElementById("Top"),
            points: 0
        },
    p2: {
            board: document.getElementById("Bottom"),
            points: 0
        }
    };
    
var playerID;
var username;
var opusername;
var uuid;
var pid;

function cycleHandler() {
    //send game state to the server
    console.log("Sending heartbeat");
    if (playerID == 1) {
        socket.emit('heartbeat', {
                uuid:uuid,
                pid:pid,
                botPaddleX:botPaddleX});
    } else {
        socket.emit('heartbeat', {
                uuid:uuid,
                pid:pid,
                topPaddleX:topPaddleX});

    }
}




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
    	if (playerID == 1) {
        	if (botPaddleX > 0) {
            	botPaddleX -= paddleSpeed;
        	}

        } else {
       		if (topPaddleX > 0) {
            	topPaddleX -= paddleSpeed;
        	}

		}
	

    } else if (keys[39]) { //Right arrow key (defaults to left if both pressed)
    	if (playerID == 1){
        	if (botPaddleX + botPaddleWidth < canvas.width) {
            	botPaddleX += paddleSpeed;
        	}

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
    playerID = pid;
    document.getElementById('User1').innerHTML = username;
    document.getElementById('User2').innerHTML = opusername;
    resetGame();
    // setInterval(cycleHandler, 1000/fps);
    cycleHandler();
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
    	scores.p2.points ++;
		console.log("Bottom wins");
		resetGame();
		testScore();
    } else if (ball.y + ballRadius > canvas.height) {
		console.log("Top wins");
		scores.p1.points ++;
		resetGame();
		testScore();
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
    context.fill();
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
    cycleHandler();
}


function testScore(){
	scores.p1.board.textContent = scores.p1.points;
	scores.p2.board.textContent = scores.p2.points;	
	if (scores.p1.points >= MATCH_POINTS){
		// game over
		endGame();
		
	}else if (scores.p2.points >= MATCH_POINTS) {
		//game over
		endGame();	
		
	}
	
}
function endGame() {
	//ends game
	
	scores.p1.points = 0;
	scores.p2.points = 0;
	scores.p1.board.textContent = scores.p1.points;
	scores.p2.board.textContent = scores.p2.points;
    socket.emit('endgame', {uuid:uuid});
	
}

function connect() {
    console.log("Beginning connect");
    // document.getElementById("loadingimage").style.visibility = "visible";

    socket = io();

    username = localStorage.getItem("pbusername");
    socket.emit("newuserconnect", {user: username});
    socket.on('matched', function(data) {
            document.getElementById('lblRoundInfo').innerHTML = "PongBreaker"
            opusername = data.opponent;
            uuid = data.uuid;
            pid = data.pid;
            setupGame();
    });

    socket.on('update', function(game) {
        //updates game state from server. receives a game object
        if (pid == 1) {
            topPaddleX = game.topPaddleX; // move just opponents paddle
        } else {
            botPaddleX = game.botPaddleX; // move just opponents paddle
        }
        // redrawCanvas();

        //draw paddels based on the updates above
        drawPaddles();
        game.balls.forEach(function(ball) {
           drawBall(ball);
        });

        game.bricks.forEach(function(brick) {
            drawBrick(brick);
        });
        cycleHandler();
    });

    socket.on('resetgame', function() {
        resetgame();
        cycleHandler();
    });

    socket.on('scoreupdate', function(data) {
        scores.p1.board.textContent = data.p1score;
        scores.p2.board.textContent = data.p2score; 
    })

    console.log("Finished connect");
}






