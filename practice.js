class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isMine = false;
        this.isRevealed = false;
    }
}

const minefield = [];

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
            minefieldElement.appendChild(cellElement);
        }
    }
}

function revealCell(cell) {
    const cellElement = document.querySelector(`.cell[data-x='${cell.x}'][data-y='${cell.y}']`);
    if (cell.isRevealed) return;

    cell.isRevealed = true;

    if (cell.isMine) {
        cellElement.classList.add('mine');
        alert("Game Over!");
        revealAllMines();
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

createBoard(10, 10);
placeMines(5);
renderBoard(minefield);
