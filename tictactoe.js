(() => {
  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const resetBtn = document.getElementById("resetBtn");

  // Score buttons
  const xWinsBtn = document.getElementById("xWinsBtn");
  const oWinsBtn = document.getElementById("oWinsBtn");
  const drawsBtn = document.getElementById("drawsBtn");

  // Score counters
  let xWins = 0;
  let oWins = 0;
  let draws = 0;

  const WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  let board = Array(9).fill(null);
  let current = "X";
  let gameOver = false;

  function createBoard() {
    boardEl.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.dataset.index = i;
      cell.addEventListener("click", onCellClick);
      boardEl.appendChild(cell);
    }
    updateStatus();
  }

  function onCellClick(e) {
    const index = e.target.dataset.index;

    if (board[index] || gameOver) return;

    board[index] = current;
    render();

    const winner = checkWinner();
    if (winner) {
      statusEl.textContent = `Player ${winner} wins!`;
      gameOver = true;

      // Update score counters
      if (winner === "X") {
        xWins++;
        xWinsBtn.textContent = "X Wins: " + xWins;
      } else {
        oWins++;
        oWinsBtn.textContent = "O Wins: " + oWins;
      }

      highlightWinner(winner);
      return;
    }

    if (board.every(cell => cell !== null)) {
      statusEl.textContent = "Draw!";
      gameOver = true;

      draws++;
      drawsBtn.textContent = "Draws: " + draws;

      return;
    }

    current = current === "X" ? "O" : "X";
    updateStatus();
  }

  function render() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, i) => {
      cell.textContent = board[i] || "";
    });
  }

  function updateStatus() {
    if (!gameOver) {
      statusEl.textContent = `Player ${current}'s turn`;
    }
  }

  function checkWinner() {
    for (let combo of WIN_PATTERNS) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  function highlightWinner(winner) {
    const cells = document.querySelectorAll(".cell");
    for (let combo of WIN_PATTERNS) {
      const [a, b, c] = combo;
      if (board[a] === winner && board[b] === winner && board[c] === winner) {
        cells[a].classList.add("win");
        cells[b].classList.add("win");
        cells[c].classList.add("win");
        break;
      }
    }
  }

  resetBtn.addEventListener("click", () => {
    board.fill(null);
    current = "X";
    gameOver = false;

    const cells = document.querySelectorAll(".cell");
    cells.forEach(c => c.classList.remove("win"));

    render();
    updateStatus();
  });

  createBoard();
})();
