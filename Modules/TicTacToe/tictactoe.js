var board;
var playerO = "O";
var playerX = "X";
var currentP = playerO;
var gameOver = false;

window.onload = function() {
    setGame();
}

function setGame() {
    board = [
        ['','',''],
        ['','',''],
        ['','','']
    ]

    for(let b = 0; b < 3; b++) {
        for(let m = 0; m < 3; m++) {
            let tile = document.createElement("div");
            tile.id = b.toString() + "-" + m.toString();
            tile.classList.add("tile");

            if(b == 0 || b == 1) {
                tile.classList.add("horizontal-line");
            }
            if (m == 0 || m == 1) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", setTile);
            document.getElementById("board").append(tile);
        }
    }
}

function setTile() {
    if (gameOver) {
        return;
    }

    let coords = this.id.split("-");
    let p = parseInt(coords[0]);
    let q = parseInt(coords[1]);

    if (board[p][q] != '') {
        return;
    }

    debugger;
    board[p][q] = currentP;
    this.innerText = currentP;

    if (currentP == playerO) {
        currentP = playerX;
    }
    else {
        currentP = playerO;
    }

    checkWinner();
    if (gameOver == true) {
        displayWinner();
    }
}

function checkWinner() {
    //check rows
    for (let i = 0; i < 3; i++) {
        if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != '') {
            for (let u = 0; u < 3; u++) {
                let tile = document.getElementById(i.toString() + "-" + u.toString());
                tile.classList.add("winnerH");
            }
            gameOver = true;
            return;
        }
    }

    //check columns
    for (let r = 0; r < 3; r++) {
        if (board[0][r] == board[1][r] && board[1][r] == board[2][r] && board[0][r] != '') {
            for (let t = 0; t < 3; t++) {
                let tile = document.getElementById(t.toString() + "-" + r.toString());
                tile.classList.add("winnerH");
            }
            gameOver = true;
            return;
        }
    }

    //check diagonals
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != '') {
        for(let r = 0; r < 3; r++) {
            debugger;
            let tile = document.getElementById(r.toString() + "-" + r.toString());
            tile.classList.add("winnerH");
        }
        gameOver = true;
        return;
    }

    //check anti-diagonal
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != '') {

        let tile = document.getElementById("0-2");
        tile.classList.add("winnerH");

        tile = document.getElementById("1-1");
        tile.classList.add("winnerH");

        tile = document.getElementById("2-0");
        tile.classList.add("winnerH");

        gameOver = true;
        return;
    }
}

function displayWinner() {
    var winnerText = document.getElementById("playerWins");
    var resetButton = document.getElementById("resetButton");
    currentP = currentP == playerO ? playerX : playerO;
    winnerText.append(" " +currentP +" wins the game");
    winnerText.style.visibility = 'visible';
    winnerText.style.display = 'block';
    resetButton.style.visibility = 'visible';
    resetButton.style.display = 'inline-block';
}

function resetGame() {
    board = [
        ['','',''],
        ['','',''],
        ['','','']
    ];

    var winnerText = document.getElementById("playerWins");
    var resetButton = document.getElementById("resetButton");

    currentP = playerO;
    gameOver = false;

    winnerText.innerHTML = '';
    winnerText.innerText = 'WINNER!'
    winnerText.style.display = 'none';
    winnerText.style.visibility = 'hidden';
    resetButton.style.visibility = 'hidden';
    resetButton.style.display = 'none';


    for (let s = 0; s < 3; s++) {

        for (let w = 0; w < 3; w++) {

            debugger;
            let tile = document.getElementById(s.toString() + "-" + w.toString());
            tile.classList.remove("winnerH");
            tile.innerText = tile.innerHTML = '';
            
        }
    }

}