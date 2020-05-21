import "reflect-metadata";

import * as assert from "assert";
import { AnnotateClass, getClassAnnotations, ObjectType, AnnotateProperty,
    AnnotateMethod, getMethodAnnotations, getPropertyAnnotations, AnnotateMethodParameter,
    getMethodParameterAnnotations,
    Annotate,
    getFieldAnnotations} from "../main";
import { describe, it } from "mocha";

class SimpleClassAnnotation {
    constructor(public readonly msg?: string) {}
}

class AnotherSimpleClassAnnotation {
    constructor(public readonly value?: number) {}
}

@AnnotateClass(new SimpleClassAnnotation("testA"))
class A {
    constructor() {
    }
}

@AnnotateClass(new SimpleClassAnnotation("testB1"))
@AnnotateClass(new SimpleClassAnnotation("testB2"))
@AnnotateClass(new AnotherSimpleClassAnnotation(17))
class B {
    constructor() {}
}

class C {
    constructor() {}
}

describe("Class Annotations", () => {
    describe("Single annotation", () => {
        it("get annotations from constructor", () => {
            const annotations = getClassAnnotations(A, ObjectType.CONSTRUCTOR);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 1, "contains one annotation");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation);
            assert.strictEqual(annotations[0].msg, "testA");
        });
        it("get annotations from instance", () => {
            const instance: A = new A();
            const annotations = getClassAnnotations(instance);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 1, "contains one annotation");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation);
            assert.strictEqual(annotations[0].msg, "testA");
        });
    });
    describe("Multiple annotations", () => {
        it("get annotations from constructor", () => {
            const annotations = getClassAnnotations(B, ObjectType.CONSTRUCTOR);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 3, "contains three annotations");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation);
            assert.equal(annotations[1].constructor, SimpleClassAnnotation);
            assert.equal(annotations[2].constructor, AnotherSimpleClassAnnotation);
            assert.strictEqual(annotations[0].msg, "testB1");
            assert.strictEqual(annotations[1].msg, "testB2");
            assert.strictEqual(annotations[2].value, 17);
        });
        it("get annotations from instance", () => {
            const instance: B = new B();
            const annotations = getClassAnnotations(instance);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 3, "contains three annotation");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation);
            assert.equal(annotations[1].constructor, SimpleClassAnnotation);
            assert.equal(annotations[2].constructor, AnotherSimpleClassAnnotation);
            assert.strictEqual(annotations[0].msg, "testB1");
            assert.strictEqual(annotations[1].msg, "testB2");
            assert.strictEqual(annotations[2].value, 17);
        });
    });
    describe("No annotations", () => {
        it("get annotations from constructor", () => {
            const annotations = getClassAnnotations(C, ObjectType.CONSTRUCTOR);
            assert.equal(annotations, null, "null");
        });
        it("get annotations from instance", () => {
            const instance: C = new C();
            const annotations = getClassAnnotations(instance);
            assert.equal(annotations, null, "not null");
        });
    });
});

class D {
    @AnnotateProperty(new AnotherSimpleClassAnnotation(31))
    private testField1: object;

    @AnnotateProperty(new AnotherSimpleClassAnnotation(31))
    @AnnotateProperty(new SimpleClassAnnotation("testField2 test"))
    @AnnotateProperty(new AnotherSimpleClassAnnotation(47))
    private testField2: object;

    protected testField3: string;

    constructor() {}

    @AnnotateMethod(new SimpleClassAnnotation("testMethod1"))
    public test1() {
        console.log("test1");
    }

    @AnnotateMethod(new SimpleClassAnnotation("testMethod1_1"))
    @AnnotateMethod(new SimpleClassAnnotation("testMethod1_2"))
    @AnnotateMethod(new SimpleClassAnnotation("testMethod1_3"))
    @AnnotateMethod(new SimpleClassAnnotation("testMethod1_4"))
    public test2() {
        console.log("test2");
    }

    public test3() {
        console.log("test3");
    }
}

describe("Property annotations", () => {
    describe("Single property annotation", () => {
        it("get annotations via constructor", () => {
            const annotations = getPropertyAnnotations(D, "testField1", ObjectType.CONSTRUCTOR);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 1, "contains one annotation");
            assert.equal(annotations[0].constructor, AnotherSimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[0].value, 31, "annotation has correct value");
        });
        it("get annotations via instance", () => {
            const instance = new D();
            const annotations = getPropertyAnnotations(instance, "testField1");
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 1, "contains one annotation");
            assert.equal(annotations[0].constructor, AnotherSimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[0].value, 31, "annotation has correct value");
        });
    });
    describe("Multiple property annotations", () => {
        it("get annotations via constructor", () => {
            const annotations = getPropertyAnnotations(D, "testField2", ObjectType.CONSTRUCTOR);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 3, "contains three annotations");
            assert.equal(annotations[0].constructor, AnotherSimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[1].constructor, SimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[2].constructor, AnotherSimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[0].value, 31, "annotation has correct value");
            assert.equal(annotations[1].msg, "testField2 test", "annotation has correct value");
            assert.equal(annotations[2].value, 47, "annotation has correct value");
        });
        it("get annotations via instance", () => {
            const instance = new D();
            const annotations = getPropertyAnnotations(instance, "testField2");
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 3, "contains three annotations");
            assert.equal(annotations[0].constructor, AnotherSimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[1].constructor, SimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[2].constructor, AnotherSimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[0].value, 31, "annotation has correct value");
            assert.equal(annotations[1].msg, "testField2 test", "annotation has correct value");
            assert.equal(annotations[2].value, 47, "annotation has correct value");
        });
    });
    describe("No property annotation", () => {
        it("get annotations via constructor", () => {
            const annotations = getPropertyAnnotations(D, "testField3", ObjectType.CONSTRUCTOR);
            assert.equal(annotations, null, "null");
        });
        it("get annotations via instance", () => {
            const instance = new D();
            const annotations = getPropertyAnnotations(instance, "testField3");
            assert.equal(annotations, null, "null");
        });
    });
});

describe("Method annotations", () => {
    describe("Single method annotation", () => {
        it("get annotations via constructor", () => {
            const annotations = getMethodAnnotations(D, "test1", ObjectType.CONSTRUCTOR);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 1, "contains one annotation");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[0].msg, "testMethod1", "annotation has correct value");
        });
        it("get annotations via instance", () => {
            const instance = new D();
            const annotations = getMethodAnnotations(instance, "test1");
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 1, "contains one annotation");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[0].msg, "testMethod1", "annotation has correct value");
        });
    });
    describe("Multiple method annotations", () => {
        it("get annotations via constructor", () => {
            const annotations = getMethodAnnotations(D, "test2", ObjectType.CONSTRUCTOR);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 4, "contains four annotations");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[1].constructor, SimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[2].constructor, SimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[3].constructor, SimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[0].msg, "testMethod1_1", "annotation has correct value");
            assert.equal(annotations[1].msg, "testMethod1_2", "annotation has correct value");
            assert.equal(annotations[2].msg, "testMethod1_3", "annotation has correct value");
            assert.equal(annotations[3].msg, "testMethod1_4", "annotation has correct value");
        });
        it("get annotations via instance", () => {
            const instance = new D();
            const annotations = getMethodAnnotations(instance, "test2");
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 4, "contains four annotations");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[1].constructor, SimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[2].constructor, SimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[3].constructor, SimpleClassAnnotation, "annotation has correct type");
            assert.equal(annotations[0].msg, "testMethod1_1", "annotation has correct value");
            assert.equal(annotations[1].msg, "testMethod1_2", "annotation has correct value");
            assert.equal(annotations[2].msg, "testMethod1_3", "annotation has correct value");
            assert.equal(annotations[3].msg, "testMethod1_4", "annotation has correct value");
        });
    });
    describe("No method annotation", () => {
        it("get annotations via constructor", () => {
            const annotations = getMethodAnnotations(D, "test3", ObjectType.CONSTRUCTOR);
            assert.equal(annotations, null, "null");
        });
        it("get annotations via instance", () => {
            const instance = new D();
            const annotations = getMethodAnnotations(instance, "test3");
            assert.equal(annotations, null, "null");
        });
    });
});

class E {
    constructor(
        @AnnotateMethodParameter(new SimpleClassAnnotation("p1")) param1: string,

        unannotated1: boolean,

        @AnnotateMethodParameter(new SimpleClassAnnotation("p2_1"))
        @AnnotateMethodParameter(new SimpleClassAnnotation("p2_2"))
        @AnnotateMethodParameter(new AnotherSimpleClassAnnotation(11)) param2: number,

        public readonly unannotated2: number,

        @AnnotateMethodParameter(new SimpleClassAnnotation("p3"))
        public readonly param3: string
    ) {
    }

    public test1(
        @AnnotateMethodParameter(new SimpleClassAnnotation("test1_1"))
        @AnnotateMethodParameter(new AnotherSimpleClassAnnotation(101))
        param1: number,

        unannotated1: any
    ) {
        console.log("test1");
    }
}

describe("Parameter Annotations", () => {
    describe("Constructor annotations", () => {
        it("get param1 annotations from constructor", () => {
            const annotations = getMethodParameterAnnotations(E, null, 0, ObjectType.CONSTRUCTOR);
            // console.log("annotations: ", annotations);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 1, "contains one annotation");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation);
            assert.strictEqual(annotations[0].msg, "p1");
        });
        it("get unannotated1 annotations from constructor", () => {
            const annotations = getMethodParameterAnnotations(E, null, 1, ObjectType.CONSTRUCTOR);
            assert.equal(annotations, null, "null");
        });
        it("get param2 annotations from constructor", () => {
            const annotations = getMethodParameterAnnotations(E, null, 2, ObjectType.CONSTRUCTOR);
            // console.log("annotations: ", annotations);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 3, "contains three annotation");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation);
            assert.equal(annotations[1].constructor, SimpleClassAnnotation);
            assert.equal(annotations[2].constructor, AnotherSimpleClassAnnotation);
            assert.strictEqual(annotations[0].msg, "p2_1");
            assert.strictEqual(annotations[1].msg, "p2_2");
            assert.strictEqual(annotations[2].value, 11);
        });
        it("get unannotated2 annotations from constructor", () => {
            const annotations = getMethodParameterAnnotations(E, null, 3, ObjectType.CONSTRUCTOR);
            assert.equal(annotations, null, "null");
        });
        it("get param3 annotations from constructor", () => {
            const annotations = getMethodParameterAnnotations(E, null, 4, ObjectType.CONSTRUCTOR);
            // console.log("annotations: ", annotations);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 1, "contains one annotation");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation);
            assert.strictEqual(annotations[0].msg, "p3");
        });

        it("get param1 annotations from instance", () => {
            const instance = new E("asdf", true, 1.0, 2.0, "fdsa");
            const annotations = getMethodParameterAnnotations(instance, null, 0);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 1, "contains one annotation");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation);
            assert.strictEqual(annotations[0].msg, "p1");
        });
        it("get unannotated1 annotations from instance", () => {
            const instance = new E("asdf", true, 1.0, 2.0, "fdsa");
            const annotations = getMethodParameterAnnotations(instance, null, 1);
            assert.equal(annotations, null, "null");
        });
        it("get param2 annotations from instance", () => {
            const instance = new E("asdf", true, 1.0, 2.0, "fdsa");
            const annotations = getMethodParameterAnnotations(instance, null, 2);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 3, "contains three annotation");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation);
            assert.equal(annotations[1].constructor, SimpleClassAnnotation);
            assert.equal(annotations[2].constructor, AnotherSimpleClassAnnotation);
            assert.strictEqual(annotations[0].msg, "p2_1");
            assert.strictEqual(annotations[1].msg, "p2_2");
            assert.strictEqual(annotations[2].value, 11);
        });
        it("get unannotated2 annotations from instance", () => {
            const instance = new E("asdf", true, 1.0, 2.0, "fdsa");
            const annotations = getMethodParameterAnnotations(instance, null, 3);
            assert.equal(annotations, null, "null");
        });
        it("get param3 annotations from instance", () => {
            const instance = new E("asdf", true, 1.0, 2.0, "fdsa");
            const annotations = getMethodParameterAnnotations(instance, null, 4);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 1, "contains one annotation");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation);
            assert.strictEqual(annotations[0].msg, "p3");
        });
    });

    describe("Method annotations", () => {
        it("get param1 annotations from constructor", () => {
            const annotations = getMethodParameterAnnotations(E, "test1", 0, ObjectType.CONSTRUCTOR);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 2, "contains two annotations");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation);
            assert.equal(annotations[1].constructor, AnotherSimpleClassAnnotation);
            assert.strictEqual(annotations[0].msg, "test1_1");
            assert.strictEqual(annotations[1].value, 101);
        });
        it("get unannotated1 annotations from constructor", () => {
            const annotations = getMethodParameterAnnotations(E, "test1", 1, ObjectType.CONSTRUCTOR);
            assert.equal(annotations, null, "null");
        });
        it("get param1 annotations from instance", () => {
            const instance = new E("bla", false, 9.9, 4.321, "ble");
            const annotations = getMethodParameterAnnotations(instance, "test1", 0);
            assert.notEqual(annotations, null, "not null");
            assert.equal(annotations.length, 2, "contains two annotations");
            assert.equal(annotations[0].constructor, SimpleClassAnnotation);
            assert.equal(annotations[1].constructor, AnotherSimpleClassAnnotation);
            assert.strictEqual(annotations[0].msg, "test1_1");
            assert.strictEqual(annotations[1].value, 101);
        });
        it("get unannotated1 annotations from instance", () => {
            const instance = new E("bla", false, 9.9, 4.321, "ble");
            const annotations = getMethodParameterAnnotations(instance, "test1", 1);
            assert.equal(annotations, null, "null");
        });
    });
});

@Annotate("lorem")
@Annotate("ipsum")
class H {
    @Annotate("dolor")
    @Annotate("sit")
    public property1;

    constructor(
        @Annotate("amed")
        @Annotate("consetetur")
        private param1: string
    ) { }

    @Annotate("sadipscing")
    @Annotate("elitr")
    public method1(
        @Annotate("sed")
        @Annotate("diam")
        param1: any
    ) {}
}

describe("Annotate", () => {
    it("Get (constructor)", () => {
        assert.deepStrictEqual(getClassAnnotations(H, ObjectType.CONSTRUCTOR), ["lorem", "ipsum"]);
        assert.deepStrictEqual(getFieldAnnotations(H, "property1", ObjectType.CONSTRUCTOR), ["dolor", "sit"]);
        assert.deepStrictEqual(getMethodParameterAnnotations(H, null, 0, ObjectType.CONSTRUCTOR), ["amed","consetetur"]);
        assert.deepStrictEqual(getMethodAnnotations(H, "method1", ObjectType.CONSTRUCTOR), ["sadipscing", "elitr"]);
        assert.deepStrictEqual(getMethodParameterAnnotations(H, "method1", 0, ObjectType.CONSTRUCTOR), ["sed", "diam"]);
    });
    it("Get (instance)", () => {
        const h = new H("asdf");
        assert.deepStrictEqual(getClassAnnotations(h, ObjectType.INSTANCE), ["lorem", "ipsum"]);
        assert.deepStrictEqual(getFieldAnnotations(h, "property1", ObjectType.INSTANCE), ["dolor", "sit"]);
        assert.deepStrictEqual(getMethodParameterAnnotations(h, null, 0, ObjectType.INSTANCE), ["amed","consetetur"]);
        assert.deepStrictEqual(getMethodAnnotations(h, "method1", ObjectType.INSTANCE), ["sadipscing", "elitr"]);
        assert.deepStrictEqual(getMethodParameterAnnotations(h, "method1", 0, ObjectType.INSTANCE), ["sed", "diam"]);
    });
});