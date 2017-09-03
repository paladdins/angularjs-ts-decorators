/// <reference types="angular" />
import { PipeTransform } from './pipe';
import { Provider } from './provider';
export interface ModuleConfig {
    id?: string;
    /**
     * @deprecated
     */
    name?: string;
    declarations?: Array<ng.IComponentController | ng.Injectable<ng.IDirectiveFactory> | PipeTransform>;
    imports?: Array<string | NgModule>;
    exports?: Function[];
    providers?: Provider[];
    config?(...args: any[]): void;
    run?(...args: any[]): void;
}
export interface NgModule {
    module?: ng.IModule;
    config?(...args: any[]): void;
    run?(...args: any[]): void;
    [p: string]: any;
}
export declare function NgModule({id, name, declarations, imports, providers}: ModuleConfig): (Class: NgModule) => void;
