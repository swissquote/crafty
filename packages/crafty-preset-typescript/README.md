<table>
<tr><th>Compatible Runners</th><td>

- [rollup.js](05_Packages/02_crafty-runner-rollup.md)
- [Webpack](05_Packages/02_crafty-runner-webpack.md)

</td></tr>
<tr><th>Test Runners</th><td>

- [Jest](05_Packages/05_crafty-preset-jest.md)

</td></tr>
<tr><th>Linters</th><td>

Provides tslint, with a minimal configuration (should be extended in the future to match the one in stylelint)

</td></tr>
<tr><th>Commands</th><td>

- `tsLint`: Lint TypeScript files, this is a facade for TSLint, pre-configured
  with our preset.

</td></tr>
</table>

[TOC]

## Description

Microsoft presents TypeScript as "JavaScript that scales".
TypeScript is a superset of JavaScript that allows you to type your code.
Not everything needs to have a type as the tool is powerful enough to infer most of the types.

Not only TypeScript has types but it also supports the full EcmaScript 2015 Specification.

## Features

TypeScript being a superset of JavaScript, features supported by [our Babel preset](../05_crafty-preset-babel/JavaScript_Features.md) apply here.

Or you can check out the [TypeScript specific features](TypeScript_Features.md)

## Linting

Like any language, TypeScript has best practies and things that you shouldn't do.
With the help of `tslint` we check the code for common mistakes and formatting errors.

[Read more](TypeScript_Linting.md)

We currently don't provide a direct access to Tslint's CLI

## Installation

```bash
npm install @swissquote/crafty-preset-typescript --save
```

```javascript
module.exports = {
    presets: [
        "@swissquote/crafty-preset-typescript",
        "@swissquote/crafty-runner-webpack",   // optional
        "@swissquote/crafty-runner-rollup"     // optional
    ],
    js: {
        app: {
            runner: "webpack", // Webpack or rollup.js (optional if you have only one runner defined)
            source: "js/app.ts"
        }
    },
};
```

## Usage with Webpack / rollup.js

Both offer the same level of integration.

The only thing you need to configure is the `tsconfig.json` file that you put at the root of the project.

Some options can't be auto-configured through the loaders / plugins so that's why you have to do it yourself.
Moreover, the integration with your IDE is simplified if you have a complete `tsconfig.json` in your project.

## Usage with Jest

If you include both `crafty-preset-typescript` and `crafty-preset-jest`.
When running your tests with `crafty test` this preset will be use to convert all `.ts` and `.tsx` files (source and test files)

## Type definition files

TypeScript is also able to understand Types on libraries written in pure JavaScript this is done through types definition files.

Some packages come with their own definitions, for the others there are three ways to consume these files.

1. Use `@types` scoped packages from npm
1. Use the `typings` tool to download community managed typings
1. Create your own `*.d.ts` file

[Read more](TypeScript_Typings.md)

## Getting Started

We have a user guide to easily get started with TypeScript in your project

[Follow the guide](Getting_Started_with_TypeScript.md)

### `crafty tsLint`

This linter will leverage TSLint to lint your TypeScript files with the
Swissquote presets preinstalled. All
[TSLint CLI](https://palantir.github.io/tslint/usage/cli/) options are valid
here.

The additions made by this command are pre-configured rules from the Swissquote
Guidelines.

```bash
crafty tsLint src/**
```

If you pass the `--fix` flag it will fix all the errors it can and write them
directly to the source file.