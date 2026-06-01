/*var ballObj = document.getElementById("pong-ball");
var paddle1 = document.getElementById("paddle1");
var paddle2 = document.getElementById("paddle2");
var game = document.getElementById("game");
var mainscreen = document.getElementById("mainScreen");
*/
var ballObj = $(`#pong-ball`);
var paddle1 = $("#paddle1");
var paddle2 = $("#paddle2");
var game = $("#game");
var mainscreen = $("#mainScreen");

/*
var player1ScoreObj = document.getElementById("Player1Score");
var player2ScoreObj = document.getElementById("Player2Score");
var GameStart = document.getElementsByClassName("StartGame");
var StartButton = document.getElementById("StartButton");
*/
var player1ScoreObj = $("#Player1Score");
var player2ScoreObj = $("#Player2Score");
var GameStart = $(".StartGame").eq(0);
var StartButton = $("#StartButton");

var updateRate = 10;
//var paddleSpeed = 4;
/*
var ballSpeed = mainscreen.clientHeight / 200;
var paddleSpeed = mainscreen.clientHeight / 150;
var paddle1StartPos = (mainscreen.clientHeight - paddle1.clientHeight) / 2;
var paddle2StartPos = (mainscreen.clientHeight - paddle2.clientHeight) / 2;
var paddle1Bottom = mainscreen.clientHeight - paddle1.clientHeight;
var paddle2Bottom = mainscreen.clientHeight - paddle2.clientHeight;
*/
var ballSpeed = mainscreen.innerHeight() / 200;
var paddleSpeed = mainscreen.innerHeight() / 150;
var paddle1StartPos = (mainscreen.innerHeight() - paddle1.innerHeight()) / 2;
var paddle2StartPos = (mainscreen.innerHeight() - paddle2.innerHeight()) / 2;
var paddle1Bottom = mainscreen.innerHeight() - paddle1.innerHeight();
var paddle2Bottom = mainscreen.innerHeight() - paddle2.innerHeight();
var paddle1Pos = paddle1StartPos;
var paddle2Pos = paddle2StartPos;

paddle1.css("top", paddle1StartPos + "px");
paddle2.css("top", paddle2StartPos + "px");

var ballStartPos = { x: (mainscreen.innerWidth() - ballObj.innerWidth()) / 2, y: (mainscreen.innerHeight() - ballObj.innerHeight()) / 2,}; // centers the ball

var ballValues = {x: ballStartPos.x, y: ballStartPos.y, speedX: ballSpeed, speedY: ballSpeed};
var canPlay = false; //value for starting and stopping game

var player1score = 0;
player1ScoreObj.text(player1score);
var player2score = 0;
player2ScoreObj.text(player2score);

var CurrentTimerObj = $("#currentTime");
var BestTimerObj = $("#bestTime");
let longestTime = Number(localStorage.getItem("highScore")); //gets the stored highscore. sets to 0 if there is no value
let timer = 0;

if(longestTime == null)
{
  longestTime = 0;
}
BestTimerObj.html(`Best Time:<span class="digitalText"> ${longestTime.toFixed(2)} s</span>`); //makes sure the correct stuff is displayed once the game loads
CurrentTimerObj.html(`Current Time:<span class="digitalText"> ${timer.toFixed(2)} s</span>`); //only displays up to the second decimal

function clearHighscore() //for if the person wants to clear it
{
  longestTime = 0;
  localStorage.setItem("highScore", 0);
  BestTimerObj.html(`Best Time:<span class="digitalText"> ${longestTime.toFixed(2)} s</span>`);
}


const keysPressed = {};

$(document).on("keydown", function (pressedkey) {
  keysPressed[pressedkey.key.toLowerCase()] = true;
  
  //adding keys to an array to check if they are pressed later on. Mimics Unity's Input.key.IsPressed basically
});
$(document).on("keyup", function (pressedkey) {  
  keysPressed[pressedkey.key.toLowerCase()] = false;

  //it converts it to lowercase so there is not a discrepancy between uppercase and lowercase letters when checking keys later, so i dont have to check both cases
  //basically so that pressing shift isnt a problem
});

function ResetBall() 
{
  ballValues.x = ballStartPos.x;
  ballValues.y = ballStartPos.y;
  ballObj.css("left", ballStartPos.x + "px");
  ballObj.css("top", ballStartPos.y + "px");
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
  GameStart.hide(); //hides the start screen
  player1score = 0;
  player1ScoreObj.text(player1score);
  player2score = 0;
  player2ScoreObj.text(player2score);
  ResetBall();
  canPlay = true;
  timer = 0;
  
}

function CheckTimer()
{
  if(timer > longestTime)
  {
    console.log("checked");
    longestTime = timer;
    localStorage.setItem("highScore", longestTime);
    BestTimerObj.html(`Best Time:<span class="digitalText"> ${longestTime.toFixed(2)} s</span>`);
    
  }
  timer = 0;
  CurrentTimerObj.html(`Current Time:<span class="digitalText"> ${timer.toFixed(2)} s</span>`);
}

function Update() //will always be running because of the setTimeout
{
  if (canPlay) 
    {
    paddleSpeed = mainscreen.innerHeight() / 150; //keeps the paddle speed relative to the screen size (i can test different screen sizes at runtime then)
    ballSpeed = mainscreen.innerHeight() / 200; //same for the ball
    paddle1Bottom = mainscreen.innerHeight() - paddle1.innerHeight(); //get a new position for the paddle each frame
    paddle2Bottom = mainscreen.innerHeight() - paddle2.innerHeight();

    //Timer updates and is dependant on update rate
    timer += updateRate / 1000;
    CurrentTimerObj.html(`Current Time:<span class="digitalText"> ${timer.toFixed(2)} s</span>`);
    
    //Ball speed
    ballValues.x += ballValues.speedX;
    ballValues.y += ballValues.speedY;
    
    //PADDLES
    
    //Player 1 controls
    if (keysPressed["w"] && paddle1Pos > 0) // w
    {
      paddle1Pos -= paddleSpeed;
    } 
    else if (keysPressed["s"] && paddle1Pos < paddle1Bottom) // s
    {
      paddle1Pos += paddleSpeed;
    }

    //Player 2 controls
    if (keysPressed["arrowup"] && paddle2Pos > 0) // up arrow
    {
      paddle2Pos -= paddleSpeed;
    } 
    else if (keysPressed["arrowdown"] && paddle2Pos < paddle2Bottom) // down arrow
    {
      paddle2Pos += paddleSpeed;
    }

    paddle1.css("top", paddle1Pos + "px"); //moves the paddles
    paddle2.css("top", paddle2Pos + "px");


    //BALL
    
    

    if (ballValues.y < 0 && ballValues.speedY < 0) //if ball is higher than the top and the ball is going up, flip the speed
    {
      ballValues.speedY = -ballValues.speedY;       
    }
    if (ballValues.y + ballObj.innerHeight() > mainscreen.innerHeight() && ballValues.speedY > 0) //if ball is lower than the bottom and the ball is going down, flip the speed
    {
      ballValues.speedY = -ballValues.speedY;
    }
    // this is coded so that the ball does not get stuck in an infinitely flipping loop. Yes, it happened
    

    if (ballValues.x + ballObj.innerWidth() > mainscreen.innerWidth()) //ball touched right side
    {
      //ballValues.speedX = -ballValues.speedX;
      player1score += 1;
      player1ScoreObj.text(player1score);
      CheckTimer();
      if(player1score < 5)
      {
        setTimeout(ResetBall, 1000); //resets the ball after 1 second
      }
      else
      {
        GameStart.show();
        StartButton.html(
        `Player 1 has won!<br>
        <br>
        Play new Game?
        `)
      }
      canPlay = false;
    }
    if (ballValues.x < 0) //ball touched left side
    {
      //ballValues.speedX = -ballValues.speedX;
      player2score += 1;
      player2ScoreObj.text(player2score);
      CheckTimer();
      if(player2score < 5)
      {
        setTimeout(ResetBall, 1000); //resets the ball after 1 second
      }
      else
      {
        GameStart.show();
        StartButton.html(
        `Player 2 has won!<br>
        <br>
        Play new Game?
        `)
      }
      canPlay = false;
    }


    if (ballValues.x < paddle1.innerWidth() + paddle1.position().left //left side of ball, right side of paddle
       && ballValues.x + ballObj.innerWidth() > paddle1.position().left //left side of ball, left side of paddle
       && ballValues.y + ballObj.innerHeight() > paddle1.position().top 
       && ballValues.y < paddle1.position().top + paddle1.innerHeight()) 
    {
      if(ballValues.speedX < 0) //so the ball doesnt hit multiple times (this happened)
      {
      ballValues.speedX = -ballValues.speedX;
      ballValues.speedX *= 1.05;


      var YDirection = ((ballValues.y + (ballObj.innerHeight() / 2)) - (paddle1.position().top + (paddle1.innerHeight() / 2))) //center of ball position minus centre of paddle position gives the offset of the ball from the paddle center
      ballValues.speedY = YDirection * 0.05; //this gives the ball a different angle depending on where it hit
      }
    }
    /*if the ball is further left than the right of the paddle, and further right than the left of the paddle, and it is within the paddle's top and bottom, flip the speed. Basically if it is inside left paddle it will fire
    we check ifthe left side of the ball is touching the right side of the paddle, which means due to the paddle's anchor being on the left, that distance is offset by the paddle's width (to get the right side)
    and we have to make sure that the right side of the ball (added offset of ball width) is still more than the paddle's left, which stops collisions behind the left paddle*/

    if (ballValues.x + ballObj.innerWidth() > paddle2.position().left //right side of ball, left side of paddle
      && ballValues.x < paddle2.position().left + paddle2.innerWidth() //right side of ball, right side of paddle
      && ballValues.y + ballObj.innerHeight() > paddle2.position().top 
      && ballValues.y < paddle2.position().top + paddle2.innerHeight()) 
    {
      if(ballValues.speedX > 0) //so the ball doesnt hit multiple times (this happened)
      {
      ballValues.speedX = -ballValues.speedX;
      ballValues.speedX *= 1.05;


      var YDirection = ((ballValues.y + (ballObj.innerHeight() / 2)) - (paddle2.position().top + (paddle2.innerHeight() / 2))) //center of ball position minus centre of paddle position gives the offset of the ball from the paddle center
      ballValues.speedY = YDirection * 0.05; //this gives the ball a different angle depending on where it hit
      }
    }
    /*if the ball is further right than the left of the paddle, and further left than the right of the paddle, and it is within the paddle's top and bottom, flip the speed. Basically if it is inside the right paddle it will fire
    since ball anchor is top left, have to shift the check to the right by the ball's width to check if the right side of the ball is touching the left side of the paddle
    we also have to make sure that the left of the ball is still further left than the right side of the paddle. This prevents collisions behind the right paddle*/

    ballObj.css("left", ballValues.x + "px"); //moves the ball
    ballObj.css("top", ballValues.y + "px");
  }
  setTimeout(Update, updateRate); //calls this function again every few miliseconds
}
Update();// starts the update cycle


