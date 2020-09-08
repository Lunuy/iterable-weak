import WeakRef from "./WeakRef";
import FinalizationRegistry from "./FinalizationRegistry";

class IterableWeakMap<K extends object, V> {
    static [Symbol.species] = IterableWeakMap;
    private finalizationRegistry = new FinalizationRegistry<K, WeakRef<K>, WeakRef<K>>(this.cleanup.bind(this));
    private toValueMap : Map<WeakRef<K>, V> = new Map();
    private toRefWeakMap : WeakMap<K, WeakRef<K>> = new WeakMap();
    constructor(iterable : Iterable<readonly [K, V]>)
    constructor(values?: readonly (readonly [K, V])[])
    constructor(iterable : Iterable<readonly [K, V]> | readonly (readonly [K, V])[] = []) {
        for(const [key, value] of iterable)
            this.set(key, value);
    }
    private cleanup(ref : WeakRef<K>) {
        this.toValueMap.delete(ref);
    }
    get size() {
        return this.toValueMap.size;
    }
    clear() {
        for(const value of this.keys())
            this.delete(value);
    }
    delete(key : K) {
        const ref = this.toRefWeakMap.get(key);
        if(!ref) return false;
        this.toValueMap.delete(ref);
        this.toRefWeakMap.delete(key);
        this.finalizationRegistry.unregister(ref);
    }
    *entries() : Generator<[K, V], any, unknown> {
        for(const ref of this.toValueMap.keys())
            yield [ref.deref(), this.toValueMap.get(ref)];
    }
    forEach(callback : (value : V, key : K, map : this) => void, thisArg? : any) {
        for(const [key, value] of this.entries())
            callback.call(thisArg, value, key, this);
    }
    get(key : K) {
        const ref = this.toRefWeakMap.get(key);
        if(!ref) return;
        return this.toValueMap.get(ref);
    }
    has(key : K) {
        return this.toRefWeakMap.has(key);
    }
    *keys() {
        for(const ref of this.toValueMap.keys()) {
            yield ref.deref();
        }
    }
    set(key : K, value : V) {
        const ref = new WeakRef(key);
        this.toValueMap.set(ref, value);
        this.toRefWeakMap.set(key, ref);
        this.finalizationRegistry.register(key, ref, ref);
    }
    values() {
        return this.toValueMap.values();
    }
}

interface IterableWeakMap<K extends object, V> {
    [Symbol.iterator](): Generator<[K, V], void, unknown>
}

IterableWeakMap.prototype[Symbol.iterator]
     = IterableWeakMap.prototype.entries;

export default IterableWeakMap;