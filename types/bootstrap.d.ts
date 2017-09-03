import { Type } from './type';
export interface CompilerOptions {
    strictDi?: boolean;
}
export declare const platformBrowserDynamic: () => {
    bootstrapModule: (moduleType: Type<any>, compilerOptions?: CompilerOptions) => void;
};
export declare const PlatformRef: {
    bootstrapModule: (moduleType: Type<any>, compilerOptions?: CompilerOptions) => void;
};
