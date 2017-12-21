There are three ways to get Definition files (or Typings) in your project

[TOC]

## 1. Use `@types` scoped packages from npm

Starting with TypeScript 2, Typings can automatically be loaded from NPM packages.

So if for example you use `lodash`, you can install `npm install @types/lodash` and the types are loaded automatically.
The definition files that are in these packages are loaded form the same place as

> I did a few tests, it seems that type definitions are found if you do
> `import _ from 'lodash';` but not if you do `import _add from 'lodash/add';`.
>
> It seems only packages with nothing after the package name are taken in account.

## 2. Use the `typings` tool to download community managed typings

`typings` is a command line tool that allows you to download and install type definitions for TypeScript.

For example `node_modules/.bin/typings install debug --save`

This will create a `typings.json` file next to your `package.json`, containing the list of loaded definitions, and a `typings` directory containing the actual definitions.

The `typings/index.d.ts` has then to be loaded in your project using the "files" property in your `tsconfig.json`.

[More commands](https://github.com/typings/typings/blob/master/docs/commands.md)

> **Be careful**
> These typings are taken directly from internet and can't be mirrored.
> If you have a build server that doesn't have access to the internet, you should commit the definition files with your project.

## 3. Create your own `*.d.ts` file

You can create your own definition files using the [Official documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).
