class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isMine = false;
        this.isRevealed = false;
        this.isFlagged = false;
    }
}

const minefield = [];
let flagCount = 0;
let timerInterval;
let startTime;

function createBoard(width, height) {
    const gridWidth = width;
    const gridHeight = height;
    for (let x = 0; x < gridWidth; x++) {
        minefield[x] = [];
        for (let y = 0; y < gridHeight; y++) {
            minefield[x][y] = new Cell(x, y);
        }
    }
    return minefield;
}

function getAdjacentCells(cell, minefield) {
    const adjacentCells = [];
    const gridWidth = minefield.length;
    const gridHeight = minefield[0].length;

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;

            const newX = cell.x + dx;
            const newY = cell.y + dy;

            if (newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridHeight) {
                adjacentCells.push(minefield[newX][newY]);
            }
        }
    }

    return adjacentCells;
}

function placeMines(numberOfMines) {
    let minesPlaced = 0;

    while (minesPlaced < numberOfMines) {
        const x = Math.floor(Math.random() * minefield.length);
        const y = Math.floor(Math.random() * minefield[0].length);

        if (!minefield[x][y].isMine) {
            minefield[x][y].isMine = true;
            minesPlaced++;
        }
    }
    return minesPlaced;
}

function getAdjacentMines(cell, minefield) {
    const adjacentCells = getAdjacentCells(cell, minefield);
    let mineCount = 0;
    for (const adjacentCell of adjacentCells) {
        if (adjacentCell.isMine) {
            mineCount++;
        }
    }
    return mineCount;
}

function renderBoard(minefield) {
    const minefieldElement = document.getElementById('minefield');
    minefieldElement.innerHTML = '';
    for (let x = 0; x < minefield.length; x++) {
        for (let y = 0; y < minefield[x].length; y++) {
            const cell = minefield[x][y];
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.x = x;
            cellElement.dataset.y = y;
            
            cellElement.addEventListener('click', () => revealCell(cell));
            cellElement.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                toggleFlag(cell);
            });
            minefieldElement.appendChild(cellElement);
        }
    }
}

function revealCell(cell) {
    const cellElement = document.querySelector(`.cell[data-x='${cell.x}'][data-y='${cell.y}']`);
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;

    if (cell.isMine) {
        cellElement.classList.add('mine');
        alert("Game Over!");
        revealAllMines();
        clearInterval(timerInterval);
    } else {
        const adjacentMines = getAdjacentMines(cell, minefield);
        cellElement.classList.add('revealed');
        if (adjacentMines > 0) {
            cellElement.textContent = adjacentMines;
        } else {
            cellElement.textContent = '';
            const adjacentCells = getAdjacentCells(cell, minefield);
            for (const adjacentCell of adjacentCells) {
                if (!adjacentCell.isRevealed) {
                    revealCell(adjacentCell);
                }
            }
        }
        checkWinCondition();
    }
}

function revealAllMines() {
    for (let x = 0; x < minefield.length; x++) {
        for (let y = 0; y < minefield[x].length; y++) {
            const cell = minefield[x][y];
            if (cell.isMine) {
                const cellElement = document.querySelector(`.cell[data-x='${cell.x}'][data-y='${cell.y}']`);
                cellElement.classList.add('mine');
            }
        }
    }
}

function toggleFlag(cell) {
    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    const cellElement = document.querySelector(`.cell[data-x='${cell.x}'][data-y='${cell.y}']`);

    if (cell.isFlagged) {
        cellElement.classList.add('flagged');
        cellElement.textContent = '🚩';
        flagCount++;
    } else {
        cellElement.classList.remove('flagged');
        cellElement.textContent = '';
        flagCount--;
    }
    updateFlagCounter();
}

function updateFlagCounter() {
    const flagCounterElement = document.getElementById('flag-counter');
    flagCounterElement.textContent = `Flags: ${flagCount}`;
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    timerElement.textContent = `Time: ${elapsedSeconds}s`;
}

function checkWinCondition() {
    let revealedCells = 0;
    let totalMines = 0;

    for (let x = 0; x < minefield.length; x++) {
        for (let y = 0; y < minefield[x].length; y++) {
            const cell = minefield[x][y];
            if (cell.isRevealed) revealedCells++;
            if (cell.isMine) totalMines++;
        }
    }

    if (revealedCells + totalMines - 1 === minefield.length * minefield[0].length) {
        alert("Congratulations! You've won!");
        clearInterval(timerInterval);
    }
}

createBoard(10, 10);
placeMines(10);
renderBoard(minefield);
updateFlagCounter();
startTimer();
