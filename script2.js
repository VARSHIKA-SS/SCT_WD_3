const cells = document.querySelectorAll('.cell');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const vsPlayerBtn = document.getElementById('vsPlayerBtn');
const vsComputerBtn = document.getElementById('vsComputerBtn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = false;
let isVsComputer = true;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function startGame(vsComputerMode) {
  isVsComputer = vsComputerMode;
  resetBoard();
  isGameActive = true;
  statusDiv.textContent = `Your turn (X)`;
  if (isVsComputer && currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  }
}

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (board[index] !== '' || !isGameActive || (isVsComputer && currentPlayer === 'O')) return;

  makeMove(index, currentPlayer);
  e.target.classList.add('filled');

  if (checkWin(currentPlayer)) {
    highlightCells(getWinningCombo(currentPlayer), 'win');
    statusDiv.textContent = currentPlayer === 'X' ? "You win! 🎉" : "Computer wins! 🤖";
    isGameActive = false;
    return;
  }

  if (!board.includes('')) {
    highlightCells(null, 'draw');
    statusDiv.textContent = "It's a draw!";
    isGameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDiv.textContent = isVsComputer && currentPlayer === 'O'
    ? "Computer thinking..."
    : `Player ${currentPlayer}'s turn`;

  if (isVsComputer && currentPlayer === 'O') {
    setTimeout(computerMove, 600);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
}

function computerMove() {
  const available = board.map((v, i) => v === '' ? i : null).filter(i => i !== null);
  if (available.length === 0 || !isGameActive) return;

  const move = available[Math.floor(Math.random() * available.length)];
  makeMove(move, 'O');
  cells[move].classList.add('filled');

  if (checkWin('O')) {
    highlightCells(getWinningCombo('O'), 'win');
    statusDiv.textContent = "Computer wins! 🤖";
    isGameActive = false;
    return;
  }

  if (!board.includes('')) {
    highlightCells(null, 'draw');
    statusDiv.textContent = "It's a draw!";
    isGameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusDiv.textContent = "Your turn (X)";
}

function checkWin(player) {
  return winningConditions.some(condition =>
    condition.every(index => board[index] === player)
  );
}

function getWinningCombo(player) {
  return winningConditions.find(condition =>
    condition.every(index => board[index] === player)
  );
}

function highlightCells(indices, className) {
  if (indices) {
    indices.forEach(index => cells[index].classList.add(className));
  } else {
    cells.forEach(cell => cell.classList.add(className));
  }
}

function resetBoard() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('filled', 'win', 'draw');
  });
}

restartBtn.addEventListener('click', () => {
  resetBoard();
  isGameActive = true;
  statusDiv.textContent = `Your turn (X)`;
  if (isVsComputer && currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  }
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
vsPlayerBtn.addEventListener('click', () => startGame(false));
vsComputerBtn.addEventListener('click', () => startGame(true));

// Auto-start in Computer mode
window.onload = () => startGame(true);
