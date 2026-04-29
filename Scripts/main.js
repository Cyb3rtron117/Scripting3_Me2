var ball = document.getElementById("pong-ball");
var paddle1 = document.getElementById("paddle1");
var paddle2 = document.getElementById("paddle2");
var game = document.getElementById("game");
var mainscreen = document.getElementById("mainScreen");

var ballSpeed = 10;
var paddleSpeed = 4;
var paddle1StartPos = (mainscreen.clientHeight - paddle1.clientHeight) / 2;
var paddle2StartPos = (mainscreen.clientHeight - paddle2.clientHeight) / 2;
var paddle1Bottom = mainscreen.clientHeight - paddle1.clientHeight;
var paddle2Bottom = mainscreen.clientHeight - paddle2.clientHeight;

var paddle1Pos = paddle1StartPos;
var paddle2Pos = paddle2StartPos;

paddle1.style.top = paddle1StartPos + "px";
paddle2.style.top = paddle2StartPos + "px";


const keysPressed = {};


document.addEventListener("keydown", function(pressedkey)
{
    keysPressed[pressedkey.key] = true;
})
document.addEventListener("keyup", function(pressedkey)
{
    keysPressed[pressedkey.key] = false;
})

function Update()
{
    paddle1Bottom = mainscreen.clientHeight - paddle1.clientHeight;
    paddle2Bottom = mainscreen.clientHeight - paddle2.clientHeight;

    if(keysPressed['w'] && paddle1.style.top > 0) // w
    {
        paddle1Pos -= paddleSpeed;
    }
    else if(keysPressed['s'] && paddle1.style.top < paddle1Bottom) // s
    {
        paddle1Pos += paddleSpeed;
    }

    if(keysPressed['ArrowUp'] && paddle2.style.top > 0) // up arrow
    {
        paddle2Pos -= paddleSpeed;
    }
    else if(keysPressed['ArrowDown']  && paddle2.style.top < paddle2Bottom) // down arrow
    {
        paddle2Pos += paddleSpeed;
    }



    paddle1.style.top = paddle1Pos + "px";
    paddle2.style.top = paddle2Pos + "px";

    setTimeout(Update, ballSpeed);
}

Update();