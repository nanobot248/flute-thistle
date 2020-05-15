import { REFLECTION_ANNOTATIONS_KEY } from "./metadata_keys";
import { ReflectionObject } from "./reflection_object";


export class ReflectionField {
    constructor(
        public readonly obj: ReflectionObject,
        public readonly key: string | symbol
    ) {
        if (obj == null) {
            throw new Error("Cannot create ReflectionField objects from null or undefined objects.");
        }
    }

    public getType(): any {
        const type = Reflect.getMetadata("design:type", this.obj.obj, this.key);
        return type;
    }

    public isMethod(): boolean {
        const field: any = this.obj.obj[this.key];
        return field != null && typeof(field) === "function";
    }

    public isProperty(): boolean {
        return !this.isMethod();
    }

    public getDescriptor(): PropertyDescriptor {
        return Object.getOwnPropertyDescriptor(this.obj.obj, this.key);
    }

    public getAnnotations(): any[] {
        const result = (this.getPrototypeFieldAnnotations() || [])
            .concat(this.getFieldAnnotations() || []);

        console.log("getAnnotations: result =", result);

        return result;
    }

    public getLatestAnnotation(type: any): any {
        return this.getAnnotations().reverse()
            .find((annotation) => annotation instanceof type);
    }

    public getFieldAnnotations(initialize: boolean = false): any[] {
        let annotations: any[] = Reflect.getMetadata(REFLECTION_ANNOTATIONS_KEY, this.obj.obj, this.key);
        if (annotations == null && initialize === true) {
            annotations = [];
            Reflect.defineMetadata(REFLECTION_ANNOTATIONS_KEY, annotations, this.obj.obj, this.key);
        }

        return annotations;
    }

    public getLatestFieldAnnotation(type: any): any {
        return this.getFieldAnnotations().reverse()
            .find((annotation) => annotation instanceof type);
    }

    public getPrototypeFieldAnnotations(initialize: boolean = false): any[] {
        return this.obj.getPrototypeFieldAnnotations(this.key, initialize);
    }

    public getLatestPrototypeFieldAnnotation(type: any): any {
        return this.getPrototypeFieldAnnotations().reverse()
            .find((annotation) => annotation instanceof type);
    }

    public getMetadata(metadataKey: string | symbol): any {
        Reflect.getMetadata(metadataKey, this.obj, this.key);
    }

    public setMetadata(metadataKey: string | symbol, value: any) {
        Reflect.defineMetadata(metadataKey, value, this.obj, this.key);
    }
}