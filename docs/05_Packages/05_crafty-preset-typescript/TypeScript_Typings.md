There are two ways to get Type Definition files ( also known as Typings ) in your project

[TOC]

## 1. Use `@types` scoped packages from NPM

Starting with TypeScript 2, Typings can automatically be loaded from NPM packages.

So if for example you use `lodash`, you can install `npm install @types/lodash` and the types are loaded automatically.
The definition files that are in these packages are loaded form the same place as

> I did a few tests, it seems that type definitions are found if you do
> `import _ from 'lodash';` but not if you do `import _add from 'lodash/add';`.
>
> It seems only packages with nothing after the package name are taken in account.

## 2. Create your own `*.d.ts` file

You can create your own definition files using the [Official documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).
