import * as assert from "assert";
import { describe, it } from "mocha";
import { ClassMetadata, getClassMetadata, AppendClassMetadata, PropertyMetadata, PrependClassMetadata,
    getFieldMetadata, AppendPropertyMetadata, PrependPropertyMetadata, MethodMetadata,
    AppendMethodMetadata, PrependMethodMetadata, MethodParameterMetadata, AppendMethodParameterMetadata,
    PrependMethodParameterMetadata, getMethodParameterMetadata, SetMetadata } from "../main/metadata";
import { ObjectType } from "../main";

class A {}
class AB {}
class B {}
class C {}
class D {}
class E {}

describe("Class metadata (instance)", () => {
    it("Set / Get single (instance)", () => {
        const obj = new A();
        ClassMetadata("test", "asdf", ObjectType.INSTANCE)(obj);
        assert.equal(getClassMetadata(obj, "test", ObjectType.INSTANCE), "asdf");
    });
    it("Set / Get multiple (instance)", () => {
        const obj = new AB();
        ClassMetadata("test", "asdf", ObjectType.INSTANCE)(obj);
        ClassMetadata("test", "fdsa", ObjectType.INSTANCE)(obj);
        ClassMetadata("test1", "lkj", ObjectType.INSTANCE)(obj);
        ClassMetadata("test2", 11, ObjectType.INSTANCE)(obj);
        assert.equal(getClassMetadata(obj, "test", ObjectType.INSTANCE), "fdsa");
        assert.equal(getClassMetadata(obj, "test1", ObjectType.INSTANCE), "lkj");
        assert.equal(getClassMetadata(obj, "test2", ObjectType.INSTANCE), 11);
    });
    it("Append / Get single (instance)", () => {
        const obj = new B();
        AppendClassMetadata("test", "asdf", ObjectType.INSTANCE)(obj);
        assert.equal(getClassMetadata(obj, "test", ObjectType.INSTANCE), "asdf");
    });
    it("Append / Get multiple (instance)", () => {
        const obj = new C();
        AppendClassMetadata("test", "asdf", ObjectType.INSTANCE)(obj);
        AppendClassMetadata("test", "1234", ObjectType.INSTANCE)(obj);
        AppendClassMetadata("test", 5, ObjectType.INSTANCE)(obj);
        AppendClassMetadata("test", true, ObjectType.INSTANCE)(obj);
        assert.deepStrictEqual(getClassMetadata(obj, "test", ObjectType.INSTANCE), [
            "asdf",
            "1234",
            5,
            true
        ]);
    });
    it("Prepend / Get single (instance)", () => {
        const obj = new D();
        PrependClassMetadata("test", "asdf", ObjectType.INSTANCE)(obj);
        assert.equal(getClassMetadata(obj, "test", ObjectType.INSTANCE), "asdf");
    });
    it("Prepend / Get multiple (instance)", () => {
        const obj = new E();
        PrependClassMetadata("test", "asdf", ObjectType.INSTANCE)(obj);
        PrependClassMetadata("test", "1234", ObjectType.INSTANCE)(obj);
        PrependClassMetadata("test", 5, ObjectType.INSTANCE)(obj);
        PrependClassMetadata("test", true, ObjectType.INSTANCE)(obj);
        assert.deepStrictEqual(getClassMetadata(obj, "test", ObjectType.INSTANCE), [
            true,
            5,
            "1234",
            "asdf"
        ]);
    });
});

@ClassMetadata("test", "abc9933")
class AA {}

@ClassMetadata("test", "abc9933")
@ClassMetadata("test1", "asdf1234")
@ClassMetadata("test", "wert")
@ClassMetadata("test2", "qwertz")
class ABA {}

@AppendClassMetadata("test", "trew")
class BB {}

@AppendClassMetadata("test", "poiu")
@AppendClassMetadata("test1", "lkjh")
@AppendClassMetadata("test", "ztr")
@AppendClassMetadata("test", "bnm")
@AppendClassMetadata("test1", "786")
class CC {}

@PrependClassMetadata("abcd", "zzz")
class DD {}

@PrependClassMetadata("abcd", "zzz1")
@PrependClassMetadata("abcd", "zzz2")
@PrependClassMetadata("abcd", "zzz3")
@PrependClassMetadata("abcd", "zzz4")
@PrependClassMetadata("abcd5", "zzz5")
@PrependClassMetadata("abcd5", "zzz6")
class EE {}

describe("Class metadata (constructor)", () => {
    it("Set / Get single (constructor)", () => {
        assert.equal(getClassMetadata(AA, "test", ObjectType.CONSTRUCTOR), "abc9933");
    });
    it("Set / Get multiple (constructor)", () => {
        assert.equal(getClassMetadata(ABA, "test", ObjectType.CONSTRUCTOR), "abc9933");
        assert.equal(getClassMetadata(ABA, "test1", ObjectType.CONSTRUCTOR), "asdf1234");
        assert.equal(getClassMetadata(ABA, "test2", ObjectType.CONSTRUCTOR), "qwertz");
    });
    it("Append / Get single (constructor)", () => {
        assert.equal(getClassMetadata(BB, "test", ObjectType.CONSTRUCTOR), "trew");
    });
    it("Append / Get multiple (constructor)", () => {
        assert.deepStrictEqual(getClassMetadata(CC, "test", ObjectType.CONSTRUCTOR), [
            "bnm",
            "ztr",
            "poiu"
        ]);
        assert.deepStrictEqual(getClassMetadata(CC, "test1", ObjectType.CONSTRUCTOR), [
            "786",
            "lkjh"
        ]);
    });
    it("Prepend / Get single (constructor)", () => {
        assert.equal(getClassMetadata(DD, "abcd", ObjectType.CONSTRUCTOR), "zzz");
    });
    it("Prepend / Get multiple (constructor)", () => {
        assert.deepStrictEqual(getClassMetadata(EE, "abcd", ObjectType.CONSTRUCTOR), [
            "zzz1",
            "zzz2",
            "zzz3",
            "zzz4"
        ]);
        assert.deepStrictEqual(getClassMetadata(EE, "abcd5", ObjectType.CONSTRUCTOR), [
            "zzz5",
            "zzz6"
        ]);
    });
});

class FF {
    public testProp1;
    public testProp2;
    public constructor() {}
    public testMethod1() {}
    public testMethod2() {}
}

const objFF = new FF();
PropertyMetadata("test", "lnb")(objFF, "testProp1");
PropertyMetadata("test", "zui")(objFF, "testProp2");
PropertyMetadata("test", "opi")(objFF, "testProp2");
PropertyMetadata("test1", "1test")(objFF, "testProp2");
AppendPropertyMetadata("test2", "1")(objFF, "testProp2");
AppendPropertyMetadata("test2", "2")(objFF, "testProp2");
AppendPropertyMetadata("test2", "4")(objFF, "testProp2");
AppendPropertyMetadata("test2", "8")(objFF, "testProp2");
PrependPropertyMetadata("test3", "A")(objFF, "testProp2");
PrependPropertyMetadata("test3", "B")(objFF, "testProp2");
PrependPropertyMetadata("test3", "C")(objFF, "testProp2");
PrependPropertyMetadata("test3", "D")(objFF, "testProp2");
PrependPropertyMetadata("test3", "E")(objFF, "testProp2");
MethodMetadata("test", "lnb")(objFF, "testMethod1");
MethodMetadata("test", "zui")(objFF, "testMethod2");
MethodMetadata("test", "opi")(objFF, "testMethod2");
MethodMetadata("test1", "1test")(objFF, "testMethod2");
AppendMethodMetadata("test2", "1")(objFF, "testMethod2");
AppendMethodMetadata("test2", "2")(objFF, "testMethod2");
AppendMethodMetadata("test2", "4")(objFF, "testMethod2");
AppendMethodMetadata("test2", "8")(objFF, "testMethod2");
PrependMethodMetadata("test3", "A")(objFF, "testMethod2");
PrependMethodMetadata("test3", "B")(objFF, "testMethod2");
PrependMethodMetadata("test3", "C")(objFF, "testMethod2");
PrependMethodMetadata("test3", "D")(objFF, "testMethod2");
PrependMethodMetadata("test3", "E")(objFF, "testMethod2");
MethodMetadata("testConstructor", "asdf", ObjectType.INSTANCE)(objFF, null);
AppendMethodMetadata("constructorTest", "s", ObjectType.INSTANCE)(objFF, null);
AppendMethodMetadata("constructorTest", "d", ObjectType.INSTANCE)(objFF, null);
AppendMethodMetadata("constructorTest", "f", ObjectType.INSTANCE)(objFF, null);
PrependMethodMetadata("constructorTest", "a", ObjectType.INSTANCE)(objFF, null);

describe("Property metadata (instance)", () => {
    it("Set / Get (instance)", () => {
        assert.equal(getFieldMetadata(objFF, "testProp1", "test", ObjectType.INSTANCE), "lnb");
        assert.equal(getFieldMetadata(objFF, "testProp2", "test", ObjectType.INSTANCE), "opi");
        assert.equal(getFieldMetadata(objFF, "testProp2", "test1", ObjectType.INSTANCE), "1test");
        assert.deepStrictEqual(getFieldMetadata(objFF, "testProp2", "test2", ObjectType.INSTANCE), [
            "1", "2", "4", "8"
        ]);
        assert.deepStrictEqual(getFieldMetadata(objFF, "testProp2", "test3", ObjectType.INSTANCE), [
            "E", "D", "C", "B", "A"
        ]);
    });
});

describe("Constructor metadata (instance)", () => {
    it("For constructor (instance)", () => {
        assert.equal(getFieldMetadata(objFF, null, "testConstructor", ObjectType.INSTANCE), "asdf");
        assert.deepStrictEqual(getFieldMetadata(objFF, null, "constructorTest", ObjectType.INSTANCE), [
            "a", "s", "d", "f"
        ]);
    });
});

describe("Method metadata (instance)", () => {
    it("Set / Get (instance)", () => {
        assert.equal(getFieldMetadata(objFF, "testMethod1", "test", ObjectType.INSTANCE), "lnb");
        assert.equal(getFieldMetadata(objFF, "testMethod2", "test", ObjectType.INSTANCE), "opi");
        assert.equal(getFieldMetadata(objFF, "testMethod2", "test1", ObjectType.INSTANCE), "1test");
        assert.deepStrictEqual(getFieldMetadata(objFF, "testMethod2", "test2", ObjectType.INSTANCE), [
            "1", "2", "4", "8"
        ]);
        assert.deepStrictEqual(getFieldMetadata(objFF, "testMethod2", "test3", ObjectType.INSTANCE), [
            "E", "D", "C", "B", "A"
        ]);
    });
});

class F {
    @PropertyMetadata("test", "lnb")
    public testProp1;

    @PropertyMetadata("test", "zui")
    @PropertyMetadata("test", "opi")
    @PropertyMetadata("test1", "1test")
    @AppendPropertyMetadata("test2", "1")
    @AppendPropertyMetadata("test2", "2")
    @AppendPropertyMetadata("test2", "4")
    @AppendPropertyMetadata("test2", "8")
    @PrependPropertyMetadata("test3", "A")
    @PrependPropertyMetadata("test3", "B")
    @PrependPropertyMetadata("test3", "C")
    @PrependPropertyMetadata("test3", "D")
    @PrependPropertyMetadata("test3", "E")
    public testProp2;

    @MethodMetadata("test", "lnb")
    public testMethod1() {}

    @MethodMetadata("test", "zui")
    @MethodMetadata("test", "opi")
    @MethodMetadata("test1", "1test")
    @AppendMethodMetadata("test2", "1")
    @AppendMethodMetadata("test2", "2")
    @AppendMethodMetadata("test2", "4")
    @AppendMethodMetadata("test2", "8")
    @PrependMethodMetadata("test3", "A")
    @PrependMethodMetadata("test3", "B")
    @PrependMethodMetadata("test3", "C")
    @PrependMethodMetadata("test3", "D")
    @PrependMethodMetadata("test3", "E")
    public testMethod2() {}
}

describe("Property metadata (constructor)", () => {
    it("Set / Get (constructor)", () => {
        assert.equal(getFieldMetadata(F, "testProp1", "test", ObjectType.CONSTRUCTOR), "lnb");
        assert.equal(getFieldMetadata(F, "testProp2", "test", ObjectType.CONSTRUCTOR), "zui");
        assert.equal(getFieldMetadata(F, "testProp2", "test1", ObjectType.CONSTRUCTOR), "1test");
        assert.deepStrictEqual(getFieldMetadata(F, "testProp2", "test2", ObjectType.CONSTRUCTOR), [
            "8", "4", "2", "1"
        ]);
        assert.deepStrictEqual(getFieldMetadata(F, "testProp2", "test3", ObjectType.CONSTRUCTOR), [
            "A", "B", "C", "D", "E"
        ]);
    });
});

describe("Method metadata (constructor)", () => {
    it("Set / Get (constructor)", () => {
        assert.equal(getFieldMetadata(F, "testMethod1", "test", ObjectType.CONSTRUCTOR), "lnb");
        assert.equal(getFieldMetadata(F, "testMethod2", "test", ObjectType.CONSTRUCTOR), "zui");
        assert.equal(getFieldMetadata(F, "testMethod2", "test1", ObjectType.CONSTRUCTOR), "1test");
        assert.deepStrictEqual(getFieldMetadata(F, "testMethod2", "test2", ObjectType.CONSTRUCTOR), [
            "8", "4", "2", "1"
        ]);
        assert.deepStrictEqual(getFieldMetadata(F, "testMethod2", "test3", ObjectType.CONSTRUCTOR), [
            "A", "B", "C", "D", "E"
        ]);
    });
});

class G {}

class GG {

    constructor(
        @MethodParameterMetadata("test", "asdf")
        param1: string,

        @PrependMethodParameterMetadata("test", 9)
        @AppendMethodParameterMetadata("test", 2)
        @AppendMethodParameterMetadata("test", "a")
        @AppendMethodParameterMetadata("test", "b")
        @AppendMethodParameterMetadata("test", 1)
        @AppendMethodParameterMetadata("test", 1)
        @AppendMethodParameterMetadata("test", 1)
        private param2: string
    ) {

    }

    public testMethod1(
        @MethodParameterMetadata("test", "jkloe")
        param1: string,

        @PrependMethodParameterMetadata("test", 4)
        @AppendMethodParameterMetadata("test", 5)
        @AppendMethodParameterMetadata("test", "f")
        @AppendMethodParameterMetadata("test", "t")
        @AppendMethodParameterMetadata("test", 7)
        @AppendMethodParameterMetadata("test", "u")
        @AppendMethodParameterMetadata("test", "g")
        @MethodParameterMetadata("test", [77])
        param2: string
    ) {
    }
}

describe("Constructor parameters (constructor)", () => {
    it("Get / Set / Append / Prepend", () => {
        assert.equal(getMethodParameterMetadata(GG, null, 0, "test", ObjectType.CONSTRUCTOR), "asdf");
        assert.deepStrictEqual(getMethodParameterMetadata(GG, null, 1, "test", ObjectType.CONSTRUCTOR), [
            9, 1, 1, 1, "b", "a", 2
        ]);
    });
});

describe("Method parameters (constructor)", () => {
    it("Get / Set / Append / Prepend", () => {
        assert.equal(getMethodParameterMetadata(GG, "testMethod1", 0, "test", ObjectType.CONSTRUCTOR), "jkloe");
        assert.deepStrictEqual(getMethodParameterMetadata(GG, "testMethod1", 1, "test", ObjectType.CONSTRUCTOR), [
            4, 77, "g", "u", 7, "t", "f", 5
        ]);
    });
});

@SetMetadata("testA", "lorem")
class H {
    @SetMetadata("testB", "ipsum")
    public property1;

    constructor(
        @SetMetadata("testC", "sit")
        private param1
    ) { }

    @SetMetadata("testD", "ahmed")
    public method1(
        @SetMetadata("testE", "dolor")
        param1
    ) {}
}

describe("SetMetadata", () => {
    it("works", () => {
        assert.equal(getClassMetadata(H, "testA", ObjectType.CONSTRUCTOR), "lorem");
        assert.equal(getFieldMetadata(H, "property1", "testB", ObjectType.CONSTRUCTOR), "ipsum");
        assert.equal(getMethodParameterMetadata(H, null, 0, "testC", ObjectType.CONSTRUCTOR), "sit");
        assert.equal(getFieldMetadata(H, "method1", "testD", ObjectType.CONSTRUCTOR), "ahmed");
        assert.equal(getMethodParameterMetadata(H, "method1", 0, "testE", ObjectType.CONSTRUCTOR), "dolor");
    });
});