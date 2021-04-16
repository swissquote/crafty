<table>
<tr><th>Compatible Runners</th><td>

- [Gulp](05_Packages/02_crafty-runner-gulp.md)
- [rollup.js](05_Packages/02_crafty-runner-rollup.md)
- [Webpack](05_Packages/02_crafty-runner-webpack.md)

</td></tr>
<tr><th>Test Runners</th><td>

- [Jest](05_Packages/05_crafty-preset-jest.md)

</td></tr>
</table>

[TOC]

## Description

**SWC** is the leading tool to compile EcmaScript 2015+ to EcmaScript 5, combined with **ESLint** to lint your code, you get the best preset to get started.

## Features

`@swissquote/crafty-preset-swc` is able to configure **SWC** with **Webpack** and **rollup.js**. This preset also supports **Gulp** but in this case it concatenates and minifies the files, it doesn't resolve imports.

[Read more](./JavaScript_Features.md)

## Linting

In `@swissquote/crafty-preset-swc` JavaScript is linted with **ESLint**, a powerful linter that supports plugins, our configuration follows the Swissquote JavaScript Guideline through our `@swissquote/crafty-preset-eslint` preset.

[Read more](../05_crafty-preset-eslint/JavaScript_Linting.md)

## Installation

```bash
npm install @swissquote/crafty-preset-swc --save
```

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-swc",
    "@swissquote/crafty-runner-webpack", // optional
    "@swissquote/crafty-runner-gulp" // optional
  ],
  js: {
    app: {
      runner: "webpack", // Webpack, Gulp or rollup.js (optional if you have a single runner defined)
      source: "js/app.js"
    }
  }
};
```

## Usage

### With Webpack / rollup.js

Both runners have the same features in regards to SWC support.
They will resolve your modules recursively and bundle them in one file or more if you do some code-splitting.

#### JavaScript External assets

By default, all bundlers include all external dependencies in the final bundle, this works fine for applications, but if you wish to build a multi-tenant application or a library, you don't wish to include all dependencies, because you'll end up with the same dependency duplicated.

The `externals` option allows you to define a list of libraries that are provided and should not be embedded in the build, here is an example :

```javascript
module.exports = {
    ...
    // patterns are strings or globs
    externals: ["react", "react-dom", "squp", "squp/**"],
    ...
    js: {
        app: {
            // You can provide more items here, they will be merged with the main list for this bundle
            externals: ["my-plugin", "my-plugin/**"]
            ...
        }
    }
    ...
}
```

In this example `react`, `react-dom` and all modules starting with `squp/` will be treated as external

> You can see that globs were used here, note that they work for Webpack but rollup.js needs complete strings.

### With Gulp

Gulp will not bundle your files like Webpack and rollup.js do, instead it will generate one output file per input file.
This is useful if you are creating a library as it's the role of the final application to tree-shake what it doesn't need from your library.

Tree-shaking is powerful but is sub-optimal on big files as some code patterns are recognized as side-effects and thus aren't removed from your bundle even if they aren't used.

## Usage with Jest

If you include both `crafty-preset-swc` and `crafty-preset-jest`.
When running your tests with `crafty test` this preset will be use to convert all `.js` and `.jsx` files (source and test files)

## Configuration

### Bundle options

| Option   | Type    | Optional ? | Runner | Description                                                                                                                     |
| -------- | ------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `concat` | Boolean | Yes        | Gulp   | This will merge all files together, outputting a single file. (This doesn't resolve imports, use Webpack or rollup.js for this) |

### Change SWC Configuration

You can add, change options to our default SWC configuration.

```javascript
module.exports = {
  /**
   * Represents the extension point for SWC configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} bundle - The bundle that is being prepared for build (name, input, source, destination)
   * @param {Object} swcConfig - The current SWC configuration
   */
  swc(crafty, bundle, swcConfig) {
    // Core configuration
    // Check the website for its documentation : https://swc.rs/docs/configuring-swc
  }
};
```

This method is called once per bundle, so you can customize each bundle's configuration differently.
