import { ReflectionMethod } from "./reflection_method";
import { REFLECTION_PARAMETERS_ANNOTATIONS_KEY } from "./metadata_keys";


export class ReflectionParameter {
    constructor(
        public readonly method: ReflectionMethod,
        public readonly index: number
    ) {}

    public getType(): any {
        const types: any[] = this.method.getMetadata("design:paramtypes");
        return types[this.index];
    }

    public getAnnotations(): any[] {
        return (this.getPrototypeAnnotations() || [])
            .concat(this.getInstanceAnnotations() || []);
    }

    public getLatestAnnotation(type: any): any {
        return (this.getAnnotations() || []).reverse()
            .find((annotation) => annotation instanceof type);
    }

    public getInstanceAnnotations(initialize: boolean = false): any[] {
        let annotations: { [key: number]: any[] } = this.method.getMetadata(REFLECTION_PARAMETERS_ANNOTATIONS_KEY);
        if (initialize === true && annotations == null) {
            annotations = {};
            this.method.setMetadata(REFLECTION_PARAMETERS_ANNOTATIONS_KEY, annotations);
        } else if (annotations == null) {
            return null;
        }

        if (initialize === true && annotations[this.index] == null) {
            annotations[this.index] = [];
        }

        return annotations[this.index];
    }

    public getLatestInstanceAnnotation(type: any): any {
        return (this.getInstanceAnnotations() || []).reverse()
            .find((annotation) => annotation instanceof type);
    }

    public getPrototypeAnnotations(initialize: boolean = false): any[] {
        return this.method.obj.getPrototypeMethodParameterAnnotations(this.method.key, this.index, initialize);
    }

    public getLatestPrototypeAnnotation(type: any): any {
        return (this.getPrototypeAnnotations() || []).reverse()
            .find((annotation) => annotation instanceof type);
    }
}