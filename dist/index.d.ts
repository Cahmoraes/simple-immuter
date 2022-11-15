declare const _default: {
    produce: <T extends object | any[] | Map<any, any> | Set<any>>(baseState: T | Promise<T>, producer?: (object | ((draftState: T & {
        [key: string]: any;
    }) => any)) | undefined, ...states: any[]) => any;
    deepClone: <T_1 extends object | any[] | Map<any, any> | Set<any>>(element: T_1) => T_1;
    deepFreeze: <T_2 extends object | any[] | Map<any, any> | Set<any>>(elementToFreeze: T_2) => T_2;
};

export { _default as si };
