var blockSize = 25;
var rows = 20;
var columns = 20;
var board;
var context;
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var velocityX = 0;
var velocityY = 0;
var snakeBody = [];
var foodX;
var foodY;
var gameOver;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = columns * blockSize;
    context = board.getContext("2d");
    placeFood();
    document.addEventListener("keyup", changeDirection);
    //100 milliseconds
    setInterval(update, 1000/10);
}


function update() {
    if (gameOver) {
        return;
    }
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX === foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    for (let w = snakeBody.length-1; w > 0; w--) {
        snakeBody[w] = snakeBody[w-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let w = 0; w < snakeBody.length; w++) {
        context.fillRect(snakeBody[w][0], snakeBody[w][1], blockSize, blockSize);
    }
    
    //check if the player has lost the game
    if (snakeX < 0 || snakeX > columns*blockSize || snakeY < 0 || snakeY > rows*blockSize) {
        gameOver = true;
        alert("Game Over");
    }
    for (let w = 0; w < snakeBody.length; w++) {
        if (snakeX == snakeBody[w][0] && snakeY == snakeBody[w][1]) {
            gameOver = true;
            alert("Game Over");
        }
    }
}


function changeDirection(e) {
    //update snake velocity/direction based on arrow key input
    if (e.code == "ArrowUp" && velocityY != 0.5) {
        velocityX = 0;
        velocityY = -0.5;
    }
    else if (e.code == "ArrowDown" && velocityY != -0.5) {
        velocityX = 0;
        velocityY = 0.5;
    }
    else if (e.code == "ArrowLeft" && velocityX != 0.5) {
        velocityX = -0.5;
        velocityY = 0;
    }
    else if (e.code === "ArrowRight" && velocityX != -0.5) {
        velocityX = 0.5;
        velocityY = 0;
    }
}


function placeFood() {
    //randomly generate "food" in the play area
    foodX = Math.floor(Math.random() * columns) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}