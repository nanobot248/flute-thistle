// tslint:disable:callable-types
export type constructor<T> = {
    new(...args: any[]): T;
}

/**
 * Used to specify whether an argument to one of the `get*Metadata`, `get*Annotations`,
 * `get*Tags", etc., methods is an instance of a class or the class constructor.
 */
export enum ObjectType {
    /**
     * The object is an instance of a class. Therefore all metadata for tags and annotations is
     * stored in `target.constructor`.
     */
    INSTANCE,

    /**
     * The object is the constructor of the class.
     */
    CONSTRUCTOR
}