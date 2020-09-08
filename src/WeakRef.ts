

declare class WeakRef<T> {
    constructor(targetObject : T)
    deref() : T | undefined
}

export default WeakRef;