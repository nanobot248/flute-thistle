/**
 * Utility decorators and functions for handling annotations. Annotations are arbitrary
 * objects that are attached to a class, method, property or method/constructor parameter.
 * Annotations are stored in an array. While decorators are executed in reverse order of their appearance,
 * annotations are attached in-order.
 *
 * Example:
 * ```
 * @AnnotateClass("note1")
 * @AnnotateClass("note2")
 * @AnnotateClass("note3")
 * class A {}
 * ```
 *
 * The array of annotations for `A` will be:
 * ```
 * ["note1", "note2", "note3"]
 * ```
 *
 * The decorators and functions are based on the decorators and functions of the `metadata` module. Therefore,
 * annotations are stored in the metadata of the constructor of the class.
 */

import { ObjectType } from "./reflection/types";
import { PrependPropertyMetadata, PrependMethodParameterMetadata, PrependClassMetadata,
    getClassMetadata, getMethodParameterMetadata, getFieldMetadata } from "./metadata";

export const ANNOTATION_KEY_CLASS = Symbol("flute.annotation.for-class");
export const ANNOTATION_KEY_FIELD = Symbol("flute.annotation.for-field");
export const ANNOTATION_KEY_METHOD_PARAMETER = Symbol("flute.annotation.for-method-parameter");

/**
 * Adds an annotation to a field (property or method).
 * @param annotation The annotation to add. Null-values will be ignored (not added to the annotations array).
 */
export function AnnotateField(annotation: any) {
    if (annotation == null) {
        return () => {};
    }

    return PrependPropertyMetadata(ANNOTATION_KEY_FIELD, annotation);
}

/**
 * Get all annotations of a given field.
 * @param target The object containing the field.
 * @param fieldName The name of the field.
 * @param objectType Whether `target` is the class constructor or an instance of the class.
 */
export function getFieldAnnotations(target: any, fieldName: string | symbol, objectType: ObjectType = ObjectType.INSTANCE) {
    return getFieldMetadata(target, fieldName, ANNOTATION_KEY_FIELD, objectType);
}

/**
 * Decorator used to add annotations to a property.
 *
 * @param annotation Any JavaScript object (or string, number, ...). `null`-values (including `undefined`)
 * will be ignored.
 */
export function AnnotateProperty(annotation: any) {
    return AnnotateField(annotation);
}

/**
 *
 * @param target The object containing the property.
 * @param propertyName The name of the property.
 * @param objectType Whether `target` is the class constructor or an instance of the class.
 */
export function getPropertyAnnotations(target: any, propertyName: string | symbol, objectType: ObjectType = ObjectType.INSTANCE) {
    return getFieldAnnotations(target, propertyName, objectType);
}

/**
 * Decorator used to add annotations to a method.
 *
 * @param annotation Any JavaScript object (or string, number, ...). `null`-values (including `undefined`)
 * will be ignored.
 */
export function AnnotateMethod(annotation: any) {
    return AnnotateField(annotation);
}

/**
 * Get the annotations of a method.
 *
 * @param target The object containing the method.
 * @param methodName The name of the method.
 * @param objectType Whether `target` is the class constructor or an instance of the class.
 */
export function getMethodAnnotations(target: any, methodName: string | symbol, objectType: ObjectType = ObjectType.INSTANCE) {
    return getFieldAnnotations(target, methodName, objectType);
}

/**
 * Add an annotation to a method.
 *
 * @param annotation Any JavaScript object (or string, number, ...). `null`-values (including `undefined`)
 * will be ignored.
 */
export function AnnotateMethodParameter(annotation: any) {
    if (annotation == null) {
        return () => {};
    }

    return PrependMethodParameterMetadata(ANNOTATION_KEY_METHOD_PARAMETER, annotation, null);
}

/**
 * Get all annotations attached to the specified method parameter.
 *
 * @param target The object containing the annotations.
 * @param key The name of the method. If `key` is `null` (or `undefined`), the constructor parameter
 * annotations will be returned.
 * @param index The index of the method parameter. The first parameter is identified by index `0` (zero).
 * @param objectType Annotations are always stored in the constructor. The object type specifies whether
 * `target` is the constructor function or an instance of the class.
 */
export function getMethodParameterAnnotations(
    target: any, key: string | symbol, index: number, objectType: ObjectType = ObjectType.INSTANCE): any[] {

    return getMethodParameterMetadata(target, key, index, ANNOTATION_KEY_METHOD_PARAMETER, objectType);
}

/**
 * Attach an annotation to a class.
 *
 * @param annotation Any JavaScript object (or string, number, ...). `null`-values (including `undefined`)
 * will be ignored.
 */
export function AnnotateClass(annotation: any) {
    if (annotation == null) {
        return () => {};
    }

    return PrependClassMetadata(ANNOTATION_KEY_CLASS, annotation);
}

/**
 * Get annotations of the given class.
 * @param target The object containing the annotations.
 * @param objectType Annotations are always stored in the constructor. The object type specifies whether
 * `target` is the constructor function or an instance of the class.
 */
export function getClassAnnotations(target: any, objectType: ObjectType = ObjectType.INSTANCE): any[] {
    return getClassMetadata(target, ANNOTATION_KEY_CLASS, objectType);
}

/**
 * A generic decorator that adds an annotation to any of the supported target (class, property, method
 * or method parameter).
 * @param annotation The annotation to add to the target.
 */
export function Annotate(annotation: any) {
    return (target: any, fieldName?: string | symbol, index?: any) => {
        /*console.log("Annotate:", {
            annotation, target, fieldName, index
        });*/
        if (fieldName == null && index == null) {
            AnnotateClass(annotation)(target);
        } else if (fieldName == null) {
            if (typeof(index) === "number") {
                AnnotateMethodParameter(annotation)(target, fieldName, index);
            } else {
                AnnotateMethod(annotation)(target, fieldName);
            }
        } else if (index == null) {
            AnnotateField(annotation)(target, fieldName);
        } else {
            if (typeof(index) === "number") {
                AnnotateMethodParameter(annotation)(target, fieldName, index);
            } else {
                AnnotateField(annotation)(target, fieldName);
            }
        }
    }
}