declare const _default: {
    produce: {
        <T extends object | Map<unknown, unknown> | Set<unknown> | unknown[] | Date>(baseState: T): Readonly<T>;
        <T_1 extends object | Map<unknown, unknown> | Set<unknown> | unknown[] | Date>(baseState: T_1, producer: (draftState: T_1) => void | T_1, config: {
            freeze: boolean;
        }): Readonly<T_1>;
        <T_2 extends object | Map<unknown, unknown> | Set<unknown> | unknown[] | Date>(baseState: T_2, producer: (draftState: T_2) => void | T_2): Readonly<T_2>;
    };
    cloneDeep: <T_3 extends object | Map<unknown, unknown> | Set<unknown> | unknown[] | Date>(anElement: T_3) => T_3;
    freezeDeep: <T_4 extends object | Map<unknown, unknown> | Set<unknown> | unknown[] | Date>(elementToFreeze: T_4) => Readonly<T_4>;
};

export { _default as si };
