var ballObj = document.getElementById("pong-ball");
var paddle1 = document.getElementById("paddle1");
var paddle2 = document.getElementById("paddle2");
var game = document.getElementById("game");
var mainscreen = document.getElementById("mainScreen");

var player1ScoreObj = document.getElementById("Player1Score");
var player2ScoreObj = document.getElementById("Player2Score");

var updateRate = 10;
//var paddleSpeed = 4;
var ballSpeed = mainscreen.clientHeight / 200;
var paddleSpeed = mainscreen.clientHeight / 150;
var paddle1StartPos = (mainscreen.clientHeight - paddle1.clientHeight) / 2;
var paddle2StartPos = (mainscreen.clientHeight - paddle2.clientHeight) / 2;
var paddle1Bottom = mainscreen.clientHeight - paddle1.clientHeight;
var paddle2Bottom = mainscreen.clientHeight - paddle2.clientHeight;

var paddle1Pos = paddle1StartPos;
var paddle2Pos = paddle2StartPos;

paddle1.style.top = paddle1StartPos + "px";
paddle2.style.top = paddle2StartPos + "px";

var ballStartPos = { x: (mainscreen.clientWidth - ballObj.clientWidth) / 2, y: (mainscreen.clientHeight - ballObj.clientHeight) / 2,}; // centers the ball
ResetBall();

var ballValues = {x: ballStartPos.x, y: ballStartPos.y, speedX: ballSpeed, speedY: ballSpeed};
var canPlay = true; //value for starting and stopping game

var player1score = 0;
player1ScoreObj.innerText = player1score;
var player2score = 0;
player2ScoreObj.innerText = player2score;

const keysPressed = {};

document.addEventListener("keydown", function (pressedkey) {
  keysPressed[pressedkey.key.toLowerCase()] = true; //adding keys to a list (array?) to check if they are true later on. Mimics Unity's Input.key.IsPressed basically
});
document.addEventListener("keyup", function (pressedkey) {
  //it converts it to lowercase so there is not a discrepancy between uppercase and lowercase letters when checking keys later, so i dont have to check both cases
  keysPressed[pressedkey.key.toLowerCase()] = false;
});

function ResetBall() 
{
  ballObj.style.left = ballStartPos.x + "px";
  ballObj.style.top = ballStartPos.y + "px";
}

function Update() 
{
  if (canPlay) 
    {
    paddleSpeed = mainscreen.clientHeight / 150; //keeps the paddle speed relative to the screen size (i can test different screen sizes at runtime then)
    ballSpeed = mainscreen.clientHeight / 200; //same for the ball
    paddle1Bottom = mainscreen.clientHeight - paddle1.clientHeight; //get a new position for the paddle each frame
    paddle2Bottom = mainscreen.clientHeight - paddle2.clientHeight;

    //PADDLES

    //Player 1 controls
    if (keysPressed["w"] && paddle1.offsetTop > 0) // w
    {
      paddle1Pos -= paddleSpeed;
    } 
    else if (keysPressed["s"] && paddle1.offsetTop < paddle1Bottom) // s
    {
      paddle1Pos += paddleSpeed;
    }

    //Player 2 controls
    if (keysPressed["arrowup"] && paddle2.offsetTop > 0) // up arrow
    {
      paddle2Pos -= paddleSpeed;
    } 
    else if (keysPressed["arrowdown"] && paddle2.offsetTop < paddle2Bottom) // down arrow
    {
      paddle2Pos += paddleSpeed;
    }

    paddle1.style.top = paddle1Pos + "px"; //moves the paddles
    paddle2.style.top = paddle2Pos + "px";


    //BALL

    ballValues.x += ballValues.speedX;
    ballValues.y += ballValues.speedY;

    if (ballValues.y < 0 || ballValues.y + ballObj.clientHeight > mainscreen.clientHeight) //if ball is higher than the top or lower than  the bottom, flip the speed
    {
      ballValues.speedY = -ballValues.speedY;
    }

    if (ballValues.x < 0) //ball touched left side
    {
      //ballValues.speedX = -ballValues.speedX;
      canPlay = false;
      player1score += 1;
      player1ScoreObj.innerText = player1score;
    }
    if (ballValues.x + ballObj.clientWidth > mainscreen.clientWidth) //ball touched right side
    {
      //ballValues.speedX = -ballValues.speedX;
      canPlay = false;
      player2score += 1;
      player2ScoreObj.innerText = player2score;
    }


    if (ballValues.x < paddle1.clientWidth + paddle1.offsetLeft && ballValues.x > paddle1.offsetLeft && ballValues.y > paddle1.offsetTop && ballValues.y < paddle1.offsetTop + paddle1.clientHeight) 
    {
      ballValues.speedX = -ballValues.speedX;
      ballValues.speedX *= 1.05;
    }
    //if the ball is further left than the right of the paddle, and further right than the left of the paddle, and it is within the paddle's top and bottom, flip the speed. Basically if it is inside left paddle it will fire
    //we check ifthe left side of the ball is touching the right side of the paddle, which means due to the paddle's anchor being on the left, that distance is offset by the paddle's width (to get the right side)
    //and we have to make sure that the right side of the ball (added offset of ball width) is still more than the paddle's left, which stops collisions behind the left paddle

    if (ballValues.x + ballObj.clientWidth > paddle2.offsetLeft && ballValues.x < paddle2.offsetLeft + paddle2.clientWidth && ballValues.y > paddle2.offsetTop && ballValues.y < paddle2.offsetTop + paddle2.clientHeight) 
    {
      ballValues.speedX = -ballValues.speedX;
      ballValues.speedX *= 1.05;
    }
    //if the ball is further right than the left of the paddle, and further left than the right of the paddle, and it is within the paddle's top and bottom, flip the speed. Basically if it is inside the right paddle it will fire
    //since ball anchor is top left, have to shift the check to the right by the ball's width to check if the right side of the ball is touching the left side of the paddle
    //we also have to make sure that the left of the ball is still further left than the right side of the paddle. This prevents collisions behind the right paddle

    ballObj.style.left = ballValues.x + "px"; //moves the ball
    ballObj.style.top = ballValues.y + "px";
  }


  setTimeout(Update, updateRate); //calls this function again every few miliseconds
}

Update(); //starts the update loop
