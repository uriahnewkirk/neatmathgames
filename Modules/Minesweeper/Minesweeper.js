let board = [];
let rows = 8;
let columns = 8;
let mineCount = 10;
let mineLocations = [];
let userTiles = 0; //tiles user has cleared/clicked
let flagEnabled = false;
let gameOver = false;


window.onload = function() {
    startGame();
}


function startGame() {
    document.getElementById("mine-count").innerText = mineCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    //verify board validity in dev console
    // console.log(board);
}


function setMines() {
    let minesLeft = mineCount;
    while (minesLeft > 0) {
        //randomly generate coordinates to place mines
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!mineLocations.includes(id)) {
            //decrement count after each mine is placed
            mineLocations.push(id);
            minesLeft -= 1;
        }
    }
}


function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgrey";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgrey";
    }
}


function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText = "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (mineLocations.includes(tile.id)) {
        gameOver = true;
        revealMines();
        return;
    }

    let coordinates = tile.id.split("-");
    let r = parseInt(coordinates[0]);
    let c = parseInt(coordinates[1]);
    checkForMine(r,c);
}


function revealMines() {
    //display mine locations after game over
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (mineLocations.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}


function checkForMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        //if invalid coordinates
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        //if tile was already clicked
        return;
    }

    board[r][c].classList.add("tile-clicked");
    userTiles += 1;

    let minesFound = 0;

    //check three tiles above & adjacent to selected tile
    minesFound += checkTile(r-1, c-1);
    minesFound += checkTile(r-1, c);
    minesFound += checkTile(r-1, c+1);

    //check tiles left & right of selected tile
    minesFound += checkTile(r, c-1);
    minesFound += checkTile(r, c+1);

    //check three tiles below & adjacent to selected tile
    minesFound += checkTile(r+1, c-1);
    minesFound += checkTile(r+1, c);
    minesFound += checkTile(r+1, c+1);

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        board[r][c].innerText = "";

        checkForMine(r-1, c-1);
        checkForMine(r-1, c);
        checkForMine(r-1, c+1);

        checkForMine(r, c-1);
        checkForMine(r, c+1);

        checkForMine(r+1, c-1);
        checkForMine(r+1, c);
        checkForMine(r+1, c+1);
    }

    if (userTiles == rows * columns - mineCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}


function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    
    if (mineLocations.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}