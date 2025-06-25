var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
}

function setGame() {

    board = [
        //4x4 game grid array
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]

    for (let z = 0; z < rows; z++) {
        for (let f = 0; f < columns; f++) {
            let tile = document.createElement("div");
            tile.id = z.toString() + "-" + f.toString();
            let num = board[z][f];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    //start each game with two [2] tiles
    setTwo();
    setTwo();
}

function updateTile(tile, num){
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <=4096) {
            tile.classList.add("x" +num.toString());
        }
        else {
            tile.classList.add("x8192");
        }
    }
}

/*
    For this game, the user will use the arrow keys 
    to control which direction the tiles are sliding.
    To help the page itself being scrolled when any of 
    these keys are pressed, the below function will 
    disable the defualt functionality of the arrow keys 
    in the user's web browser.
*/
window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

document.addEventListener('keyup', (e) => {
    
    //call function based on which key is pressed
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }

    //update the score tracker
    document.getElementById("score").innerText = score;
})

function filterZero(row) {
    //check for and remove any [0] tiles in the row
    return row.filter(num => num != 0);
}

function slide(row) {

    row = filterZero(row);
    for (let r = 0; r < row.length-1; r++) {

        //if one tile has a tile to the right with the same number
        if (row[r] == row[r+1]) {
            //multiply by two & store new value in the tile
            row[r] *= 2;
            //the other tile is removed so set equal to zero
            row[r + 1] = 0;
            //update user's score by the new tile's value
            score += row[r];
        }
    }
    row = filterZero(row);

    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {

    for (let r = 0; r < rows; r++) {
        debugger;
        let row = board[r];
        row = slide(row);
        board[r] = row;
        
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {

    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() +"-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }

    }
}

function slideUp() {

    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() +"-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }

    }
}

function slideDown() {

    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() +"-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {

    //create & place a [2] tile
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {

        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() +"-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {

    //check for where no tiles are present
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}