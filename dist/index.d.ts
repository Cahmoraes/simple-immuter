declare const _default: {
    produce: <T>(baseState: T | Promise<T>, producer?: (object | ((draftState: T & {
        [key: string]: any;
    }) => void)) | undefined, ...states: any[]) => any;
};

export { _default as si };
