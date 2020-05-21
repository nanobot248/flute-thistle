# @flute/annotations

## Summary

`@flute/annotations` provides decorators and methods for adding/retrieving
metadata, annotations and tags:

  * **Metadata:** Metadata is arbitrary data attached and retrieved to/from an
    object with a metadata key. This is equivalent to (and implemented via)
    `Reflect.setMetadata(...)` and `Reflect.getMetadata(...)`.
  * **Annotations:** Annotations are a list of arbitrary objects, stored on
    a class, property, method or method parameter via the metadata methods.
    Annotations are stored in order of appearance, not order of execution.
  * **Tags:** Tags are like annotations with the difference that the are
    stored in a set. Therefore, no duplicate tags are allowed for a given
    class, property, method or method parameter and there is no guaranteed
    order of tags.

All data is stored in the metadata of the
**constructor**. When requesting metadata from objects, the data is also
loaded from its constructor.

## Installation

To use the package inside your application:

```
npm install --save @flute/annotations
```

Make sure the following settings are enabled in your project's `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Additionally, an implementation of `Reflect.getMetadata(...)` and `Reflect.setMetadata(...)` 
is needed, e.g. install `reflect-metadata`:

```
npm install --save reflect-metadata
```

Import `reflect-metadata` in your main module:
```typescript
// inside your main module
// ...
import 'reflect-metadata';
// ...
```

## Usage

This documentation is not complete yet. Please see the [tests](src/test/) and the 
[source code](src/main/) for more information and for the full method signatures.
Generated `typedoc` documentation is available [here](docs/generated/index.hml):
  
  * [Metadata](docs/generated/modules/_metadata_.html)
  * [Annotation](docs/generated/modules/_annotations_.html)
  * [Tag](docs/generated/modules/_tag_.html)

### Metadata

Metadata can be set via the `*Metadata` decorators:

  * `ClassMethadata`, `PropertyMetadata`, `MethodMetadata` and `MethodParameterMetadata`,
    `SetMetadata`:
    Adds or replaces the metadata with the provided key on the corresponding object (class, 
    property, method or method-parameter). There is also a generic `FieldMetadata` decorator
    that can be used on properties and methods.
    `SetMetadata` is a generic version of the other decorators that can be applied to classes,
    properties, methods and method parameters.
  * `AppendClassMethadata`, `AppendPropertyMetadata`, `AppendMethodMetadata` and `AppendMethodParameterMetadata`,
    `PrependClassMethadata`, `PrependPropertyMetadata`, `PrependMethodMetadata` and `PrependMethodParameterMetadata`:
    Assumes the metadata for the given key is an array (initializes it if necessary) and
    add the data to the end (append) or the start (prepen) of the array.
  * `PutClassMethadata`, `PutPropertyMetadata`, `PutMethodMetadata` and `PutMethodParameterMetadata`:
    Assumes the metadata for the given key is a `Set` (initializes it if necessary) and
    adds the data to the set.

Metadata can be retrieved via the corresponding `get*Metadata` methods.

All methods and decorators support a parameter `objectType` telling whether the object provided
is the constructor itself (e.g. when using the decorator methods as decorators) or an instance
of the class.

### Annotations

Annotations are stored in a list. New annotations are prepended via `Prepend*Metadata`,
therefore the sort order of annotations is the reverse of the execution order of the
decorators, meaning the annotation list will be `["1", "2", "3"]` for the following code:

```typescript
@ClassAnnotation("1")
@ClassAnnotation("2")
@ClassAnnotation("3")
class A {
}
```

Available decorators are `AnnotateClass`, `AnnotateProperty`, `AnnotateMethod`, `AnnotateMethodParameter`
and the generic version `Annotate`.

### Tags

Tags are stored in a set. Therefore, each tag can only appear once on an a given class, property,
method or method parameter and there is no guaranteed order of tags.

## License

MIT License

Copyright (c) 2020 Andreas Hubert

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.