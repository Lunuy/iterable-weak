
import WeakRef from "./WeakRef";
import FinalizationRegistry from "./FinalizationRegistry";

class IterableWeakSet<T extends object> {
    static [Symbol.species] = IterableWeakSet;
    private finalizationRegistry = new FinalizationRegistry<T, WeakRef<T>, WeakRef<T>>(this.cleanup.bind(this));
    private refSet : Set<WeakRef<T>> = new Set();
    private toRefWeakMap : WeakMap<T, WeakRef<T>> = new WeakMap();
    constructor(iterable : Iterable<T>)
    constructor(values?: readonly T[])
    constructor(iterable : Iterable<T> | readonly T[] = []) {
        for(const value of iterable)
            this.add(value);
    }
    private cleanup(ref : WeakRef<T>) {
        this.refSet.delete(ref);
    }
    get size() {
        return this.refSet.size;
    }
    add(value : T) {
        const ref = new WeakRef(value);
        this.refSet.add(ref);
        this.toRefWeakMap.set(value, ref);
        this.finalizationRegistry.register(value, ref, ref);
    }
    clear() {
        for(const value of this.values())
            this.delete(value);
    }
    delete(value : T) {
        const ref = this.toRefWeakMap.get(value);
        if(!ref) return false;
        this.refSet.delete(ref);
        this.toRefWeakMap.delete(value);
        this.finalizationRegistry.unregister(ref);
        return true;
    }
    *entries() : Generator<[T, T], any, unknown> {
        for(const value of this.values())
            yield [value, value];
    }
    forEach(callback : (currentValue : T, currentKey : T, set : this) => void, thisArg? : any) {
        for(const value of this.values())
            callback.call(thisArg, value, value, this);
    }
    has(value : T) {
        return this.toRefWeakMap.has(value);
    }
    *values() {
        for(const ref of this.refSet.values())
            yield ref.deref();
    }
}

interface IterableWeakSet<T extends object> {
    keys(): Generator<T, void, unknown>,
    [Symbol.iterator](): Generator<T, void, unknown>
}

IterableWeakSet.prototype.keys = IterableWeakSet.prototype[Symbol.iterator]
     = IterableWeakSet.prototype.values;

export default IterableWeakSet;