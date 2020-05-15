import { PutPropertyMetadata, getFieldMetadata, PutMethodMetadata, PutMethodParameterMetadata,
    getMethodParameterMetadata, PutClassMetadata, getClassMetadata, PutFieldMetadata } from "./metadata";
import { ObjectType } from "./reflection/types";

export const TAG_KEY_CLASS = Symbol("flute.tag.for-class");
export const TAG_KEY_FIELD = Symbol("flute.tag.for-field");
export const TAG_KEY_METHOD_PARAMETER = Symbol("flute.tag.for-method-parameter");

export function TagField(tag: any) {
    if (tag == null) {
        return () => {};
    }

    return PutFieldMetadata(TAG_KEY_FIELD, tag);
}

export function getFieldTags(target: any, fieldName: string | symbol,
    objectType: ObjectType = ObjectType.INSTANCE): Set<any> {
    return getFieldMetadata(target, fieldName, TAG_KEY_FIELD, objectType);
}

export function TagProperty(tag: any) {
    return TagField(tag);
}

export function getPropertyTags(target: any, propertyName: string | symbol,
    objectType: ObjectType = ObjectType.INSTANCE): Set<any> {
    return getFieldTags(target, propertyName, objectType) as Set<any>;
}

export function TagMethod(tag: any) {
    return TagField(tag);
}

export function getMethodTags(target: any, methodName: string | symbol, objectType: ObjectType = ObjectType.INSTANCE): Set<any> {
    return getFieldTags(target, methodName, objectType) as Set<any>;
}

export function TagMethodParameter(tag: any) {
    if (tag == null) {
        return () => {};
    }

    return PutMethodParameterMetadata(TAG_KEY_METHOD_PARAMETER, tag);
}

export function getMethodParameterTags(
    target: any, key: string | symbol, index: number, objectType: ObjectType = ObjectType.INSTANCE): Set<any> {

    return getMethodParameterMetadata(target, key, index, TAG_KEY_METHOD_PARAMETER, objectType);
}

export function TagClass(tag: any) {
    if (tag == null) {
        return () => {};
    }

    return PutClassMetadata(TAG_KEY_CLASS, tag);
}

export function getClassTags(target: any, objectType: ObjectType = ObjectType.INSTANCE): Set<any> {
    return getClassMetadata(target, TAG_KEY_CLASS, objectType);
}