<table>
<tr><th>Compatible Runners</th><td>

- [Webpack](05_Packages/02_crafty-runner-webpack.md)

</td></tr>
<tr><th>Test Runners</th><td>

- [Jest](05_Packages/05_crafty-preset-jest.md)
- [Vitest](05_Packages/05_crafty-preset-vitest)

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

TypeScript has types but it also supports the ESNext Specification.

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
  ],
  js: {
    app: {
      runner: "webpack", // webpack (optional if you have a single runner defined)
      source: "js/app.ts",
    },
  },
};
```

## Usage with Webpack

You have to configure TypeScript with the `tsconfig.json` file that you put at the root of the project.

Some options can't be auto-configured through the loaders / plugins so that's why you have to do it yourself.
Moreover, the integration with your IDE is simplified if you have a complete `tsconfig.json` in your project.

## Usage with Jest and Vitest

If you include `crafty-preset-typescript` with either `crafty-preset-jest` or
`crafty-preset-vitest`, running `crafty test` will add support for `.ts`,
`.tsx`, `.mts`, and `.cts` source and test files.

When `crafty-preset-babel` is also active, TypeScript files keep using the
TypeScript and Vitest transform path while Babel remains limited to `.js` and
`.jsx` files.

### Type checking the tests

With Jest, `ts-jest` reports the type errors of each file that it compiles, so
a type error fails `crafty test`.

Vitest removes the types without a check. To check the tests, add a
`tsconfig.test.json` to your project. Crafty looks for it as it looks for
`tsconfig.json`: in the current folder, then in its parents. When the file
exists, Crafty turns on the `typecheck` option of Vitest. Then `crafty test`
runs `tsc` with that configuration. If a test has a type error, the run fails
even when the test passes at runtime.

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "types": ["vitest/globals"]
  },
  "include": ["src"]
}
```

The file must include the test files. Its `types` must declare the Vitest
globals (`describe`, `test`, `expect`), because `crafty-preset-vitest` turns
the globals on. To change the check or to turn it off, edit
`options.test.typecheck` in the `vitest` hook of your `crafty.config.js`. It
runs after the hook of this preset:

```js
module.exports = {
  vitest(crafty, options) {
    options.test.typecheck.enabled = false;
  },
};
```

Know these effects of the check:

- `tsc` checks every file that `tsconfig.test.json` includes, not only the
  tests. A type error in a source file also fails the run.
- Vitest runs each test file twice: once as a test and once as a type check.
  The second run shows as `TS` in the output, and counts as a second test in
  the summary and in the Sonar report.

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
