/**
 * Utility decorators and functions for handling metadata. This specializes and simplifies
 * the generic Reflect.setMetadata(...) and Reflect.getMetadata(...) methods for easier
 * use with annotations and tags.
 * It allows adding and retrieving metadata to/from classes, methods (including constructor)
 * and properties. All metadata is stored and retrieved on/from the constructor function.
 *
 * Metadata is supposed to be stored on the constructor (which happens by default when using
 * the decorators in the intended way). To retrieve the metadata using the `get*` methods,
 * either the instance or the constructor can be provided and an objectType can be used to distinguish
 * between the two.
 */

import { constructor, ObjectType } from "./reflection/types";
import { ReflectionObject } from "./reflection/reflection_object";

export const REFLECTION_CLASS_METADATA_KEY = Symbol("flute.reflection.metadata.for-class");
export const REFLECTION_METHOD_PARAMETER_METADATA_KEY = Symbol("flute.reflection.metadata.for-method-parameter");
export const REFLECTION_FIELD_METADATA_KEY = Symbol("flute.reflection.metadata.for-field");

function getConstructorReflectionObject(target: any, objectType: ObjectType): ReflectionObject {
    if (target == null) {
        throw new Error("Cannot create ReflectionObject from null/undefined value.");
    } else if (target instanceof ReflectionObject) {
        return target;
    } else if (objectType === ObjectType.INSTANCE) {
        return new ReflectionObject(target.constructor);
    } else {
        return new ReflectionObject(target);
    }
}

/**
 * Attach metadata to a class.
 *
 * @param metadataKey The key used to store the data.
 * @param data Any JavaScript object (or string, number, ...).
 */
export function ClassMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.CONSTRUCTOR) {
    return (target: any | ReflectionObject) => {
        const obj = getConstructorReflectionObject(target, objectType);
        let classMetadata: Map<string | symbol, Map<string | symbol, any>> = obj.getMetadata(REFLECTION_CLASS_METADATA_KEY);
        if (classMetadata == null) {
            classMetadata = new Map<string | symbol, Map<string | symbol, any>>();
        }
        classMetadata.set(metadataKey, data);
        obj.setMetadata(REFLECTION_CLASS_METADATA_KEY, classMetadata);
    }
}

export function AppendClassMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.CONSTRUCTOR) {

    return (target: any | ReflectionObject) => {
        let metadata: any[] = getClassMetadata(target, metadataKey, objectType);
        if (metadata == null) {
            metadata = [];
        } else if (!Array.isArray(metadata)) {
            throw new Error("Metadata value is not an array. Cannot append to it.");
        }
        metadata.push(data);
        ClassMetadata(metadataKey, metadata, objectType)(target);
    };
}

export function PrependClassMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.CONSTRUCTOR) {
    return (target: any | ReflectionObject) => {
        let metadata: any[] = getClassMetadata(target, metadataKey, objectType);
        if (metadata == null) {
            metadata = [];
        } else if (!Array.isArray(metadata)) {
            throw new Error("Metadata value is not an array. Cannot append to it.");
        }
        metadata.unshift(data);
        ClassMetadata(metadataKey, metadata, objectType)(target);
    };
}

export function PutClassMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.CONSTRUCTOR) {
    return (target: any | ReflectionObject) => {
        let metadata: any = getClassMetadata(target, metadataKey, objectType);
        if (metadata == null) {
            metadata = new Set<any>();
            metadata.add(data);
        } else if (metadata instanceof Set) {
            metadata.add(data)
        } else if (!Array.isArray(metadata)) {
            if (metadata.indexOf(data) < 0) {
                metadata.push(data);
            }
        } else {
            throw new Error("Metadata value is not an array. Cannot append to it.");
        }
        ClassMetadata(metadataKey, metadata, objectType)(target);
    };
}

/**
 * Get metadata of the given class.
 * @param target The object containing the metadata.
 * @param key The key used to store the data.
 * @param objectType Metadata is always stored in the constructor. The object type specifies whether
 * `target` is the constructor function or an instance of the class.
 */
export function getClassMetadata(target: any, key: string | symbol, objectType: ObjectType = ObjectType.INSTANCE): any {
    const obj = getConstructorReflectionObject(target, objectType);
    const classMetadata: Map<string | symbol, Map<string | symbol, any>> = obj.getMetadata(REFLECTION_CLASS_METADATA_KEY);
    if (classMetadata != null && classMetadata.has(key)) {
        return classMetadata.get(key);
    }
    return null;
}

/**
 * Decorator to attach metadata to a field.
 * @param metadataKey The key to store the data under.
 * @param metadata The data to store.
 */
function FieldMetadata(metadataKey: string | symbol, metadata: any, objectType: ObjectType = ObjectType.INSTANCE) {
    return (target: object, fieldName: string | symbol) => {
        if (objectType == null) {
            // fieldName == null is only valid for the constructor. constructor decorators will provide the constructor
            // as target by default, while all other decorators (property, non-constructor method) will provide
            // an instance by default.
            objectType = fieldName == null ? ObjectType.CONSTRUCTOR : ObjectType.INSTANCE;
        }
        if (fieldName == null) { fieldName = null; }
        const obj = getConstructorReflectionObject(target, objectType);
        let fieldsMeta: Map<string | symbol, Map<string | symbol, any>> = obj.getMetadata(REFLECTION_FIELD_METADATA_KEY);
        if (fieldsMeta == null) { fieldsMeta = new Map<string | symbol, Map<string | symbol, any>>(); }
        if (!fieldsMeta.has(fieldName)) {
            fieldsMeta.set(fieldName, new Map<string | symbol, any>());
        }
        fieldsMeta.get(fieldName).set(metadataKey, metadata);
        obj.setMetadata(REFLECTION_FIELD_METADATA_KEY, fieldsMeta);
    }
}

export function AppendFieldMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.INSTANCE) {
    return <T>(target: object, fieldName: string | symbol) => {
        let metadata: any[] = getFieldMetadata(target, fieldName, metadataKey);
        if (metadata == null) {
            metadata = [];
        } else if (!Array.isArray(metadata)) {
            throw new Error("Metadata value is not an array. Cannot append to it.");
        }
        metadata.push(data);
        FieldMetadata(metadataKey, metadata, objectType)(target, fieldName);
    };
}

export function PrependFieldMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.INSTANCE) {
    return <T>(target: object, fieldName: string | symbol) => {
        let metadata: any[] = getFieldMetadata(target, fieldName, metadataKey);
        if (metadata == null) {
            metadata = [];
        } else if (!Array.isArray(metadata)) {
            throw new Error("Metadata value is not an array. Cannot append to it.");
        }
        metadata.unshift(data);
        FieldMetadata(metadataKey, metadata, objectType)(target, fieldName);
    };
}

export function PutFieldMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.INSTANCE) {
    return <T>(target: object, fieldName: string | symbol) => {
        let metadata: any = getFieldMetadata(target, fieldName, metadataKey);
        if (metadata == null) {
            metadata = new Set<any>();
            metadata.add(data);
        } else if (metadata instanceof Set) {
            metadata.add(data);
        } else if (Array.isArray(metadata)) {
            if (metadata.indexOf(data) < 0) {
                metadata.push(data);
            }
        } else {
            throw new Error("Metadata value is not an array. Cannot append to it.");
        }
        FieldMetadata(metadataKey, metadata, objectType)(target, fieldName);
    };
}

/**
 * Decorator used to add metadata to a property.
 *
 * @param key The key to store the metadata for.
 * @param data The metadata to store.
 */
export function PropertyMetadata(metaKey: string | symbol, data: any, objectType: ObjectType = ObjectType.INSTANCE) {
    return (target: object, fieldName: string | symbol) => {
        FieldMetadata(metaKey, data, objectType)(target, fieldName);
    }
}

export function AppendPropertyMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.INSTANCE) {
    return <T>(target: object, fieldName: string | symbol) => {
        AppendFieldMetadata(metadataKey, data, objectType)(target, fieldName);
    };
}

export function PrependPropertyMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.INSTANCE) {
    return <T>(target: object, fieldName: string | symbol) => {
        PrependFieldMetadata(metadataKey, data, objectType)(target, fieldName);
    };
}

export function PutPropertyMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.INSTANCE) {
    return <T>(target: object, fieldName: string | symbol) => {
        PutFieldMetadata(metadataKey, data, objectType)(target, fieldName);
    };
}

/**
 * Decorator used to add metadata to a method.
 *
 * @param data The metadata to attach to the method.
 */
export function MethodMetadata(metaKey: string | symbol, data: any, objectType: ObjectType = null) {
    return <T>(target: object, fieldName: string | symbol) => {
        FieldMetadata(metaKey, data, objectType)(target, fieldName);
    }
}

export function AppendMethodMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = null) {
    return <T>(target: object, fieldName: string | symbol) => {
        AppendFieldMetadata(metadataKey, data, objectType)(target, fieldName);
    };
}

export function PrependMethodMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = null) {
    return <T>(target: object, fieldName: string | symbol) => {
        PrependFieldMetadata(metadataKey, data, objectType)(target, fieldName);
    };
}

export function PutMethodMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = null) {
    return <T>(target: object, fieldName: string | symbol) => {
        PutFieldMetadata(metadataKey, data, objectType)(target, fieldName);
    };
}

/**
 * Get a map containing all metadata for all fields of the class.
 *
 * @param target The object containing the annotations.
 * @param objectType Metadata are always stored in the constructor. The object type specifies whether
 * `target` is the constructor function or an instance of the class.
 */
export function getAllFieldsMetadata(
    target: any, objectType: ObjectType = ObjectType.INSTANCE): Map<string | symbol, Map<string | symbol, any>> {

    const obj = getConstructorReflectionObject(target, objectType);
    const allFields: Map<string | symbol, Map<string | symbol, any>> = obj.getMetadata(REFLECTION_FIELD_METADATA_KEY);
    // if (objectType === ObjectType.INSTANCE) {
    //     console.log("getAllFieldsMetadata: ", { target, objectType, allFields });
    // }
    return allFields;
}

/**
 * Get all metadata associated with the field.
 *
 * @param target The object containing the metadata.
 * @param key The name of field.
 * @param objectType Metadata is always stored in the constructor. The object type specifies whether
 * `target` is the constructor function or an instance of the class.
 * @returns `null` or `undefined` if no metadata could be found for the field.
 */
export function getAllMetadataOfField(target: any, key: string | symbol,
    objectType: ObjectType = ObjectType.INSTANCE): Map<string | symbol, any> {

    const allFieldsMeta = getAllFieldsMetadata(target, objectType);
    if (allFieldsMeta != null && allFieldsMeta.has(key)) {
        return allFieldsMeta.get(key);
    }

    return null;
}

export function getFieldMetadata(target: any, fieldName: string | symbol, metadataKey: string | symbol,
    objectType: ObjectType = ObjectType.INSTANCE): any {
    if (objectType == null) {
        objectType = fieldName == null ? ObjectType.CONSTRUCTOR : ObjectType.INSTANCE;
    }
    const fieldMetadata: Map<string | symbol, any> = getAllMetadataOfField(target, fieldName, objectType);
    // if (objectType === ObjectType.INSTANCE) {
    //     console.log("getFieldMetadata: ", {
    //         target, fieldName, metadataKey, objectType, fieldMetadata
    //     });
    // }
    if (fieldMetadata != null && fieldMetadata.has(metadataKey)) {
        return fieldMetadata.get(metadataKey);
    } else {
        return null;
    }
}

/**
 * Set metadata of a method parameter.
 *
 * @param metadataKey The metadata key to store the data under.
 * @param data The metadata value to store.
 */
export function MethodParameterMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = null) {
    return (target: object, methodName: string | symbol, index: number) => {
        // console.log("(1)");

        if (methodName == null) { methodName = null; }
        let methodParameterMeta: Map<number, Map<string | symbol, any>> =
            getFieldMetadata(target, methodName, REFLECTION_METHOD_PARAMETER_METADATA_KEY, objectType);

        // console.log("(2)");

        if (methodParameterMeta == null) {
            methodParameterMeta = new Map<number, Map<string | symbol, any>>();
            // console.log("(2.1) created new map.");
            FieldMetadata(REFLECTION_METHOD_PARAMETER_METADATA_KEY, methodParameterMeta, objectType)(target, methodName);
        }

        if (!methodParameterMeta.has(index)) {
            methodParameterMeta.set(index, new Map<string | symbol, any>());
        }

        // console.log("MethodParameterMetadata:", {
        //     methodName, target, methodParameterMeta, index,
        //     before: methodParameterMeta.get(index)
        // });

        methodParameterMeta.get(index).set(metadataKey, data);
        // console.log("(3)");
        // FieldMetadata(REFLECTION_METHOD_PARAMETER_METADATA_KEY, methodParameterMeta, objectType)(target, methodName);
        // console.log("MethodParameterMetadata: after =", methodParameterMeta.get(index));
        // console.log("MethodParameterMetadata: all =", getFieldMetadata(target, methodName,
        //    REFLECTION_METHOD_PARAMETER_METADATA_KEY, objectType));
        // console.log("(4)");
    }
}

export function AppendMethodParameterMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = null) {
    return (target: object, fieldName: string | symbol, index: number) => {
        let metadata: any[] = getMethodParameterMetadata(target, fieldName, index, metadataKey, objectType);
        if (metadata == null) {
            metadata = [];
        } else if (!Array.isArray(metadata)) {
            throw new Error("Metadata value is not an array. Cannot append to it.");
        }
        metadata.push(data);
        MethodParameterMetadata(metadataKey, metadata, objectType)(target, fieldName, index);
    }
}

export function PrependMethodParameterMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = null) {
    return (target: object, fieldName: string | symbol, index: number) => {

        let metadata: any[] = getMethodParameterMetadata(target, fieldName, index, metadataKey, objectType);
        // console.log("PrependMethodParameterMetadata: target =", target, ", fieldName =", fieldName,
        //    ", objectType =", ObjectType[objectType], ", metadata =", metadata);
        if (metadata == null) {
            metadata = [];
        } else if (!Array.isArray(metadata)) {
            throw new Error("Metadata value is not an array. Cannot append to it.");
        }
        metadata.unshift(data);
        MethodParameterMetadata(metadataKey, metadata, objectType)(target, fieldName, index);
    }
}

export function PutMethodParameterMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = null) {
    return (target: object, fieldName: string | symbol, index: number) => {
        let metadata: any = getMethodParameterMetadata(target, fieldName, index, metadataKey, objectType);
        if (metadata == null) {
            metadata = new Set<any>();
            metadata.add(data);
        } else if (metadata instanceof Set) {
            metadata.add(data);
        } else if (Array.isArray(metadata)) {
            if (metadata.indexOf(data) < 0) {
                metadata.push(data);
            }
        } else {
            throw new Error("Metadata value is not an array. Cannot append to it.");
        }
        MethodParameterMetadata(metadataKey, metadata, objectType)(target, fieldName, index);
    }
}

/**
 * Get the metadata of all method parameters of the method identified by `key`.
 *
 * @param target The object containing the method.
 * @param key The name of the method. If `key` is `null` (or `undefined`), the constructor parameter
 * metadata will be returned.
 * @param objectType Metadata are always stored in the constructor. The object type specifies whether
 * `target` is the constructor function or an instance of the class.
 */
export function getAllMethodParametersMetadata(
    target: any, methodName: string | symbol, objectType: ObjectType = ObjectType.INSTANCE): Map<number, Map<string | symbol, any>> {

    if (methodName == null) { methodName = null; }
    if (objectType == null) {
        objectType = methodName == null ? ObjectType.CONSTRUCTOR : ObjectType.INSTANCE;
    }

    const parametersMetadata = getFieldMetadata(target, methodName, REFLECTION_METHOD_PARAMETER_METADATA_KEY, objectType);
    // console.log("getAllMethodParametersMetadata: target =", target, ", methodName =", methodName,
    //     ", objectType =", ObjectType[objectType], ", metadata =", parametersMetadata);
    return parametersMetadata;
}

export function getAllMetadataForMethodParameter(target: any, methodName: string | symbol, index: number,
    objectType: ObjectType = ObjectType.INSTANCE): Map<string | symbol, any> {

    const parametersMetadata = getAllMethodParametersMetadata(target, methodName, objectType);
    if (parametersMetadata != null && parametersMetadata.has(index)) {
        // console.log("getAllMetadataForMethodParameter: ", parametersMetadata.get(index));
        return parametersMetadata.get(index);
    }

    // console.log("getAllMetadataForMethodParameter: null");
    return null;
}

export function getMethodParameterMetadata(target: any, methodName: string | symbol, index: number,
    metadataKey: string | symbol, objectType: ObjectType = ObjectType.INSTANCE): any {

    const parametersMetadata = getAllMetadataForMethodParameter(target, methodName, index, objectType);
    if (parametersMetadata != null && parametersMetadata.has(metadataKey)) {
        // console.log("getMethodParameterMetadata: ", parametersMetadata.get(metadataKey));
        return parametersMetadata.get(metadataKey);
    }

    // console.log("getMethodParameterMetadata: null");
    return null;
}

export function SetMetadata(metadataKey: string | symbol, value: any, objectType?: ObjectType) {
    return (target: any, fieldName?: string | symbol, index?: any) => {
        /*console.log("SetMetadata: ", {
            metadataKey, value, objectType, target, fieldName, index
        });*/
        if (fieldName == null && index == null) {
            ClassMetadata(metadataKey, value, objectType == null ? ObjectType.CONSTRUCTOR : objectType)(target);
        } else if (fieldName == null) {
            if (typeof(index) === "number") {
                MethodParameterMetadata(metadataKey, value)(target, fieldName, index);
            } else {
                MethodMetadata(metadataKey, value, objectType)(target, fieldName);
            }
        } else if (index == null) {
            FieldMetadata(metadataKey, value, objectType)(target, fieldName);
        } else {
            if (typeof(index) === "number") {
                MethodParameterMetadata(metadataKey, value, objectType)(target, fieldName, index);
            } else {
                MethodMetadata(metadataKey, value, objectType)(target, fieldName);
            }
        }
    }
}