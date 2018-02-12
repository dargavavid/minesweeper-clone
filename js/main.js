// Generate array of numbers within specified range
function range(a, b) {
    return new Array(b - a + 1).fill(0).map((_, i) => i + a);
}

// Make one dimensional grid of specified size
function makeFlatGrid(rows, columns) {
    return new Array(rows * columns).fill(0);
}