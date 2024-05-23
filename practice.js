class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isMine = false;
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

createBoard(3, 3);
placeMines(7);

const exampleCell = minefield[1][1];

const adjacentmines = getAdjacentMines(exampleCell, minefield);
// console.log(adjacentmines);

const adjacentCells = getAdjacentCells(exampleCell, minefield);
// console.log(adjacentCells);

console.log(minefield)