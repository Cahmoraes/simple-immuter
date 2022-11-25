declare const _default: {
    produce: {
        <T extends object | Map<unknown, unknown> | Set<unknown> | unknown[] | Date>(baseState: T & {
            [key: string]: any;
        }): Readonly<T>;
        <T_1 extends object | Map<unknown, unknown> | Set<unknown> | unknown[] | Date>(baseState: T_1 & {
            [key: string]: any;
        }, producer: (draftState: T_1 & {
            [key: string]: any;
        }) => void | (T_1 & {
            [key: string]: any;
        })): Readonly<T_1> & Record<string, unknown>;
    };
    cloneDeep: <T_2 extends object | Map<unknown, unknown> | Set<unknown> | unknown[] | Date>(anElement: T_2) => T_2;
    freezeDeep: <T_3 extends object | Map<unknown, unknown> | Set<unknown> | unknown[] | Date>(elementToFreeze: T_3) => Readonly<T_3>;
};

export { _default as si };
