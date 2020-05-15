import { ReflectionField } from "./reflection_field";
import { ReflectionObject } from "./reflection_object";


export class ReflectionProperty extends ReflectionField {
    constructor(
        public readonly obj: ReflectionObject,
        public readonly key: string | symbol
    ) {
        super(obj, key);
    }
}