//game board
let tileSize = 32;
let rows = 16;
let columns = 16;
let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

//player ship
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize/2;
let shipImg;
let shipVelocityX = tileSize;
let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
}

//array representing aliens position as they move across screen
let alienArray = [];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;
let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;
let alienVelocityX = 1;

let bulletArray = [];
let bulletVelocityY = -10;

let score = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    shipImg = new Image();
    shipImg.src = "../../assets/ship.png";
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    alienImg = new Image();
    alienImg.src = "../../assets/alien.png";
    createAliens();

    requestAnimationFrame(update);
    //keyboard input listeners
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}


function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    for (let w = 0; w < alienArray.length; w++) {
        let alien = alienArray[w];
        //update board & draw aliens moving back and forth across screen
        if (alien.alive) {
            alien.x += alienVelocityX;

            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX*2;

                for (let p = 0; p < alienArray.length; p++) {
                    alienArray[p].y += alienHeight;
                }
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

            if (alien.y >= ship.y) {
                gameOver = true;
            }
        }
    }

    for (let w = 0; w < bulletArray.length; w++) {
        let bullet = bulletArray[w];
        bullet.y += bulletVelocityY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        for (let w = 0; w < alienArray.length; w++) {
            let alien = alienArray[w];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }

    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        //array for moving the bullet across the game board
        bulletArray.shift();
    }

    if (alienCount == 0) {
        //bonus score for defeating each wave of aliens
        score += alienColumns * alienRows * 100;
        alienColumns = Math.min(alienColumns + 1, columns/2 -2);
        alienRows = Math.min(alienRows + 1, rows-4);
        if (alienVelocityX > 0) {
            alienVelocityX += 0.2;
        }
        else {
            alienVelocityX -= 0.2;
        }
        alienArray = [];
        bulletArray = [];
        createAliens();
    }

    //display score top-left
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
}


function moveShip(e) {
    if (gameOver) {
        return;
    }
    //check x position before moving ship outside game board bounds
    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX;
    }
    //check x position before moving ship outside game board bounds
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX;
    }
}


function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img: alienImg,
                x: alienX + c*alienWidth,
                y: alienY + r*alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}


function shoot(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "Space") {
        let bullet = {
            x: ship.x + shipWidth*15/32,
            y: ship.y,
            width: tileSize/8,
            height: tileSize/2,
            used: false
        }
        bulletArray.push(bullet);
    }
}


function detectCollision(a, b) {
    //The x position of the a is less than the x position of b plus its width
    return a.x < b.x + b.width &&
    //The x position of a plus its width is greater than the x position of b
    a.x + a.width > b.x &&
    //The y position of a is less than the y position of b plus its height
    a.y < b.y + b.height &&
    //The y position of a plus its height is greater than the y position of b
    a.y + a.height > b.y
}