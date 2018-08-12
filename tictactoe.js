class Game {
  constructor() {
    this.board = [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' ']
    ];
    this.moveCount = 0;
    this.isWon = false;
    this.isDraw = false;
    this.currentPlayer = 'X';
    this.gameContainer = document.getElementById('game-container');
    this.gameMessageContainer = document.getElementById('game-message');
    this.cells = '';

    this.resetButton = document.getElementById('reset');
  }

  play() {
    this.boardToHtml();
    this.setDomBoard();
    this.setBoardEventListeners();
    this.resetButton.addEventListener('click', (e) => {
      this.reset();
    })
  }

  reset() {
    this.board = [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' ']
    ];
    this.moveCount = 0;
    this.isWon = false;
    this.isDraw = false;
    this.currentPlayer = 'X';
    this.gameMessageContainer.innerHTML = '';
    this.gameContainer.classList.remove('disabled');
    this.play();
  }

  getDomBoard() {
    return this.domBoard;
  }

  setDomBoard() {
    this.gameContainer.innerHTML = this.getDomBoard();
  }

  setBoardEventListeners() {
    this.cells = document.querySelectorAll('.cell');
    this.cells.forEach((cell) => {
      cell.addEventListener('click', (e) => {
        this.setMove(e)
      });
    });
  }

  getIndex(e) {
    return Array.from(this.cells).indexOf(e.target);
  }

  setMove(e) {
    this.moveCount++;
    const moveIndex = this.getIndex(e);
    const coordinates = this.calculateCoordinates(moveIndex);
    this.updateBoard(coordinates);

    this.checkIsWon();
    this.checkIsDraw();
    if (this.isWon || this.isDraw) {
      this.finishGame();
      return;
    }

    this.setBoardEventListeners();

    this.updateCurrentPlayer();
  }

  finishGame() {
    this.gameContainer.className += 'disabled';
    let message = '';
    if (this.isWon) {
      message = `Game over. Player ${this.currentPlayer} has won!`
    } else {
      message = `Game over. Game is a draw.`
    }
    this.gameMessageContainer.innerHTML = message;
  }

  checkIsDraw() {
    this.isDraw = this.moveCount >= 9;
  }

  checkIsWon() {
    const winningIndexes = this.getWinningIndexes();
    let isWon = false;

    for(const winningIndex of winningIndexes) {
      let first = this.calculateCoordinates(winningIndex[0]);
      let second = this.calculateCoordinates(winningIndex[1]);
      let third = this.calculateCoordinates(winningIndex[2]);

      if (this.currentPlayer === this.board[first[0]][first[1]] &&
        this.board[first[0]][first[1]] === this.board[second[0]][second[1]] &&
        this.board[first[0]][first[1]] === this.board[third[0]][third[1]]) {
          isWon = true;
      }
    }

    this.isWon = isWon;
  }

  updateCurrentPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  updateBoard(coordinates) {
    const currentPlayer = this.currentPlayer;
    this.board[coordinates[0]][coordinates[1]] = currentPlayer;
    this.boardToHtml();
    this.setDomBoard();
  }

  calculateCoordinates(moveIndex) {
    const x = Math.floor(moveIndex/3);
    const y = moveIndex % 3;
    return [x, y];
  }

  boardToHtml() {
    let displayBoard = '';
    for (let i = 0; i < 3; i++) {
      displayBoard += '<div class ="row">';
      displayBoard += `<div class="cell">`;
      displayBoard += this.board[i].join(`</div><div class="cell">`);
      displayBoard += '</div></div>';
    }

    this.domBoard = displayBoard;
  }

  getWinningIndexes() {
    return [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]
  }
}


window.onload = () => {
  game = new Game();
  game.play();
}