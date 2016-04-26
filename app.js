/*eslint-env node, browser*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

/*
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
*/
http.listen(appEnv.port, function() {
    console.log('listening on *:' + appEnv.port);
});

var cloudant = {
	url : "https://eecdbd58-d40a-4885-ae70-8543496471cc-bluemix.cloudant.com" 		 
};
var nano = require('nano')(cloudant.url);
var db = nano.db.use('test');
app.get('/highscores', function(request, response) {
  db.view('test', 'new-view', function(err, body) {
  if (!err) {
    var scores = [];
      body.rows.forEach(function(doc) {
        scores.push(doc.value);		      
      });
      response.send(JSON.stringify(scores));
    }
  });
});


app.get('/save_score', function(request, response) {
  var name = request.query.name;
  var score = request.query.score;
  var name1 = request.query.name;
  var score1 = request.query.score;

  var scoreRecord = { 'name1': name1, 'score1' : parseInt(score1),'name': name, 'score' : parseInt(score), 'date': new Date() };
  db.insert(scoreRecord, function(err, body, header) {
    if (!err) {       
      response.send('Successfully added one score to the DB');
    }
  });
});

var playerQueue = [];
var games = [];


//pertaining to game engine
var botPaddleWidth = 35;
var topPaddleWidth = 35;
 
var ballRadius = 5;
var paddleHeight = 10;
 
var brickHeight = 10;
var brickWidth = 30;

var canvasHeight = 500
var canvasWidth = 900

var minBrickY = 220;
var maxBrickY = canvasHeight - minBrickY;
var MATCH_POINTS = 5;


function generateBricks() {
	var bricks = [];
    var currentBrickX = 0;
    var currentBrickY = minBrickY;

    while (currentBrickY + brickHeight <= maxBrickY) {
		while (currentBrickX + brickWidth <= canvasWidth) {
		    var newBrick = {x: currentBrickX, y: currentBrickY};
		    //drawBrick(newBrick);
		    currentBrickX += brickWidth;
		    bricks.push(newBrick);
		}
		currentBrickX = 0;
		currentBrickY += brickHeight;
    }
    return bricks;

}





function checkToMatch() {
	while (playerQueue.length > 1) {
		//pop players out of queue
		var p1 = playerQueue.pop();
		var p2 = playerQueue.pop();

		//generate unique id based on time
		var uuid = new Date().valueOf();

		//create two balls
	    var topBall = {x: canvasWidth/2, y: 15, xSpeed: 5, ySpeed: 5};
	    var botBall = {x: canvasWidth/2, y: canvasHeight - 15, xSpeed: 5, ySpeed: -5};

	    //generate bricks
	    var bricks = generateBricks();
	  
		var game = {
			p1:p1,
			p2:p2,
			uuid:uuid,
			topPaddleX: canvasWidth/2,
			botPaddleX: canvasWidth/2,
			bricks:bricks,
			balls:[topBall, botBall],
			gameover:0, //0 game not over, 1:p1 wins, 2:p2 wins
			p1score:0,
			p2score:0,
			cycle:0 //cycle 0: no heartbeats, cycle 1: one heartbeat, cycle 2: both heartbeats
		};

		games.push(game);
		p1.socket.emit('matched', {pid:1, username:p1.username, opponent:p2.username, uuid:uuid});
		p2.socket.emit('matched', {pid:2, username:p2.username, opponent:p1.username, uuid:uuid});
		console.log("New game created between " + p1.username + " and " + p2.username);
		
	}
	
}

function addPlayerToQueue(data, socket) {
	console.log('Username: ' + data.user)
	var username = data.user;
	var player = {
		username:username,
		socket:socket
	};
	playerQueue.push(player);
	checkToMatch();
}


function testScore(game) {
	if (game.p1score >= MATCH_POINTS){
		// game over
		game.gameover = 1;
		
	}else if (game.p2score >= MATCH_POINTS) {
		//game over
		game.gameover = 2;
		
	}
}


function resetGame(game) {
	//resetpaddles
	game.botPaddleX = canvasWidth/2;
	game.topPaddleX = canvasWidth/2;

	//reset bricks
	game.bricks = generateBricks();

	//reset balls
	var topBall = {x: canvasWidth/2, y: 15, xSpeed: 5, ySpeed: 5};
    var botBall = {x: canvasWidth/2, y: canvasHeight - 15, xSpeed: 5, ySpeed: -5};
    game.balls = [topBall, botBall];

    //send update
    game.p1.socket.emit('update', {balls:game.balls, bricks:game.bricks, topPaddleX:game.topPaddleX});
	game.p2.socket.emit('update', {balls:game.balls, bricks:game.bricks, botPaddleX:game.botPaddleX});
}

function moveBall(ball, bricks, game) {
    ball.x += ball.xSpeed;
    ball.y += ball.ySpeed;

    //Handle bottom paddle
    if (ball.y + ballRadius > canvasHeight - paddleHeight) {
	if (ball.x >= game.botPaddleX && ball.x <= game.botPaddleX + botPaddleWidth) {
	    ball.y = canvasHeight - paddleHeight - ballRadius;
	    ball.ySpeed *= -1;
	}
    }

    //Handle right wall
    if (ball.x + ballRadius >= canvasWidth) {
	ball.x = canvasWidth - ballRadius;
	ball.xSpeed *= -1;
    }

    //Handle top paddle
    if (ball.y - ballRadius <= paddleHeight) {
	if (ball.x >= game.topPaddleX && ball.x <= game.topPaddleX + topPaddleWidth) {
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
    	game.p2score++;
		console.log("Bottom wins");
		testScore(game);
	    game.p1.socket.emit('scoreupdate', {p1score:game.p1score, p2score:game.p2score});
	    game.p2.socket.emit('scoreupdate', {p1score:game.p1score, p2score:game.p2score});
		resetGame(game);
    } else if (ball.y + ballRadius > canvasHeight) {
		console.log("Top wins");
		game.p1score++;
		testScore(game);
	    game.p1.socket.emit('scoreupdate', {p1score:game.p1score, p2score:game.p2score});
	    game.p2.socket.emit('scoreupdate', {p1score:game.p1score, p2score:game.p2score});
		resetGame(game);
    }
}



io.on('connection', function(socket) {
    console.log('A user connected');
    socket.on('newuserconnect', function(data) {
    	addPlayerToQueue(data, socket);
    });
    socket.on('heartbeat', function(data) {
		//lookup game id, update game status, return

		for (var i = 0; i < games.length; i++) {
			if (data.uuid == games[i].uuid) {
				console.log("Updating game id: " + data.uuid);
				if (data.pid == 1) {
					games[i].botPaddleX = data.botPaddleX;
				} else {
					games[i].topPaddleX = data.topPaddleX;
				}
				games[i].cycle++;
				if (games[i].cycle == 2) {
					//game engine

					//move both balls
					games[i].balls.forEach(function(ball) {
						moveBall(ball, games[i].bricks, games[i]);
					});


					//TODO: send full game data to client
					games[i].p1.socket.emit('update', {balls:games[i].balls, bricks:games[i].bricks, topPaddleX:games[i].topPaddleX});
					games[i].p2.socket.emit('update', {balls:games[i].balls, bricks:games[i].bricks, botPaddleX:games[i].botPaddleX});
					games[i].cycle = 0;
				}
				break;
			}
		}
	});

	socket.on('initgame', function(data) {
		console.log("Initgame recieved...");
		for (var i = 0; i < games.length; i++) {
			if (data.uuid == games[i].uuid) {
					console.log("Sending init gameboard.");
					games[i].p1.socket.emit('start', {balls:games[i].balls, bricks:games[i].bricks, topPaddleX:games[i].topPaddleX, botPaddleX:games[i].botPaddleX});
					games[i].p2.socket.emit('start', {balls:games[i].balls, bricks:games[i].bricks, topPaddleX:games[i].topPaddleX, botPaddleX:games[i].botPaddleX});
			}
		}
	});


    socket.on('disconnect', function() {
	console.log('User disconnected');
    });
});




