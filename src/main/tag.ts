/**
 * Utility decorators and functions for handling tags. Tags are arbitrary
 * objects that are attached to a class, method, property or method/constructor parameter.
 * Tags are stored in a `Set`. Therefore, tags have no guaranteed order and there can be
 * no duplicates
 *
 * Example:
 * ```
 * @TagClass("note1")
 * @TagClass("note2")
 * @TagClass("note1")
 * class A {}
 * ```
 *
 * The `Set` of tags for `A` will be (represented as an array):
 * ```
 * ["note1", "note2"]
 * ```
 *
 * The decorators and functions are based on the decorators and functions of the `metadata` module. Therefore,
 * tags are stored in the metadata of the constructor of the class.
 */


import { getFieldMetadata, PutMethodParameterMetadata, getMethodParameterMetadata,
    PutClassMetadata, getClassMetadata, PutFieldMetadata } from "./metadata";
import { ObjectType } from "./reflection/types";

export const TAG_KEY_CLASS = Symbol("flute.tag.for-class");
export const TAG_KEY_FIELD = Symbol("flute.tag.for-field");
export const TAG_KEY_METHOD_PARAMETER = Symbol("flute.tag.for-method-parameter");

/**
 * Add a tag to a field.
 *
 * @param tag The tag object.
 */
export function TagField(tag: any) {
    if (tag == null) {
        return () => {};
    }

    return PutFieldMetadata(TAG_KEY_FIELD, tag);
}

/**
 * Get the tags of a field.
 *
 * @param target The object containing the field.
 * @param fieldName The name of the field.
 * @param objectType Whether `target` is the class constructor or an instance of the class.
 */
export function getFieldTags(target: any, fieldName: string | symbol,
    objectType: ObjectType = ObjectType.INSTANCE): Set<any> {
    return getFieldMetadata(target, fieldName, TAG_KEY_FIELD, objectType);
}

/**
 * Adds a tag to a property.
 *
 * @param tag The tag to add.
 */
export function TagProperty(tag: any) {
    return TagField(tag);
}

/**
 * Get all tags of a property.
 *
 * @param target The object containing the property.
 * @param propertyName The name of the property.
 * @param objectType Whether `target` is the class constructor or an instance of the class.
 */
export function getPropertyTags(target: any, propertyName: string | symbol,
    objectType: ObjectType = ObjectType.INSTANCE): Set<any> {
    return getFieldTags(target, propertyName, objectType) as Set<any>;
}

/**
 * Adds a tag to a method.
 *
 * @param tag The tag to add.
 */
export function TagMethod(tag: any) {
    return TagField(tag);
}

/**
 * Get the tags of a method.
 *
 * @param target The object containing the method.
 * @param methodName The name of the method.
 * @param objectType Whether `target` is the class constructor or an instance of the class.
 */
export function getMethodTags(target: any, methodName: string | symbol, objectType: ObjectType = ObjectType.INSTANCE): Set<any> {
    return getFieldTags(target, methodName, objectType) as Set<any>;
}

/**
 * Adds a tag to a method parameter.
 *
 * @param tag The tag to add.
 */
export function TagMethodParameter(tag: any) {
    if (tag == null) {
        return () => {};
    }

    return PutMethodParameterMetadata(TAG_KEY_METHOD_PARAMETER, tag);
}

/**
 * Get the tags of a method parameter.
 *
 * @param target The object containing the method.
 * @param methodName The name of the method.
 * @param index The index of the method parameter.
 * @param objectType Whether `target` is the class constructor or an instance of the class.
 */
export function getMethodParameterTags(
    target: any, methodName: string | symbol, index: number, objectType: ObjectType = ObjectType.INSTANCE): Set<any> {

    return getMethodParameterMetadata(target, methodName, index, TAG_KEY_METHOD_PARAMETER, objectType);
}

/**
 * Adds a tag to a class.
 *
 * @param tag The tag to add.
 */
export function TagClass(tag: any) {
    if (tag == null) {
        return () => {};
    }

    return PutClassMetadata(TAG_KEY_CLASS, tag);
}

/**
 * Get all tags of a class.
 *
 * @param target The tagged object.
 * @param objectType Whether `target` is the class constructor of an instance of the class.
 */
export function getClassTags(target: any, objectType: ObjectType = ObjectType.INSTANCE): Set<any> {
    return getClassMetadata(target, TAG_KEY_CLASS, objectType);
}

/**
 * A generic decorator that adds a tag to any of the supported targets (class, property, method
 * or method parameter).
 * @param tag The tag to add to the target.
 */
export function Tag(tag: any) {
    return (target: any, fieldName?: string | symbol, index?: any) => {
        if (fieldName == null && index == null) {
            TagClass(tag)(target);
        } else if (fieldName == null) {
            if (typeof(index) === "number") {
                TagMethodParameter(tag)(target, fieldName, index);
            } else {
                TagMethod(tag)(target, fieldName);
            }
        } else if (index == null) {
            TagField(tag)(target, fieldName);
        } else {
            if (typeof(index) === "number") {
                TagMethodParameter(tag)(target, fieldName, index);
            } else {
                TagField(tag)(target, fieldName);
            }
        }
    }
}