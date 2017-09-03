export interface PipeTransformConstructor {
    new (...args: any[]): PipeTransform;
}
export interface PipeTransform {
    transform(...args: any[]): any;
}
export declare function Pipe(options: {
    name: string;
}): (Class: PipeTransformConstructor) => void;
