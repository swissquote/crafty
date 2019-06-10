<table>
<tr><th>Compatible Runners</th><td>

- [rollup.js](05_Packages/02_crafty-runner-rollup.md)
- [Webpack](05_Packages/02_crafty-runner-webpack.md)

</td></tr>
<tr><th>Test Runners</th><td>

- [Jest](05_Packages/05_crafty-preset-jest.md)

</td></tr>
<tr><th>Linters</th><td>

Provides ESLint, with full configuration for TypeScript. Based on the same configuration we use in JavaScript.

</td></tr>
</table>

[TOC]

## Description

Microsoft presents TypeScript as "JavaScript that scales".
TypeScript is a superset of JavaScript that allows you to type your code.
Not everything needs to have a type as the tool is powerful enough to infer most of the types.

TypeScript has types but it also supports the full EcmaScript 2015 Specification.

## Features

TypeScript being a superset of JavaScript, features supported by [our Babel preset](../05_crafty-preset-babel/JavaScript_Features.md) apply here.

Or you can check out the [TypeScript specific features](TypeScript_Features.md)

## Linting

Like any language, TypeScript has best practices and practices that you shouldn't do.
With the help of ESLint we check the code for common mistakes and formatting errors.

[Read more](../05_crafty-preset-eslint/TypeScript_Linting.md)

## Installation

```bash
npm install @swissquote/crafty-preset-typescript --save
```

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-typescript",
    "@swissquote/crafty-runner-webpack", // optional
    "@swissquote/crafty-runner-rollup" // optional
  ],
  js: {
    app: {
      runner: "webpack", // Webpack or rollup.js (optional if you have a single runner defined)
      source: "js/app.ts"
    }
  }
};
```

## Usage with Webpack / rollup.js

Both offer the same level of integration.

You have to configure TypeScript with the `tsconfig.json` file that you put at the root of the project.

Some options can't be auto-configured through the loaders / plugins so that's why you have to do it yourself.
Moreover, the integration with your IDE is simplified if you have a complete `tsconfig.json` in your project.

## Usage with Jest

If you include both `crafty-preset-typescript` and `crafty-preset-jest`.
When running your tests with `crafty test` this preset will be use to convert all `.ts` and `.tsx` files (source and test files)

## Type definition files

TypeScript is also able to understand Types on libraries written in pure JavaScript this is done through types definition files.

Some packages come with their own definitions, for the others there are two ways to consume these files.

1.  Use `@types` scoped packages from NPM
1.  Create your own `*.d.ts` file

[Read more](TypeScript_Typings.md)

## Getting Started

We have a user guide to get started with TypeScript in your project

[Follow the guide](Getting_Started_with_TypeScript.md)

### `crafty jsLint`

Leveraging ESLint, we add configuration to lint TypeScript.
You can use that using the same command as for JavaScript.

```bash
crafty jsLint src/**
```

If you pass the `--fix` flag it will fix all the errors it can and write them
directly to the source file.
