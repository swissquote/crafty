There are two ways to get Type Definition files ( also known as Typings ) in your project

[TOC]

## 1. Use `@types` scoped packages from NPM

Starting with TypeScript 2, Typings can automatically be loaded from NPM packages.

If for example you use `lodash`, you can install `npm install @types/lodash` and the types are loaded automatically.
The definition files that are in these packages are loaded form the same place as

> I did some tests, it looks like type definitions are found if you do
> `import _ from 'lodash';` but not if you do `import _add from 'lodash/add';`.
>
> It seems packages with nothing after the package name are taken in account but nothing else.

## 2. Create your own `*.d.ts` file

You can create your own definition files using the [Official documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).
