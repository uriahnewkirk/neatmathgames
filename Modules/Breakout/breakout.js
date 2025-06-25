let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//player settings
let playerWidth = 90;
let playerHeight = 10;
let playerVelocityX = 25; //10
let player = {
    x: boardWidth/2 - playerWidth/2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
}

//projectile settings
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3; //3
let ballVelocityY = 2; //2
let ball = {
    x: boardWidth/2,
    y: boardHeight/2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
}

let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3; 
let blockMaxRows = 10;
let blockCount = 0;
let blockX = 15;
let blockY = 45;
let score = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    //draw the play area
    context.fillStyle = "skyblue";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);
    createBlocks();
}


function update() {
    requestAnimationFrame(update);
    if(gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //draw the player
    context.fillStyle = "forestgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);


    //ball collides & bounces off the player
    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        //flip vertical velocity up or down
        ball.velocityY *= -1;
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        //flip horizontal velocity left or right
        ball.velocityX *= -1;
    }

    if (ball.y <= 0) {
        //ball touches top of play area
        //reverse vertical direction
        ball.velocityY *= -1;
    }
    else if (ball.x <= 0 || (ball.x + ball.width >= boardWidth)) {
        //ball touches left or right wall
        ball.velocityX *= -1;
    }
    else if (ball.y + ball.height >= boardHeight) {
        //ball touches bottom of play area
        context.font = "20px sans-serif";
        context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
        gameOver = true;
    }

    context.fillStyle = "skyblue";
    for (let w = 0; w < blockArray.length; w++) {
        let block = blockArray[w];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                //break block & adjust vertical velocity based on collision direction
                block.break = true;
                ball.velocityY *= -1;
                score += 100;
                blockCount -= 1;
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                //break block & adjust horizontal velocity based on collision direction
                block.break = true;
                ball.velocityX *= -1;
                score += 100;
                blockCount -= 1;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    if (blockCount == 0) {
        score += 100*blockRows*blockColumns;
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }

    context.font = "20px sans-serif";
    context.fillText(score, 10, 25);
}


function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}


function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
            // console.log("RESET");
        }
        return;
    }
    if (e.code == "ArrowLeft") {
        let playerNextX = player.x - player.velocityX;
        if (!outOfBounds(playerNextX)) {
            player.x = playerNextX;
        }
    }
    else if (e.code == "ArrowRight") {
        let playerNextX = player.x + player.velocityX;
        if (!outOfBounds(playerNextX)) {
            player.x = playerNextX;
        }
    }
}


function detectCollision(a, b) {

    //The x position of the ball is less than the x position of the block plus its width
    return a.x < b.x + b.width &&
    //The x position of the ball plus its width is greater than the x position of the block
    a.x + a.width > b.x &&
    //The y position of the ball is less than the y position of the block plus its height
    a.y < b.y + b.height &&
    //The y position of the ball plus its height is greater than the position of the block
    a.y + a.height > b.y
}


function topCollision(ball, block) {
    debugger;
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}


function bottomCollision(ball, block) {
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}


function leftCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}


function rightCollision(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}


function createBlocks() {
    blockArray = [];
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x: blockX + c*blockWidth + c*10,
                y: blockY + r*blockHeight + r*10,
                width: blockWidth,
                height: blockHeight,
                break: false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}


function resetGame() {
    gameOver = false;
    player = {
        x: boardWidth/2 - playerWidth/2,
        y: boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX: playerVelocityX
    }
    ball = {
        x: boardWidth/2,
        y: boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX: ballVelocityX,
        velocityY: ballVelocityY
    }
    blockArray = [];
    blockRows = 3;
    score = 0;
    createBlocks();
}