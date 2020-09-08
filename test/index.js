const { IterableWeakSet, IterableWeakMap } = require("../dist/index");

function sleep(ms) {
    return new Promise(solve => setTimeout(solve, ms));
}

let a = {
    jam: 2
};

let b = {
    jamjam: 3
};


// const obj = new IterableWeakSet([a,b]);
const obj = new IterableWeakMap([[a, 3], [b, "AA"]]);

setInterval(() => {
    console.log(JSON.stringify(Array.from(obj.entries())), obj.size);
}, 1000);

(async () => {
    await sleep(1000);
    obj.delete(b);
    await sleep(1000);
    a = undefined;
})();


