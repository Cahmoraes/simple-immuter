declare const _default: {
    produce: {
        <T extends object | Map<unknown, unknown> | Set<unknown> | unknown[]>(baseState: T): Readonly<T>;
        <T_1 extends object | Map<unknown, unknown> | Set<unknown> | unknown[]>(baseState: T_1, producer: (draftState: T_1) => void | Readonly<T_1>): Readonly<T_1>;
    };
    cloneDeep: <T_2 extends object | Map<unknown, unknown> | Set<unknown> | unknown[]>(element: T_2) => T_2;
    freezeDeep: <T_3 extends object | Map<unknown, unknown> | Set<unknown> | unknown[]>(elementToFreeze: T_3) => Readonly<T_3>;
};

export { _default as si };
