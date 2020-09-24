'use strict'
console.log('let us build the board!');

const FLAG = '!'
const MINE = '#'
var boardSize = 10;
var minesCount = 10;
var gBoard;
var gGame = {
    score: 1,
    isOn: false,
    maxFoodCount: 0
}


init();

function init() {
    var board = createBoard(boardSize, minesCount);
    console.log(board);
    renderBoard(board);

}
function renderBoard(board) {
    var strHtml = '<table>';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            var className = `cell cell-${i}-${j}`;
            strHtml += `<td onclick="cellClicked(this, ${i}, ${j})"
            data-i="${i}"
            data-j="${j}"
            class="${className}">`;
            strHtml += cell;
            strHtml += '</td>';
        }
        strHtml += '</tr>';
        strHtml += '</table>';
    }
    var elTable = document.querySelector('.board');
    elTable.innerHTML = strHtml;
    console.log(strHtml);
}

function makeCells () {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++){
            makeIndividualCell(i *10, j*10);

        }
    }
}
    
function makeIndividualCell (left,top) {
    var newCell = document.createElement('div');
    newCell.style.left = left + 'px';
    newCell.style.top = top + 'px';
    newCell.setAttribute('class','cells');
    document.getElementsByTagName('body') [0].appendChild(newCell)

}
makeCells();
function createBoard(boardSize, minesCount) {
    var board = [];
    for (var row = 0; row < boardSize; row++) {
        board[row] = []
        for (var coll = 0; coll < boardSize; coll++) {
            board[row][coll] = cell(row, coll, false, false, false, 0);
        }
    }
    board[0][1].mined = true;
    board[0][2].mined = true;
    board[0][3].mined = true;
    // board = randomizeMines(board, minesCount);
    negsMinesCount(board, boardSize);
    return board;
}

function randomizeMines(board, minesCount) {
    var mineCoor = [];
    for (var i = 0; i < minesCount; i++) {
        var randRowCoor = getRandomInt(0, boardSize);
        var randCollCoor = getRandomInt(0, boardSize);
        var cell = [randRowCoor] [randCollCoor];
        while (mineCoor.includes(cell)) {
            randRowCoor = getRandomInt(0, boardSize);
            randCollCoor = getRandomInt(0, boardSize);
            cell = [randRowCoor] [randCollCoor];
            
        }
        mineCoor.push(cell);
        board[cell].mined = true;
    }
    return board;
}

function negsMinesCount(board, size) {
    var cell;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            cell = board[i][j];
            cell.negsMineCount = countNeighbors(i,j,board);
            //check if cell mined: if true, lives--
            //if not: check the cells surrounding it 
        }
    }
}


function countNeighbors(cellI, cellJ, board) {
    var minesCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].mined) minesCount++;
        }
    }
    return minesCount;
}

function isMined(board, row, coll) {
    var cell = board[row + "" + coll];
    var mined = 0;
    if (typeof cell !== 'undefined') {
        mined = cell.mined ? 1 : 0;
    }
    return mined;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function gameOver() {
    console.log('Game Over');
    gGame.isOn = false;
    
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
    let span = elModal.querySelector('span');
    span.innerHTML = "Your score is " + gGame.score;
    var elBtn = elModal.querySelector('.my-btn');
    elBtn.onclick = function () {
        elModal.style.display = 'none';
        init();
    }
}
