// Generate array of numbers within specified range
function range(a, b) {
    return new Array(b - a + 1).fill(0).map((_, i) => i + a);
}

// Make one dimensional grid of specified size
function makeFlatGrid(rows, columns) {
    return new Array(rows * columns).fill(0);
}

// Shuffle array based on Fisher-Yates shuffling algorithm
function shuffle(arr) {
    const shuffled = [...arr];
    let randIndex;
    for (let i = arr.length - 1; i >= 0; i--) {
        randIndex = Math.floor((Math.random() * i));
        [shuffled[i], shuffled[randIndex]] = [shuffled[randIndex], shuffled[i]];
    }
    return shuffled;
}

// Fill array with specified number of bombs (-1), then shuffle them to random places
function setBombsRandomly(flatGrid, nBombs) {
    const gridWithBombs = flatGrid.map((x, i) => i < nBombs ? -1 : x);
    return shuffle(gridWithBombs);
}

// Partition flat grid into n number of subarrays, where n is the square number of the input grid length.
function convertFlatGridToDeep(flatGrid) {
    const n = Math.sqrt(flatGrid.length);
    if (n % 1 === 0) {
        const deepGrid = [];
        for (let i = 0; i < flatGrid.length; i += n) {
            deepGrid.push(flatGrid.slice(i, i + n));
        }
        return deepGrid;
    } else {
        throw new Error("Flatgrid length has to be a square number.");
    }
}

// Label non-bomb grid cells based on how many bomb neighbours they have.
function labelNonBombCells(deepGrid) {
    const labeledGrid = deepGrid.map(arr => arr.slice());
    const len = labeledGrid.length - 1;
    let top, right, bottom, left, topright, topleft, bottomright, bottomleft;
    let directions, neighbouringBombs;
    for (let i = 0; i <= len; i++) {
        for (let j = 0; j <= len; j++) {
            if (labeledGrid[i][j] !== -1) {
                // console.log(labeledGrid)
                topleft = (i > 0 && j > 0) ? labeledGrid[i - 1][j - 1] : 0;
                top = i > 0 ? labeledGrid[i - 1][j] : 0;
                topright = (i > 0 && j < len) ? labeledGrid[i - 1][j + 1] : 0;
                right = j < len ? labeledGrid[i][j + 1] : 0;
                bottomright = (i < len && j < len) ? labeledGrid[i + 1][j + 1] : 0;
                bottom = i < len ? labeledGrid[i + 1][j] : 0;
                bottomleft = (i < len && j > 0) ? labeledGrid[i + 1][j - 1] : 0;
                left = j > 0 ? labeledGrid[i][j - 1] : 0;

                directions = [];
                directions.push(topleft, top, topright, right, bottomright, bottom, bottomleft, left);
                neighbouringBombs = directions.filter(x => x === -1).length;
                labeledGrid[i][j] = neighbouringBombs;
            }
        }
    }
    return labeledGrid;
}

function initGrid(rows, columns, nBombs) {
    const a = makeFlatGrid(rows, columns);
    const b = setBombsRandomly(a, nBombs);
    const c = convertFlatGridToDeep(b);
    const d = labelNonBombCells(c);
    return d;
}

// Check if a value exists in a 2D array at specified x and y coordinates/indices. 
function expectArrVal(x, y, arr, exp) {
    if (x >= 0 && x < arr.length && y >= 0 && y < arr[x].length && arr[x][y] === exp) {
        return true;
    } else {
        return false;
    }
}

// Check if a value doesn't exists in a 2D array at specified x and y coordinates/indices. 
function expectNotArrVal(x, y, arr, exp) {
    if (x >= 0 && x < arr.length && y >= 0 && y < arr[x].length && arr[x][y] !== exp) {
        return true;
    } else {
        return false;
    }
}

// Check if object has duplicates in array.
function checkDuplicateCoord(el, arr) {
    return JSON.stringify(arr).includes(JSON.stringify(el));
}

// Reveal cells based on value, zeros get revealed until neighbouring cells are not zeros.
function reveal(x, y, incompleteGrid, fullGrid) {
    let el = fullGrid[x][y];
    if (el === incompleteGrid[x][y] || x < 0 || y < 0) {
        return incompleteGrid;
    }
    if (el === 0) {
        const checked = [];
        const q = [{ x: x, y: y }];
        let cp;
        while (q.length > 0) {
            cp = q[0];
            incompleteGrid[cp.x][cp.y] = fullGrid[cp.x][cp.y];

            el = fullGrid[cp.x][cp.y];
            if (el === 0) {
                if (expectNotArrVal(cp.x - 1, cp.y, fullGrid, -1) && !checkDuplicateCoord({ x: cp.x - 1, y: cp.y }, checked)) {
                    q.push({ x: cp.x - 1, y: cp.y });
                }
                if (expectNotArrVal(cp.x + 1, cp.y, fullGrid, -1) && !checkDuplicateCoord({ x: cp.x + 1, y: cp.y }, checked)) {
                    q.push({ x: cp.x + 1, y: cp.y });
                }
                if (expectNotArrVal(cp.x, cp.y - 1, fullGrid, -1) && !checkDuplicateCoord({ x: cp.x, y: cp.y - 1 }, checked)) {
                    q.push({ x: cp.x, y: cp.y - 1 });
                }
                if (expectNotArrVal(cp.x, cp.y + 1, fullGrid, -1) && !checkDuplicateCoord({ x: cp.x, y: cp.y + 1 }, checked)) {
                    q.push({ x: cp.x, y: cp.y + 1 });
                }
            }
            checked.push(q.shift());
        }
    } else {
        incompleteGrid[x][y] = el;
    }
    return incompleteGrid;
}

// Calculate number of bombs fitting for a certain number of cells (based on some personal research).
function calcBombs(r, c) {
    return Math.floor(r * c * 0.16);
}

function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderGrid(grid) {
    const r = grid.length, c = grid[0].length;
    const cWidth = app.canvas.width, cHeight = app.canvas.height;
    const blockWidth = cWidth / c, blockHeight = cHeight / r;
    let currentX = 0, currentY = 0, el;
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            app.ctx.strokeStyle = "black";
            app.ctx.strokeRect(currentX, currentY, blockWidth, blockHeight);
            el = grid[i][j];
            if (el !== '?') {
                app.ctx.strokeStyle = "antiquewhite";
                app.ctx.strokeRect(currentX, currentY, blockWidth, blockHeight);
                app.ctx.fillStyle = 'black';
                app.ctx.fillRect(currentX, currentY, blockWidth, blockHeight);
                app.ctx.fillStyle = 'antiquewhite';
                app.ctx.font = "20px Georgia";
                // app.ctx.fillText(el, currentX - (blockWidth / 2 + 10), currentY + (blockHeight / 2 + 10));
                // app.ctx.fillText(el, currentX - blockWidth / 2 - 5, currentY + blockHeight / 2 + 7.5);
                app.ctx.fillText(el, currentX + blockWidth / 2 - 5, currentY + blockHeight / 2 + 7.5);
            }
            currentX += blockWidth;
        }
        currentX = 0;
        currentY += blockHeight;
    }
}

function getClickedBlockCoords(e, grid) {
    const clickedX = e.clientX, clickedY = e.clientY;
    const r = grid.length, c = grid[0].length;
    const cWidth = app.canvas.width, cHeight = app.canvas.height;
    const blockWidth = cWidth / c, blockHeight = cHeight / r;
    const y = Math.floor(clickedX / blockWidth), x = Math.floor(clickedY / blockHeight);
    return { x, y };
}

function notifyUser(msg) {
    window.alert(msg);
}

function handleBlockClick(e) {
    const { x, y } = getClickedBlockCoords(e, app.fGrid);
    app.iGrid = reveal(x, y, app.iGrid, app.fGrid);
    app.lastClicked = app.fGrid[x][y];
    clearCanvas(app.canvas, app.ctx);
    renderGrid(app.iGrid);
    checkGameOver();
}

function handleGenerateButton() {
    const size = parseInt(app.sizeInput.value);
    if (!isNaN(size) && size >= 3 && size <= 20) {
        app.settings.rows = size;
        app.settings.columns = size;
        restartGame();
    } else {
        notifyUser('Invalid grid size, must be between 3 and 20');
    }
}

function setEventListeners() {
    app.generateButton.addEventListener('click', handleGenerateButton);
    app.canvas.addEventListener('click', handleBlockClick);
}

function initGame() {
    app.settings.bombs = calcBombs(app.settings.rows, app.settings.columns);
    app.fGrid = initGrid(app.settings.rows, app.settings.columns, app.settings.bombs);
    app.iGrid = new Array(app.settings.rows).fill(0).map(row => new Array(app.settings.columns).fill('?'));
    app.canvas = document.querySelector('#game');
    app.ctx = app.canvas.getContext('2d');
    app.sizeInput = document.querySelector('#game-settings-size');
    app.generateButton = document.querySelector('#generate-button');
    setEventListeners();
    clearCanvas(app.canvas, app.ctx);
    renderGrid(app.iGrid);
}

function restartGame() {
    app.settings.bombs = calcBombs(app.settings.rows, app.settings.columns);
    app.fGrid = initGrid(app.settings.rows, app.settings.columns, app.settings.bombs);
    app.iGrid = new Array(app.settings.rows).fill(0).map(row => new Array(app.settings.columns).fill('?'));
    clearCanvas(app.canvas, app.ctx);
    renderGrid(app.iGrid);
}

function checkGameOver() {
    if (app.lastClicked === -1) {
        //game over
        window.alert('BOOM!!!');
        restartGame();
    }
}

const app = {
    settings: {
        rows: 10,
        columns: 10,
        bombs: null
    },
    fGrid: null,
    iGrid: null,
    canvas: null,
    ctx: null,
    sizeInput: null,
    lastClicked: null
};

initGame();