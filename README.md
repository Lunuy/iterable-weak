# iterable-weak
Iterable WeakSet / WeakMap using ES2021 WeakRef

# Example
```js
const { IterableWeakSet } = require("iterable-weak");

function sleep(ms) {
    return new Promise(solve => setTimeout(solve, ms));
}

let a = {
    jam: 2
};

let b = {
    jamjam: 3
};


const set = new IterableWeakSet([a,b]);

setInterval(() => {
    console.log(JSON.stringify(Array.from(set.values())), set.size);
}, 1000);

(async () => {
    await sleep(1000);
    set.delete(b);
    await sleep(1000);
    a = undefined;
})();
```
```js
const { IterableWeakMap } = require("iterable-weak");

function sleep(ms) {
    return new Promise(solve => setTimeout(solve, ms));
}

let a = {
    jam: 2
};

let b = {
    jamjam: 3
};

const map = new IterableWeakMap([[a, 3], [b, "AA"]]);

setInterval(() => {
    console.log(JSON.stringify(Array.from(map.entries())), map.size);
}, 1000);

(async () => {
    await sleep(1000);
    map.delete(b);
    await sleep(1000);
    a = undefined;
})();
```