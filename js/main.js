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