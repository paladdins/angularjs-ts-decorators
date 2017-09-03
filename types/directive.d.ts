/// <reference types="angular" />
export interface DirectiveOptionsDecorated extends ng.IDirective {
    selector: string;
}
export interface DirectiveControllerConstructor {
    new (...args: any[]): DirectiveController;
}
export interface DirectiveController {
    compile?: ng.IDirectiveCompileFn;
    link?: ng.IDirectiveLinkFn | ng.IDirectivePrePost;
    [p: string]: any;
}
export declare function Directive({selector, ...options}: DirectiveOptionsDecorated): (ctrl: DirectiveControllerConstructor) => void;
