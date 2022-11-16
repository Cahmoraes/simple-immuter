declare const _default: {
    produce: {
        <T extends object | Map<unknown, unknown> | Set<unknown> | unknown[]>(baseState: T & {
            [key: string]: any;
        }): Readonly<T>;
        <T_1 extends object | Map<unknown, unknown> | Set<unknown> | unknown[]>(baseState: T_1 & {
            [key: string]: any;
        }, producer: (draftState: T_1 & {
            [key: string]: any;
        }) => void | (T_1 & {
            [key: string]: any;
        })): Readonly<T_1> & {
            [key: string]: any;
        };
    };
    deepClone: <T_2 extends object | Map<unknown, unknown> | Set<unknown> | unknown[]>(element: T_2) => T_2;
    deepFreeze: <T_3 extends object | Map<unknown, unknown> | Set<unknown> | unknown[]>(elementToFreeze: T_3) => Readonly<T_3>;
};

export { _default as si };
