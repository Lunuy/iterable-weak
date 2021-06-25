module.exports.sleep = function sleep(ms) {
    return new Promise(solve => setTimeout(solve, ms));
}