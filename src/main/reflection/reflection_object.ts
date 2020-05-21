// import { ReflectionField } from "./reflection_field";
// import { ReflectionMethod } from "./reflection_method";
// import { REFLECTION_ANNOTATIONS_KEY,
//     REFLECTION_PROTOTYPE_METHOD_ANNOTATIONS_KEY as REFLECTION_PROTOTYPE_FIELD_ANNOTATIONS_KEY,
//     REFLECTION_PROTOTYPE_PARAMETERS_ANNOTATIONS_KEY,
//     REFLECTION_PARAMETERS_ANNOTATIONS_KEY } from "./metadata_keys";

export class ReflectionObject {
    constructor(
        public readonly obj: any
    ) {
        if (obj == null) {
            throw new Error("Cannot create ReflectionObject of null.");
        }
    }

    /*
    public getFields(): ReflectionField[] {
        const result: ReflectionField[] = [];
        Object.getOwnPropertyNames(this.obj).forEach((name) => {
            result.push(this.getField(name));
        });
        return result;
    }

    public getField(name: string | symbol): ReflectionField {
        return new ReflectionField(this, name);
    }

    public getMethods(): ReflectionMethod[] {
        const proto: ReflectionObject = this.getPrototypeObject();
        const result: ReflectionMethod[] = proto.getFields()
            .filter((field) => {
                // console.log("testing field: ", field);
                return field.isMethod();
            })
            .map((field) => new ReflectionMethod(this, field.key));
        return result;
    }

    public getMethod(name: string | symbol): ReflectionMethod {
        const field = this.getField(name);
        if (field != null && field.isMethod()) {
            return new ReflectionMethod(this, field.key);
        }
        return null;
    }
    */

    public getMetadata(metadataKey: string | symbol): any {
        return Reflect.getMetadata(metadataKey, this.obj);
    }

    public setMetadata(metadataKey: string | symbol, value: any) {
        Reflect.defineMetadata(metadataKey, value, this.obj);
    }

    // public getAnnotations(): any[] {
    //     return (this.getPrototypeAnnotations() || [])
    //         .concat(this.getInstanceAnnotations() || []);
    // }

    // public getLatestAnnotation(type: any): any {
    //     return (this.getAnnotations() || []).reverse()
    //         .find((annotation) => annotation instanceof type);
    // }

    // public getInstanceAnnotations(initialize: boolean = false): any[] {
    //     let annotations: any[] = this.getMetadata(REFLECTION_ANNOTATIONS_KEY);
    //     if (annotations == null && initialize === true) {
    //         annotations = [];
    //         this.setMetadata(REFLECTION_ANNOTATIONS_KEY, annotations);
    //     }

    //     return annotations;
    // }

    // public getLatestInstanceAnnotation(type: any): any {
    //     return (this.getInstanceAnnotations() || []).reverse()
    //         .find((annotation) => annotation instanceof type);
    // }

    // public getPrototypeAnnotations(initialize: boolean = false): any[] {
    //     return this.getPrototypeObject().getInstanceAnnotations(initialize);
    // }

    // public getLatestPrototypeAnnotation(type: any): any {
    //     return (this.getPrototypeAnnotations() || []).reverse().find((annotation) => annotation instanceof type);
    // }

    // public getConstructorParameterAnnotations(index: number, initialize = false) : any[] {
    //     let annotations = this.getMetadata(REFLECTION_PARAMETERS_ANNOTATIONS_KEY);
    //     if (initialize && annotations == null) {
    //         annotations = {};
    //         this.setMetadata(REFLECTION_PARAMETERS_ANNOTATIONS_KEY, annotations);
    //     }
    //     if (initialize && annotations[index] == null) {
    //         annotations[index] = [];
    //     }
    //     return annotations != null ? annotations[index] : null;
    // }

    // public getLatestConstructorParameterAnnotation(index: number, type: any): any {
    //     return (this.getConstructorParameterAnnotations(index) || []).reverse()
    //         .find((annotation) => annotation instanceof type);
    // }

    // public getPrototypeFieldAnnotations(name: string | symbol, initialize: boolean = false): any[] {
    //     if (name == null) {
    //         return this.getPrototypeAnnotations(initialize);
    //     }

    //     // const key: string = name.toString();

    //     // console.log("getPrototypeFieldAnnotations: name =", name, ", initialize =", initialize);
    //     // console.log("getPrototypeFieldAnnotations: metadata keys =", Reflect.getMetadataKeys(this.obj, name));
    //     let annotations: Map<string | symbol, any[]> = this.getMetadata(REFLECTION_PROTOTYPE_FIELD_ANNOTATIONS_KEY);
    //     // console.log("getPrototypeFieldAnnotations: before init, annotations =", annotations);

    //     if (initialize && annotations == null) {
    //         annotations = new Map<string | symbol, any[]>();
    //         this.getPrototypeObject().setMetadata(REFLECTION_PROTOTYPE_FIELD_ANNOTATIONS_KEY, annotations);
    //     }

    //     if (initialize && !annotations.has(name)) {
    //         annotations.set(name, []);
    //     }

    //     // console.log("getPrototypeFieldAnnotations: after init, annotations =", annotations);
    //     // console.log("key", name, "in", annotations, "? ", (annotations != null) && annotations.has(name));
    //     // console.log("keys: ", annotations.keys());
    //     const result = (annotations != null) && annotations.has(name) ? annotations.get(name) : null;
    //     // console.log("getPrototypeFieldAnnotations: result =", result);
    //     return result;
    // }

    // public getPrototypeMethodParameterAnnotations(name: string | symbol, index: number, initialize: boolean = false): any[] {
    //     if (name == null) {
    //         return this.getConstructorParameterAnnotations(index, initialize);
    //     }

    //     // const key: string = name.toString();

    //     let annotations: Map<string | symbol, any> = this.getMetadata(REFLECTION_PROTOTYPE_PARAMETERS_ANNOTATIONS_KEY);
    //     if (initialize && annotations == null) {
    //         annotations = new Map<string | symbol, any>();
    //         this.getPrototypeObject().setMetadata(REFLECTION_PROTOTYPE_PARAMETERS_ANNOTATIONS_KEY, annotations);
    //     }
    //     if (initialize && !annotations.has(name)) {
    //         annotations.set(name, {});
    //     }
    //     if (initialize && annotations.get(name)[index] == null) {
    //         annotations.get(name)[index] = [];
    //     }

    //     return annotations != null && annotations.has(name) ? annotations.get(name)[index] : null;
    // }

    // public getLatestPrototypeMethodParameterAnnotation(name: string | symbol, index: number, type: any): any {
    //     return this.getPrototypeMethodParameterAnnotations(name, index).reverse()
    //         .find((annotation) => annotation instanceof type);
    // }

    public getPrototype(): object {
        return Reflect.getPrototypeOf(this.obj as any);
    }

    public getPrototypeObject<U>(): ReflectionObject {
        return new ReflectionObject(this.getPrototype());
    }

    public getSuperObject(): object {
        const proto = this.getPrototype();
        if (proto != null) {
            const superProto = Reflect.getPrototypeOf(proto);
            if (superProto != null) {
                return new ReflectionObject(superProto);
            }
        }
        return null;
    }

    public getRawMethodParameterTypes(methodName: string | symbol): any[] {
        const params: any[] = Reflect.getMetadata("design:paramtypes", this.obj, methodName) || [];
        return params;
    }
}