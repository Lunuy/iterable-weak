declare class FinalizationRegistry<T, HeldValue, UnregisterToken extends object> {
    constructor(callback? : (heldValue : HeldValue) => void)
    register(target : T, heldValue : HeldValue, unregisterToken? : UnregisterToken): void
    unregister(unregisterToken : UnregisterToken): void
}

export default FinalizationRegistry;