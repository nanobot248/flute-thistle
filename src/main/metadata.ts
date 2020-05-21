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

import { ObjectType } from "./reflection/types";
import { ReflectionObject } from "./reflection/reflection_object";

export const METADATA_KEY_CLASS = Symbol("flute.reflection.metadata.for-class");
export const METADATA_KEY_FIELD = Symbol("flute.reflection.metadata.for-field");
export const METADATA_KEY_METHOD_PARAMETER = Symbol("flute.reflection.metadata.for-method-parameter");

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
 * Decorator function for a class. Attach metadata to a class.
 *
 * @param metadataKey The key used to store the data.
 * @param data Any JavaScript object (or string, number, ...).
 * @param objectType The type of the `target` used on decorator invocation. This should be `ObjectType.CONSTRUCTOR`
 * (default) if function is used as a decorator or instance if the decorator is applied directly to an instance of
 * the class.
 */
export function ClassMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.CONSTRUCTOR) {
    return (target: any | ReflectionObject) => {
        const obj = getConstructorReflectionObject(target, objectType);
        let classMetadata: Map<string | symbol, Map<string | symbol, any>> = obj.getMetadata(METADATA_KEY_CLASS);
        if (classMetadata == null) {
            classMetadata = new Map<string | symbol, Map<string | symbol, any>>();
        }
        classMetadata.set(metadataKey, data);
        obj.setMetadata(METADATA_KEY_CLASS, classMetadata);
    }
}

/**
 * Decorator function for a class. Assume the metadata for the given metadataKey is an array (initialize it if necessary)
 * and insert the `data` at the end of the array.
 * @param metadataKey The key of the metadata.
 * @param data The data to append to the metadata array.
 * @param objectType The object type of the `target` of the decorator invocation.
 */
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

/**
 * Decorator function for a class. Assume the metadata for the given metadataKey is an array (initialize it if necessary)
 * and insert the `data` at the start of the array.
 * @param metadataKey The key of the metadata.
 * @param data The data to append to the array.
 * @param objectType The object type of the `target` of the decorator invocation.
 */
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

/**
 * Decorator function for a class. Assume the metadata for the given `metadataKey` is a `Set` (initialize if necessary)
 * and add the `data` to the set.
 * @param metadataKey The key of the metadata.
 * @param data The data to add to the set.
 * @param objectType The object type of the `target` of the decorator invocation.
 */
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
 * @param metadataKey The key used to store the data.
 * @param objectType Metadata is always stored in the constructor. The object type specifies whether
 * `target` is the constructor function or an instance of the class.
 */
export function getClassMetadata(target: any, metadataKey: string | symbol,
    objectType: ObjectType = ObjectType.INSTANCE): any {

    const obj = getConstructorReflectionObject(target, objectType);
    const classMetadata: Map<string | symbol, Map<string | symbol, any>> = obj.getMetadata(METADATA_KEY_CLASS);
    if (classMetadata != null && classMetadata.has(metadataKey)) {
        return classMetadata.get(metadataKey);
    }
    return null;
}

/**
 * Decorator to attach metadata to a field (property or method).
 * @param metadataKey The key to store the data under.
 * @param metadata The data to store.
 * @param objectType Whether the `target` of the decorator invocation is the constructor or an instance
 * of the class.
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
        let fieldsMeta: Map<string | symbol, Map<string | symbol, any>> = obj.getMetadata(METADATA_KEY_FIELD);
        if (fieldsMeta == null) { fieldsMeta = new Map<string | symbol, Map<string | symbol, any>>(); }
        if (!fieldsMeta.has(fieldName)) {
            fieldsMeta.set(fieldName, new Map<string | symbol, any>());
        }
        fieldsMeta.get(fieldName).set(metadataKey, metadata);
        obj.setMetadata(METADATA_KEY_FIELD, fieldsMeta);
    }
}

/**
 * Decorator function for a field (method or propertyy). Assume the metadata for the given `metadataKey`
 * is an array (initialize if necessary) and append the `data` at the end.
 * @param metadataKey The key for the metadata.
 * @param data The data to append.
 * @param objectType The object type of the `target` of the decorator invocation.
 */
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

/**
 * Decorator function. Assume the metadata for the given `metadataKey` is an array (initialize if necessary)
 * and append the `data` at the start.
 * @param metadataKey The key for the metadata.
 * @param data The data to prepend.
 * @param objectType The object type of the `target` of the decorator invocation.
 */
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

/**
 * Decorator function for a field (property or method). Assume the metadata for the given `metadataKey`
 * is a `Set` (initialize if necessary) and add the `data` to the set.
 * @param metadataKey The key for the metadata.
 * @param data The data to add.
 * @param objectType The object type of the `target` of the decorator invocation.
 */
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
 * Decorator used to add metadata to a property. See [FieldMetadata](#fieldmetadata).
 * @param metaKey The metadata key.
 * @param data The data to store.
 * @param objectType Whether the `target` of the decorator invocation is the class constructor or a class instance.
 */
export function PropertyMetadata(metaKey: string | symbol, data: any, objectType: ObjectType = ObjectType.INSTANCE) {
    return (target: object, fieldName: string | symbol) => {
        FieldMetadata(metaKey, data, objectType)(target, fieldName);
    }
}

/**
 * Decorator used to append metadata to a property. See [AppendFieldMetadata](#appendfieldmetadata)
 * @param metadataKey The metadata key.
 * @param data The data to store.
 * @param objectType Whether the `target` of the decorator invocation is the class constructor or a class instance.
 */
export function AppendPropertyMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.INSTANCE) {
    return <T>(target: object, fieldName: string | symbol) => {
        AppendFieldMetadata(metadataKey, data, objectType)(target, fieldName);
    };
}

/**
 * Decorator to prepend metadata to a property. See [PrependFieldMetadata](#prependfieldmetadata)
 * @param metadataKey The metadata key.
 * @param data The data to store.
 * @param objectType Whether the `target` of the decorator invocation is the class constructor or a class instance.
 */
export function PrependPropertyMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.INSTANCE) {
    return <T>(target: object, fieldName: string | symbol) => {
        PrependFieldMetadata(metadataKey, data, objectType)(target, fieldName);
    };
}

/**
 * Decorator to add metadata to the metadata `Set` of a property. See [PutFieldMetadata](#putfieldmetadata)
 * @param metadataKey The metadata key.
 * @param data The data to store.
 * @param objectType Whether the `target` of the decorator invocation is the class constructor or a class instance.
 */
export function PutPropertyMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = ObjectType.INSTANCE) {
    return <T>(target: object, fieldName: string | symbol) => {
        PutFieldMetadata(metadataKey, data, objectType)(target, fieldName);
    };
}

/**
 * Decorator used to add metadata to a method. See [FieldMetadata](#fieldmetadata).
 * @param metaKey The metadata key.
 * @param data The data to store.
 * @param objectType Whether the `target` of the decorator invocation is the class constructor or a class instance.
 */
export function MethodMetadata(metaKey: string | symbol, data: any, objectType: ObjectType = null) {
    return <T>(target: object, fieldName: string | symbol) => {
        FieldMetadata(metaKey, data, objectType)(target, fieldName);
    }
}

/**
 * Decorator used to append metadata to a method. See [AppendFieldMetadata](#appendfieldmetadata)
 * @param metadataKey The metadata key.
 * @param data The data to store.
 * @param objectType Whether the `target` of the decorator invocation is the class constructor or a class instance.
 */
export function AppendMethodMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = null) {
    return <T>(target: object, fieldName: string | symbol) => {
        AppendFieldMetadata(metadataKey, data, objectType)(target, fieldName);
    };
}

/**
 * Decorator to prepend metadata to a method. See [PrependFieldMetadata](#prependfieldmetadata)
 * @param metadataKey The metadata key.
 * @param data The data to store.
 * @param objectType Whether the `target` of the decorator invocation is the class constructor or a class instance.
 */
export function PrependMethodMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = null) {
    return <T>(target: object, fieldName: string | symbol) => {
        PrependFieldMetadata(metadataKey, data, objectType)(target, fieldName);
    };
}

/**
 * Decorator to add metadata to the metadata `Set` of a method. See [PutFieldMetadata](#putfieldmetadata)
 * @param metadataKey The metadata key.
 * @param data The data to store.
 * @param objectType Whether the `target` of the decorator invocation is the class constructor or a class instance.
 */
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
    const allFields: Map<string | symbol, Map<string | symbol, any>> = obj.getMetadata(METADATA_KEY_FIELD);
    // if (objectType === ObjectType.INSTANCE) {
    //     console.log("getAllFieldsMetadata: ", { target, objectType, allFields });
    // }
    return allFields;
}

/**
 * Get all metadata associated with the field.
 *
 * @param target The object containing the metadata.
 * @param fieldName The name of field.
 * @param objectType Metadata is always stored in the constructor. The object type specifies whether
 * `target` is the constructor function or an instance of the class.
 * @returns `null` or `undefined` if no metadata could be found for the field.
 */
export function getAllMetadataOfField(target: any, fieldName: string | symbol,
    objectType: ObjectType = ObjectType.INSTANCE): Map<string | symbol, any> {

    const allFieldsMeta = getAllFieldsMetadata(target, objectType);
    if (allFieldsMeta != null && allFieldsMeta.has(fieldName)) {
        return allFieldsMeta.get(fieldName);
    }

    return null;
}

/**
 * Get the metadata of the field of an object.
 * @param target The object containing the field.
 * @param fieldName The name of the field.
 * @param metadataKey The key the metadata is stored under.
 * @param objectType The object type of `target`.
 */
export function getFieldMetadata(target: any, fieldName: string | symbol, metadataKey: string | symbol,
    objectType: ObjectType = ObjectType.INSTANCE): any {
    if (objectType == null) {
        objectType = fieldName == null ? ObjectType.CONSTRUCTOR : ObjectType.INSTANCE;
    }
    const fieldMetadata: Map<string | symbol, any> = getAllMetadataOfField(target, fieldName, objectType);
    if (fieldMetadata != null && fieldMetadata.has(metadataKey)) {
        return fieldMetadata.get(metadataKey);
    } else {
        return null;
    }
}

/**
 * Decorator function for method parameters. Set metadata of a method parameter.
 *
 * @param metadataKey The metadata key to store the data under.
 * @param data The metadata value to store.
 * @param objectType The type of the `target` of the decorator invocation.
 */
export function MethodParameterMetadata(metadataKey: string | symbol, data: any, objectType: ObjectType = null) {
    return (target: object, methodName: string | symbol, index: number) => {
        // console.log("(1)");

        if (methodName == null) { methodName = null; }
        let methodParameterMeta: Map<number, Map<string | symbol, any>> =
            getFieldMetadata(target, methodName, METADATA_KEY_METHOD_PARAMETER, objectType);

        // console.log("(2)");

        if (methodParameterMeta == null) {
            methodParameterMeta = new Map<number, Map<string | symbol, any>>();
            // console.log("(2.1) created new map.");
            FieldMetadata(METADATA_KEY_METHOD_PARAMETER, methodParameterMeta, objectType)(target, methodName);
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

/**
 * Decorator function for method parameters. Assume the metadata is an array (initialize if necessary) and
 * add the `data` to the end of the array.
 * @param metadataKey The key for the metadata
 * @param data The data to add to the array
 * @param objectType The type of the `target` of the decorator invocation.
 */
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

/**
 * Decorator function for method parameters. Like [AppendMethodParameterMetadata](#methodparametermetadata), but
 * adds the `data` to the start of the array.
 * @param metadataKey The key of the metadata.
 * @param data The data to prepend to the array.
 * @param objectType The type of the `target` of the decorator invocation.
 */
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

/**
 * Decorator for method parameters. Assumes the metadata is a `Set` and adds the `data` to the set.
 * @param metadataKey The key of the metadata.
 * @param data The data to add to the `Set`.
 * @param objectType The type of the `target` of the decorator invocation.
 */
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
 * Get the metadata of all method parameters of the method identified by `key`. The resulting `Map`
 * will be indexed by the parameter indices.
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

    const parametersMetadata = getFieldMetadata(target, methodName, METADATA_KEY_METHOD_PARAMETER, objectType);
    // console.log("getAllMethodParametersMetadata: target =", target, ", methodName =", methodName,
    //     ", objectType =", ObjectType[objectType], ", metadata =", parametersMetadata);
    return parametersMetadata;
}

/**
 * Get all metadata of the method parameter identified by `index`. The resulting `Map` will be indexed
 * by the metadata key of the metadata.
 *
 * @param target The object containing the method.
 * @param methodName The name of the method.
 * @param index The index of the method parameter.
 * @param objectType Whether `target` is the constructor of the class itself or an instance of the class.
 */
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

/**
 * Gets the metadata stored for the given `metadataKey` for the method parameter identified by `index`.
 *
 * @param target The object containing the method.
 * @param methodName The name of the method.
 * @param index The index of the parameter.
 * @param metadataKey The key the metadata is stored under.
 * @param objectType Whether `target` is the constructor of the class or an instance of the class.
 */
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

/**
 * A generic decorator function to set metadata on any of the supported targets (classes, fields/properties/methods,
 * method parameters).
 * @param metadataKey The metadata key.
 * @param value The data to store.
 * @param objectType The type of the `target` of the decorator invocation.
 */
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