// tslint:disable:callable-types
export type constructor<T> = {
    new(...args: any[]): T;
}

/**
 * Used to specify whether an argument to one of the "get*Annotations" methods is an instance
 * of a class or the class constructor.
 */
export enum ObjectType {
    INSTANCE,
    CONSTRUCTOR
}