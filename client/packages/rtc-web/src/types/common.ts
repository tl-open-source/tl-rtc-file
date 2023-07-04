export type CommonFnType = (...args: any[]) => any;

export type StringKeyObject = Record<string, any>;

export type PathValue<T, P extends keyof T> = T[P];
