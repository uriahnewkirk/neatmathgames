var you;
var yourScore = 0;
var opponent;
var opponentScore = 0;
var yScoreText = "Your Score: ";
var oScoreText = "CPU Score: ";

var choices = ["rock", "paper", "scissors"];

window.onload = function() {
    for (let z = 0; z < 3; z++) {
        let choice = document.createElement("img");
        choice.id = choices[z];
        choice.src = choices[z] + ".png";
        choice.addEventListener("click", selectChoice);
        document.getElementById("choices").append(choice);
    }
}

function selectChoice() {
    you = this.id;
    document.getElementById("your-choice").src = you + ".png";


    //generate random response from CPU
    opponent = choices[Math.floor(Math.random() * 3)];
    document.getElementById("opponent-choice").src = opponent + ".png";
    
    //evaluate responses & calculate winner
    if (you == opponent) {
        yourScore += 1;
        opponentScore += 1;
    }
    else {
        if (you == "rock") {
            if (opponent == "scissors") {
                yourScore += 1;
            }
            else if (opponent == "paper") {
                opponentScore += 1;
            }
        }
        else if (you == "scissors") {
            if (opponent == "paper") {
                yourScore += 1;
            }
            else if (opponent == "rock") {
                opponentScore += 1;
            }
        }
        else if (you == "paper") {
            if (opponent == "rock") {
                yourScore += 1;
            }
            else if (opponent == "scissors") {
                opponentScore += 1;
            }
        }
    }

    document.getElementById("your-score").innerText = yScoreText + yourScore;
    document.getElementById("opponent-score").innerText = oScoreText + opponentScore;
}