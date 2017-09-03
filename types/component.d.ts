/// <reference types="angular" />
export interface ComponentOptionsDecorated extends ng.IComponentOptions {
    selector: string;
    styles?: any[];
    restrict?: string;
    replace?: boolean;
}
export declare function Component({selector, ...options}: ComponentOptionsDecorated): (ctrl: angular.IControllerConstructor) => void;
