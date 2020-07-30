//alert("Developing Tic Tac Toe");



let player1 = "X";
let player2 = "O";
let currentPlayer = player1;
// 2d board 3 by 3
let board = [
    ['','',''],
    ['','',''],
    ['','','']
];


// now we have to add click button event to all squares
// Click Event is working successfully
function addClickButtonEvent(){
    for(let i = 1; i <= 9; i++){
        document.getElementById(i).addEventListener('click', takeTurn);
    }
}

function takeTurn(event){
    let noOfSeletedSquare = event.target.id;
    let indices = getIndices(noOfSeletedSquare);
    let i = indices[0];
    let j = indices[1];

    if(board[i][j] === ""){
        // If that paricular choosen spot is empty
        board[i][j] = currentPlayer;
        // Now we have to render the board
        render();
        let winner = checkWinner();
        if(winner === null){
            switchPlayer();
        }
        else if(winner === "Tie"){
            console.log("Its a Tie");
        }
        else {
            console.log("So the winner is " + winner);
        }
       
    }
    else{
        alert("Alreay Filled");
        //Its working fine
    }
    
}

function equals(a, b, c){
    return (a === b && b === c && a !=='');
}
function checkWinner(){
    let winner = null;
    // Checking for rows

    for(let i = 0; i < 3; i++){
        if(equals(board[i][0],  board[i][1],  board[i][2]) ){
            winner = board[i][0];
        }
    }

    // Checking For Coloums

    for(let i = 0; i < 3; i++){
        if(equals(board[0][i],  board[1][i],  board[2][i]) ){
            winner = board[0][i];
        }
    }

    // Now checking for both dioganls

    for(let i = 0; i < 3; i++){
        if(equals(board[0][0],  board[1][1],  board[2][2]) ){
            winner = board[0][0];
        }
    }

    for(let i = 0; i < 3; i++){
        if(equals(board[0][2],  board[1][1],  board[2][0]) ){
            winner = board[0][2];
        }
    }


    let freeSpots = 0;

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(board[i][j] === ''){
                freeSpots++;
            }
        }
    }


    if(freeSpots === 0 && winner === null){
        return "Tie";
    }
    else {
        return winner;
    }
    
}

// Now we have to check for the winner
// And also we cannot place x and o on already filled spot
function render(){
    let id = 1;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            document.getElementById(id).textContent = board[i][j];
            id++;
        }
    }
}
// Now we have to switch player


function switchPlayer(){
    if(currentPlayer === player1){
        currentPlayer = player2;
    }
    else{
        currentPlayer = player1;
    }
    
}
function getIndices(no){
    switch(no){
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
addClickButtonEvent();

// Now we have to place our symbol on board



// So this is it you have just made TIC TAC TOE
// Congrats
// Subscribe For more OF these videos
// Good Bye