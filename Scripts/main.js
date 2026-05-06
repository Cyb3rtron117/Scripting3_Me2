var ballObj = document.getElementById("pong-ball");
var paddle1 = document.getElementById("paddle1");
var paddle2 = document.getElementById("paddle2");
var game = document.getElementById("game");
var mainscreen = document.getElementById("mainScreen");

var player1ScoreObj = document.getElementById("Player1Score");
var player2ScoreObj = document.getElementById("Player2Score");
var GameStart = document.getElementsByClassName("StartGame");
var StartButton = document.getElementById("StartButton");

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

var ballValues = {x: ballStartPos.x, y: ballStartPos.y, speedX: ballSpeed, speedY: ballSpeed};
var canPlay = false; //value for starting and stopping game

var player1score = 0;
player1ScoreObj.innerText = player1score;
var player2score = 0;
player2ScoreObj.innerText = player2score;

const keysPressed = {};

document.addEventListener("keydown", function (pressedkey) {
  keysPressed[pressedkey.key.toLowerCase()] = true;
  
  //adding keys to an array to check if they are pressed later on. Mimics Unity's Input.key.IsPressed basically
});
document.addEventListener("keyup", function (pressedkey) {  
  keysPressed[pressedkey.key.toLowerCase()] = false;

  //it converts it to lowercase so there is not a discrepancy between uppercase and lowercase letters when checking keys later, so i dont have to check both cases
  //basically so that pressing shift isnt a problem
});

function ResetBall() 
{
  ballValues.x = ballStartPos.x;
  ballValues.y = ballStartPos.y;
  ballObj.style.left = ballStartPos.x + "px";
  ballObj.style.top = ballStartPos.y + "px";
  BallLaunch();
  
}
function BallLaunch()
{
  // X Axis
  var randomX = Math.random(); //returns a point value between 0 and 1
  if(randomX > 0.5) //if its bigger than 0.5, go to the right at max speed
  {
    ballValues.speedX = ballSpeed;
  }
  else //otherwise it goes to the left at max speed
  {
    ballValues.speedX = -ballSpeed;
  }

  // Y Axis
  var RandomY = (Math.random() * 2) - 1; //basically, it generates a number between 0 and 2, and subtracts 1 so it becomes a value between -1 and 1
  ballValues.speedY = ballSpeed * RandomY; 

  if(Math.abs(ballValues.speedY) < 0.5) //if the value is too low
  {
    if(RandomY < 0) //if its going up
    {
      ballValues.speedY = ballSpeed * -0.5; 
    }
    else if(RandomY > 0) //if its going down
    {
      ballValues.speedY = ballSpeed * 0.5; 
    }
  }
  /*
  So, first it picks a number between -1 and 1 (-1 being maximum down speed and 1 being maximum up speed)
  then, if the magnitude of that speed is too little (the ball's angle is too shallow) it forces the value to be at least 0.5
  */
  

  canPlay = true; //only after this is done, can we play (im paranoid it doesnt finish this before playing)
}


function StartGame()
{
  GameStart[0].classList.add("hide"); //adds the hide class to the start screen
  player1score = 0;
  player1ScoreObj.innerText = player1score;
  player2score = 0;
  player2ScoreObj.innerText = player2score;
  ResetBall();
  canPlay = true;
}



function Update() //will always be running because of the setTimeout
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

    if (ballValues.x + ballObj.clientWidth > mainscreen.clientWidth) //ball touched right side
    {
      //ballValues.speedX = -ballValues.speedX;
      player1score += 1;
      player1ScoreObj.innerText = player1score;
      
      if(player1score < 5)
      {
        setTimeout(ResetBall, 1000); //resets the ball after 1 second
      }
      else
      {
        GameStart[0].classList.remove("hide");
        StartButton.innerText = 
        `Player 1 has won!
        
        Play new Game?
        `
      }
      canPlay = false;
    }
    if (ballValues.x < 0) //ball touched left side
    {
      //ballValues.speedX = -ballValues.speedX;
      player2score += 1;
      player2ScoreObj.innerText = player2score;

      if(player2score < 5)
      {
        setTimeout(ResetBall, 1000); //resets the ball after 1 second
      }
      else
      {
        GameStart[0].classList.remove("hide");
        StartButton.innerText = 
        `Player 2 has won!

        Play new Game?
        `
      }
      canPlay = false;
    }


    if (ballValues.x < paddle1.clientWidth + paddle1.offsetLeft //left side of ball, right side of paddle
       && ballValues.x > paddle1.offsetLeft //left side of ball, left side of paddle
       && ballValues.y > paddle1.offsetTop 
       && ballValues.y + ballObj.clientHeight < paddle1.offsetTop + paddle1.clientHeight) 
    {
      ballValues.speedX = -ballValues.speedX;
      ballValues.speedX *= 1.05;


      var YDirection = ((ballValues.y + (ballObj.clientHeight / 2)) - (paddle1.offsetTop + (paddle1.clientHeight / 2))) //center of ball position minus centre of paddle position gives the offset of the ball from the paddle center
      ballValues.speedY = YDirection * 0.05; //this gives the ball a different angle depending on where it hit
    }
    /*if the ball is further left than the right of the paddle, and further right than the left of the paddle, and it is within the paddle's top and bottom, flip the speed. Basically if it is inside left paddle it will fire
    we check ifthe left side of the ball is touching the right side of the paddle, which means due to the paddle's anchor being on the left, that distance is offset by the paddle's width (to get the right side)
    and we have to make sure that the right side of the ball (added offset of ball width) is still more than the paddle's left, which stops collisions behind the left paddle*/

    if (ballValues.x + ballObj.clientWidth > paddle2.offsetLeft //right side of ball, left side of paddle
      && ballValues.x + ballObj.clientWidth < paddle2.offsetLeft + paddle2.clientWidth //right side of ball, left side of paddle
      && ballValues.y > paddle2.offsetTop 
      && ballValues.y + ballObj.clientHeight < paddle2.offsetTop + paddle2.clientHeight) 
    {
      ballValues.speedX = -ballValues.speedX;
      ballValues.speedX *= 1.05;


      var YDirection = ((ballValues.y + (ballObj.clientHeight / 2)) - (paddle2.offsetTop + (paddle2.clientHeight / 2))) //center of ball position minus centre of paddle position gives the offset of the ball from the paddle center
      ballValues.speedY = YDirection * 0.05; //this gives the ball a different angle depending on where it hit
    }
    /*if the ball is further right than the left of the paddle, and further left than the right of the paddle, and it is within the paddle's top and bottom, flip the speed. Basically if it is inside the right paddle it will fire
    since ball anchor is top left, have to shift the check to the right by the ball's width to check if the right side of the ball is touching the left side of the paddle
    we also have to make sure that the left of the ball is still further left than the right side of the paddle. This prevents collisions behind the right paddle*/

    ballObj.style.left = ballValues.x + "px"; //moves the ball
    ballObj.style.top = ballValues.y + "px";
  }


  setTimeout(Update, updateRate); //calls this function again every few miliseconds
}

Update();
