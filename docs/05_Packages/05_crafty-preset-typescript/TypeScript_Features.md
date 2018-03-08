[TOC]

## Language features

TypeScript is a superset of EcmaScript 2015, in this section we will cover what is added on top of it.
For EcmaScript 2015 features, you can check out our [Babel preset's features](../05_crafty-preset-babel/JavaScript_Features.md).

### Interfaces

A useful feature for types is interfaces, unlike other strongly typed languages, interfaces can contain fields and optional fields.

This allows you to create on-the-fly type definitions without creating an actual class in the output JavaScript.

```typescript
interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

var user = { firstName: "Jane", lastName: "User" };

document.body.innerHTML = greeter(user);
```

### Union types

Due to the nature of JavaScript, your code can receive parameters that are sometimes a string and sometimes an object.

Union types come to the rescue :

```typescript
type Shape = Square | Rectangle | Circle;

function area(s: Shape) {}
```

You can also use it to define strict values, more precise than `string` :

```typescript
function direction(k: "left" | "right") {
  // The value of k is "left" or "right"
}
```

## Other

* `readonly` properties in interfaces and classes
* Generic Types
* JSX Support (with the `.tsx` extension)
* Decorators
* Type Aliases (`type PrimitiveArray = Array<string|number|boolean>;`)

[Read more](http://www.typescriptlang.org/docs/tutorial.html)

## IDE Integration

TypeScript being out for years now, it has first class support in IDE's like IntelliJ, Visual Studio Code and others.

The IDE directly understands types and type definition files and is able to propose auto completion and refactoring out of the box.
