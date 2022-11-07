declare const _default: {
    produce: <T>(baseState: T | Promise<T>, producer?: ((draft: T) => void) | undefined) => any;
    merge: <T_1, K extends object[]>(baseState: T_1 | Promise<T_1>, ...states: K) => T_1 & K;
};

export { _default as si };
