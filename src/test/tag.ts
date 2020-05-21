import "reflect-metadata";

import * as assert from "assert";
import { ObjectType } from "../main";
import { describe, it } from "mocha";
import { TagClass, TagProperty, TagMethodParameter, getClassTags, getPropertyTags, getMethodParameterTags,
    TagMethod, Tag, getFieldTags, getMethodTags } from "../main/tag";

@TagClass("classTag1")
@TagClass("classTag2")
@TagClass("classTag1")
class A {
    @TagProperty("propTag1")
    @TagProperty("propTag1")
    @TagProperty("propTag2")
    public testProp1: any;

    constructor(
        @TagMethodParameter("lorem")
        @TagMethodParameter("ipsum")
        param1: string,
        protected param2: number
    ) {}

    @TagMethod("me1")
    @TagMethod("me2")
    public testMethod1(
        param1: boolean,
        @TagMethodParameter("test1")
        @TagMethodParameter("test2")
        @TagMethodParameter("test3")
        param2: any
    ) {}
}

describe("Get tags (constructor)", () => {
    it("From class (constructor)", () => {
        const tags = getClassTags(A, ObjectType.CONSTRUCTOR);
        assert.ok(tags != null);
        assert.ok(tags instanceof Set);

        const tagsSet: Set<any> = tags as Set<any>;
        assert.equal(tagsSet.size, 2);
        assert.ok(tagsSet.has("classTag1"));
        assert.ok(tagsSet.has("classTag2"));
    });
    it("From property (constructor)", () => {
        const tags = getPropertyTags(A, "testProp1", ObjectType.CONSTRUCTOR);
        assert.ok(tags != null);
        assert.ok(tags instanceof Set);

        const tagsSet: Set<any> = tags as Set<any>;
        assert.equal(tagsSet.size, 2);
        assert.ok(tagsSet.has("propTag1"));
        assert.ok(tagsSet.has("propTag2"));
    });
    it("From method (constructor)", () => {
        const tags = getPropertyTags(A, "testMethod1", ObjectType.CONSTRUCTOR);
        assert.ok(tags != null);
        assert.ok(tags instanceof Set);

        const tagsSet: Set<any> = tags as Set<any>;
        assert.equal(tagsSet.size, 2);
        assert.ok(tagsSet.has("me1"));
        assert.ok(tagsSet.has("me2"));
    });
    it("From constructor parameter (constructor)", () => {
        const tags = getMethodParameterTags(A, null, 0, ObjectType.CONSTRUCTOR);
        assert.ok(tags != null);
        assert.ok(tags instanceof Set);

        const tagsSet: Set<any> = tags as Set<any>;
        assert.equal(tagsSet.size, 2);
        assert.ok(tagsSet.has("lorem"));
        assert.ok(tagsSet.has("ipsum"));

        const tags1 = getMethodParameterTags(A, null, 1, ObjectType.CONSTRUCTOR);
        assert.ok(tags1 == null);
    });
    it("From method parameter (constructor)", () => {
        const tags1 = getMethodParameterTags(A, "TestMethod1", 0, ObjectType.CONSTRUCTOR);
        assert.ok(tags1 == null);

        const tags = getMethodParameterTags(A, "testMethod1", 1, ObjectType.CONSTRUCTOR);
        assert.ok(tags != null);
        assert.ok(tags instanceof Set);

        const tagsSet: Set<any> = tags as Set<any>;
        assert.equal(tagsSet.size, 3);
        assert.ok(tagsSet.has("test1"));
        assert.ok(tagsSet.has("test2"));
        assert.ok(tagsSet.has("test3"));
    });
});

const objA = new A("test", 1234);
describe("Get tags (instance)", () => {
    it("From class (instance)", () => {
        const tags = getClassTags(objA, ObjectType.INSTANCE);
        assert.ok(tags != null);
        assert.ok(tags instanceof Set);

        const tagsSet: Set<any> = tags as Set<any>;
        assert.equal(tagsSet.size, 2);
        assert.ok(tagsSet.has("classTag1"));
        assert.ok(tagsSet.has("classTag2"));
    });
    it("From property (instance)", () => {
        const tags = getPropertyTags(objA, "testProp1", ObjectType.INSTANCE);
        assert.ok(tags != null);
        assert.ok(tags instanceof Set);

        const tagsSet: Set<any> = tags as Set<any>;
        assert.equal(tagsSet.size, 2);
        assert.ok(tagsSet.has("propTag1"));
        assert.ok(tagsSet.has("propTag2"));
    });
    it("From method (instance)", () => {
        const tags = getPropertyTags(objA, "testMethod1", ObjectType.INSTANCE);
        assert.ok(tags != null);
        assert.ok(tags instanceof Set);

        const tagsSet: Set<any> = tags as Set<any>;
        assert.equal(tagsSet.size, 2);
        assert.ok(tagsSet.has("me1"));
        assert.ok(tagsSet.has("me2"));
    });
    it("From constructor parameter (instance)", () => {
        const tags = getMethodParameterTags(objA, null, 0, ObjectType.INSTANCE);
        assert.ok(tags != null);
        assert.ok(tags instanceof Set);

        const tagsSet: Set<any> = tags as Set<any>;
        assert.equal(tagsSet.size, 2);
        assert.ok(tagsSet.has("lorem"));
        assert.ok(tagsSet.has("ipsum"));

        const tags1 = getMethodParameterTags(objA, null, 1, ObjectType.INSTANCE);
        assert.ok(tags1 == null);
    });
    it("From method parameter (instance)", () => {
        const tags1 = getMethodParameterTags(objA, "TestMethod1", 0, ObjectType.INSTANCE);
        assert.ok(tags1 == null);

        const tags = getMethodParameterTags(objA, "testMethod1", 1, ObjectType.INSTANCE);
        assert.ok(tags != null);
        assert.ok(tags instanceof Set);

        const tagsSet: Set<any> = tags as Set<any>;
        assert.equal(tagsSet.size, 3);
        assert.ok(tagsSet.has("test1"));
        assert.ok(tagsSet.has("test2"));
        assert.ok(tagsSet.has("test3"));
    });
});

@Tag("lorem")
@Tag("ipsum")
class H {
    @Tag("dolor")
    @Tag("sit")
    public property1;

    constructor(
        @Tag("amed")
        @Tag("consetetur")
        private param1: string
    ) { }

    @Tag("sadipscing")
    @Tag("elitr")
    public method1(
        @Tag("sed")
        @Tag("diam")
        param1: any
    ) {}
}

describe("Tag", () => {
    it("Get (constructor)", () => {
        assert.deepStrictEqual(getClassTags(H, ObjectType.CONSTRUCTOR), new Set(["lorem", "ipsum"]));
        assert.deepStrictEqual(getFieldTags(H, "property1", ObjectType.CONSTRUCTOR), new Set(["dolor", "sit"]));
        assert.deepStrictEqual(getMethodParameterTags(H, null, 0, ObjectType.CONSTRUCTOR), new Set(["amed","consetetur"]));
        assert.deepStrictEqual(getMethodTags(H, "method1", ObjectType.CONSTRUCTOR), new Set(["sadipscing", "elitr"]));
        assert.deepStrictEqual(getMethodParameterTags(H, "method1", 0, ObjectType.CONSTRUCTOR), new Set(["sed", "diam"]));
    });
    it("Get (instance)", () => {
        const h = new H("asdf");
        assert.deepStrictEqual(getClassTags(h, ObjectType.INSTANCE), new Set(["lorem", "ipsum"]));
        assert.deepStrictEqual(getFieldTags(h, "property1", ObjectType.INSTANCE), new Set(["dolor", "sit"]));
        assert.deepStrictEqual(getMethodParameterTags(h, null, 0, ObjectType.INSTANCE), new Set(["amed","consetetur"]));
        assert.deepStrictEqual(getMethodTags(h, "method1", ObjectType.INSTANCE), new Set(["sadipscing", "elitr"]));
        assert.deepStrictEqual(getMethodParameterTags(h, "method1", 0, ObjectType.INSTANCE), new Set(["sed", "diam"]));
    });
});