function range(a, b) {
    return new Array(b - a + 1).fill(0).map((_, i) => i + a);
}