import { ReflectionField } from "./reflection_field";
import { ReflectionParameter } from "./reflection_parameter";
import { ReflectionObject } from "./reflection_object";


export class ReflectionMethod extends ReflectionField {
    constructor(
        public readonly obj: ReflectionObject,
        public readonly key: string | symbol
    ) {
        super(obj, key);
    }

    public run(...args): any {
        return this.obj.obj[this.key](...args);
    }

    public getReturnType(): any {
        return Reflect.getMetadata("design:returntype", this.obj.obj, this.key);
    }

    public getRawParameterTypes(): any[] {
        return Reflect.getMetadata("design:paramtypes", this.obj.obj, this.key);
    }

    public getParameters(): ReflectionParameter[] {
        // tslint:disable:ban-types
        const method: Function = this.obj.obj[this.key];
        const result: ReflectionParameter[] = [];
        for (let i = 0; i < method.length; i++) {
            result.push(new ReflectionParameter(this, i));
        }
        return result;
    }
}