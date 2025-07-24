const boardElement = document.getElementById('sudoku-board');
let solution = [];
let puzzle = [];

function generateSudoku() {
    solution = generateFullBoard();
    puzzle = maskBoard(solution);
    renderBoard(puzzle);
}

function renderBoard(board) {
    boardElement.innerHTML = ''; //Khởi tạo bảng
    for (let row = 0; row < 9; row++) {      //Vòng lặp qua các hàng
        for (let col = 0; col < 9; col++) {
            const input = document.createElement('input');   //Tạo ô nhập liệu
            input.classList.add('cell');
            input.setAttribute('maxlength', '1'); //Chi cho phep nhap tu 1 - 9

            if ((row % 3 === 0 && row !== 0)) input.style.borderTop = '2px solid black';
            if ((col % 3 === 0 && col !== 0)) input.style.borderLeft = '2px solid black';

            if (board[row][col] !== 0) {
                input.value = board[row][col];
                input.disabled = true;
                input.classList.add('fixed');
            } else {
                input.addEventListener('input', (e) => {
                    const val = parseInt(e.target.value);
                    const correct = solution[row][col];
                    if (val === correct) {
                        e.target.classList.remove('error');
                    } else {
                        e.target.classList.add('error');
                    }
                });
            }
            boardElement.appendChild(input);
        }
    }
}

function generateFullBoard() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveBoard(board);
    return board;
}

function solveBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (let num of numbers) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveBoard(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
    }
    //VD: row = 5, col 8
    const boxRow = Math.floor(row / 3) * 3; // (5/3)*3 = 3
    const boxCol = Math.floor(col / 3) * 3; // (8/3)*3 = 6
    //(0,0) (0,1) (0,2) | (0,3) (0,4) (0,5) | (0,6) (0,7) (0,8)
    // (1,0) (1,1) (1,2) | (1,3) (1,4) (1,5) | (1,6) (1,7) (1,8)
    // (2,0) (2,1) (2,2) | (2,3) (2,4) (2,5) | (2,6) (2,7) (2,8)
    // -----------------+------------------+-----------------
    // (3,0) (3,1) (3,2) | (3,3) (3,4) (3,5) | (3,6) (3,7) (3,8)
    // (4,0) (4,1) (4,2) | (4,3) (4,4) (4,5) | (4,6) (4,7) (4,8)
    // (5,0) (5,1) (5,2) | (5,3) (5,4) (5,5) | (5,6) (5,7) (5,8)<-
    // -----------------+------------------+-----------------
    // (6,0) (6,1) (6,2) | (6,3) (6,4) (6,5) | (6,6) (6,7) (6,8)
    // (7,0) (7,1) (7,2) | (7,3) (7,4) (7,5) | (7,6) (7,7) (7,8)
    // (8,0) (8,1) (8,2) | (8,3) (8,4) (8,5) | (8,6) (8,7) (8,8)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[boxRow + i][boxCol + j] === num) return false;
        }
    }
    return true;
}

function maskBoard(board) {
    const newBoard = board.map(row => row.slice());
    let clues =  36; //Thay đổi số ô trống
    let cellsToRemove = 81 - clues;
    while (cellsToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (newBoard[row][col] !== 0) {
            newBoard[row][col] = 0;
            cellsToRemove--;
        }
    }
    return newBoard;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

