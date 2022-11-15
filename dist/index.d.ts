declare const _default: {
    produce: {
        <T extends object | any[] | Map<any, any> | Set<any>>(baseState: T & {
            [key: string]: any;
        }): T;
        <T_1 extends object | any[] | Map<any, any> | Set<any>>(baseState: T_1 & {
            [key: string]: any;
        }, producer: (draftState: T_1 & {
            [key: string]: any;
        }) => void | (T_1 & {
            [key: string]: any;
        })): T_1 & {
            [key: string]: any;
        };
    };
    deepClone: <T_2 extends object | any[] | Map<any, any> | Set<any>>(element: T_2) => T_2;
    deepFreeze: <T_3 extends object | any[] | Map<any, any> | Set<any>>(elementToFreeze: T_3) => T_3;
};

export { _default as si };
