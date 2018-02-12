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