const boardElement = document.getElementById('sudoku-board');
let solution = [];
let puzzle = [];

function generateSudoku() {
    solution = generateFullBoard();
    puzzle = maskBoard(solution, level);
    renderBoard(puzzle);
}

function renderBoard(board) {
    boardElement.innerHTML = ''; //Khởi tạo bảng
    for (let row = 0; row < 9; row++) {      //Vòng lặp qua các hàng
        for (let col = 0; col < 9; col++) {
            const input = document.createElement('input');   //Tạo ô nhập liệu
            input.classList.add('cell');
            input.setAttribute('maxlength', '1');

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
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[boxRow + i][boxCol + j] === num) return false;
        }
    }
    return true;
}

function maskBoard(board, level) {
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
generateSudoku(); // load mặc định
