

let domElements = {
    game: "game-container",
    body: "body",
    spot: "game-container__square",
    scoreboard: "scoreboard__player-data__player__score",
    btn: "scoreboard__player-data__button",
}


let gameVariables = {
  X: 0,
  O: 0,
  tie: 0,
  winner: null,
}

var human, ai, currentPlayer, board;
let gameContainer, body;
let spot, id = 1;

function buildBoard(){
    gameContainer = document.createElement('div');
    gameContainer.classList.add(domElements.game);
    body = document.querySelector(domElements.body);
    body.appendChild(gameContainer);
    buildSpotsOnBoard();
}

function  buildSpotsOnBoard(){
    for(let i = 0; i < 9; i ++){
        spot = document.createElement('div');
        spot.classList.add(domElements.spot);
        spot.classList.add(domElements.spot + "--" + id);
        spot.id = id;
        gameContainer.appendChild(spot);
        id++;
    }
}

function addClickButtonToAllSquares(){
    for(let i = 1; i <= 9; i++ ){
        document.querySelector("."+domElements.spot + "--" + i).addEventListener("click", takeTurn , {once: true});
    }
} 

function removeClickButtonToAllSquares(){
    for(let i = 1; i <= 9; i++ ){
        document.querySelector("."+domElements.spot + "--" + i).removeEventListener('click', takeTurn);
    }
}

function render(){
    let id = 1;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            document.querySelector("."+domElements.spot + "--" + id).textContent = board[i][j];
            id++;   
        }
    }

    addNotAllwedToFilledSpots();
}

function equals3(a, b, c) {
    return a == b && b == c && a != '';
}

function checkWinner() {
    
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  } 
}

let scores = {
    tie: 0,
    X: 1,
    O: -1,
}

function min(a, b){
    if(a < b){
        return a;
    }
    return b;
}

function max(a, b){
    if(a > b){
        return a;
    }
    return b;
}
function minimax(board, depth, isMaximizing){
  let result = checkWinner();
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';
          bestScore = max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = human;
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          bestScore = min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

function addRestartButton(){
  let restartBtn = document.querySelector("." + domElements.btn + "--restart-btn");
  restartBtn.style.display = "flex";
  restartBtn.addEventListener('click', restartGame);
}

function removeRestartButton(){
  let restartBtn = document.querySelector("." + domElements.btn + "--restart-btn");
  restartBtn.style.display = "none";
}

function removeResult(){
  let winnerElement = document.getElementById("winner");
  winnerElement.textContent = "";
}

function addClickEventToResetBtn(){
  let resetBtn = document.querySelector("." + domElements.btn + "--reset-btn");
  resetBtn.addEventListener('click', resetScores);
}

function resetScores(){
  gameVariables.O = 0;
  gameVariables.X = 0;
  gameVariables.tie = 0;
  gameVariables.winner = "";

  let humanScore = document.querySelector(".scoreboard__player-data__player__score--X");
  humanScore.textContent = 0;

  let compScore = document.querySelector(".scoreboard__player-data__player__score--O");
  compScore.textContent = 0;

  let draw = document.querySelector(".scoreboard__player-data__player__score--tie");
  draw.textContent = 0;

  let result = document.querySelector("#winner");
  result.textContent = "";
}

function restartGame(){
  //console.log("Restarting Game");
  board = [
    ['','',''],
    ['','',''],
    ['','',''],
  ];
  render();
  addClickButtonToAllSquares();
  removeNotAllowedToAllSquares();
  currentPlayer = human;
  removeResult();
  removeRestartButton();
}

function bestMove(){
    let bestScore = -Infinity;
    let move;


    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(board[i][j] === ''){
                board[i][j] = ai;
                let score = minimax(board, 0, false);
                board[i][j] = '';
                if(score > bestScore){
                    bestScore = score;
                    move = {i, j};
                }
            }
        }
    }
    board[move.i][move.j] = ai;
    render();
    let winner = checkWinner();
    if(winner === null){
      switchPlayer();
    }
    else if(winner === "tie"){
      updateScoreBoard(winner);
      addRestartButton();
    }else {
      updateScoreBoard(winner);
      addRestartButton();
    }
   
}

function updateScoreBoard(winner){
  //console.log("So, the winner is " + winner);
  gameVariables.winner = winner;
  gameVariables[winner]+= 1;
  //console.log(gameVariables[winner]);
  let score = document.querySelector("."+ domElements.scoreboard + "--" + winner);
  score.textContent = gameVariables[winner];


  let winnerElement = document.getElementById("winner");
  if(winner === "X"){
    winnerElement.textContent = "Computer";
  }
  else if(winner === "O"){
    winnerElement.textContent = "You";
  }
  else {
    winnerElement.textContent = "Draw";
  }
  
}

function addNotAllwedToFilledSpots(){
  for(let i = 1; i <= 9; i++ ){
    let spot = document.getElementById(i);
    if(spot.textContent !== ""){
      spot.classList.add(domElements.spot+ "--not-allowed");
    }
  }
}

function removeNotAllowedToAllSquares(){
  for(let i = 1; i <= 9; i++ ){
    let spot = document.getElementById(i);
    if(spot.textContent === ""){
      spot.classList.remove(domElements.spot + "--not-allowed");
    }
  }
}
function addNotAllowedToAllSquares(){
  for(let i = 1; i <= 9; i++ ){
    let spot = document.getElementById(i);
    spot.classList.add(domElements.spot+ "--not-allowed");
  }
}
function takeTurn(e){
    let clickedSquare = e.target;
    var indices = getIdices(clickedSquare.id);
    if(board[indices[0]][indices[1]] === ""){
        board[indices[0]][indices[1]] = currentPlayer;
        render();
        addNotAllowedToAllSquares();
        let winner = checkWinner();
        if(winner === null){
            switchPlayer();
        }
        else if(winner === "tie"){
          updateScoreBoard(winner);
          addRestartButton();
        }
        else {
          updateScoreBoard(winner);
          addRestartButton();
        }
    }
    else {
        alert("!! Choose another spot !!");
    }
  
    
}

function switchPlayer(){
    if(currentPlayer === human){
        currentPlayer = ai;
        removeClickButtonToAllSquares();
        
        setTimeout(bestMove, 800);
    }
    else {
        currentPlayer = human;
        addClickButtonToAllSquares();
        removeNotAllowedToAllSquares();
    }
}


function getIdices(spot){
    switch(spot){
        case "1":
            return [0, 0];
        break;    
        case "2":
            return [0, 1];
        break;    
        case "3":
            return [0, 2];
        break;    
        case "4":
            return [1, 0];
        break;    
        case "5":
            return [1, 1];
        break;    
        case "6":
            return [1, 2];
        break;    
        case "7":
            return [2, 0];
        break;    
        case "8":
            return [2, 1];
        break;    
        case "9":
            return [2, 2];
        break;    
    }
}


(function(){
    /*   console.log("!!  Game Started !!"); */
        human = 'O';
        ai = "X";
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ];
        buildBoard();
        addClickButtonToAllSquares();
        addClickEventToResetBtn();
        currentPlayer = human;
  })();