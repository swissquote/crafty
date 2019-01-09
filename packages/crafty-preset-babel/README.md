<table>
<tr><th>Compatible Runners</th><td>

- [Gulp](05_Packages/02_crafty-runner-gulp.md)
- [rollup.js](05_Packages/02_crafty-runner-rollup.md)
- [Webpack](05_Packages/02_crafty-runner-webpack.md)

</td></tr>
<tr><th>Test Runners</th><td>

- [Jest](05_Packages/05_crafty-preset-jest.md)

</td></tr>
<tr><th>Linters</th><td>

Provides ESLint, configured with [`eslint-plugin-swissquote`](05_Packages/10_eslint-plugin-swissquote.md)

</td></tr>
<tr><th>Commands</th><td>

- `jsLint`: Lint JavaScript files, this is a facade for ESLint, pre-configured with our preset.

</td></tr>
</table>

[TOC]

## Description

**Babel** is the leading tool to compile EcmaScript 2015+ to EcmaScript 5, combined with **ESLint** to lint your code, you get the best preset to get started.

## Features

`@swissquote/crafty-preset-babel` is able to configure **Babel** with **Webpack** and **rollup.js**. This preset also supports **Gulp** but in this case it concatenates and minifies the files, it doesn't resolve imports.

[Our Babel preset](05_Packages/10_babel-preset-swissquote.md)

[Read more](./JavaScript_Features.md)

## Linting

In `@swissquote/crafty-preset-babel` JavaScript is linted with **ESLint**, a powerful linter that supports plugins, our configuration follows the Swissquote JavaScript Guideline.

[Read more](./JavaScript_Linting.md)

## Installation

```bash
npm install @swissquote/crafty-preset-babel --save
```

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-babel",
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

Both runners have the same features in regards to Babel support.
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

If you include both `crafty-preset-babel` and `crafty-preset-jest`.
When running your tests with `crafty test` this preset will be use to convert all `.js` and `.jsx` files (source and test files)

## Configuration

### Bundle options

| Option   | Type    | Optional ? | Runner | Description                                                                                                                     |
| -------- | ------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `concat` | Boolean | Yes        | Gulp   | This will merge all files together, outputting a single file. (This doesn't resolve imports, use Webpack or rollup.js for this) |

### Adding Babel plugins and presets

You can add, replace or remove plugins and add options to our default Babel configuration.
To see which plugins are already included, you can go to the [Swissquote Preset for Babel](05_Packages/10_babel-preset-swissquote.md) page.

```javascript
module.exports = {
  /**
   * Represents the extension point for Babel configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} bundle - The bundle that is being prepared for build (name, input, source, destination)
   * @param {Object} babelConfig - The current Babel configuration
   */
  babel(crafty, bundle, babelConfig) {
    babelConfig.plugins.push(require.resolve("@babel/plugin-transform-property-literals"));
  }
};
```

After you did `npm install --save-dev babel-plugin-transform-es5-property-mutators` before, Babel will now use this plugin as well in each run.

This method is called once per bundle, so you can customize each bundle's configuration differently.

### Linting options

You can read about the linting options in the page about [Read more](./JavaScript_Linting.md)

## Commands

### `crafty jsLint`

This linter will leverage ESLint to lint your JavaScript files with the Swissquote presets pre-configured. All [ESLint CLI](https://eslint.org/docs/user-guide/command-line-interface) options are valid here.

The additions made by this command are:

- Pre-configured rules, defined by [`eslint-plugin-swissquote`](05_Packages/10_eslint-plugin-swissquote.md) activated using `--preset`.
- Uses `babel-eslint` as a parser to support new syntax that ESLint doesn't understand yet.

there are 4 presets available for you :

- `format` Base formatting rules, should work on any code (included in `legacy` and `recommended`)
- `node` Adds environment information for Node.js
- `legacy` For all your EcmaScript 5 code
- `recommended` For al your EcmaScript 2015+ code, also contains rules for React

Setting presets is done with the `--preset` option

The order of the presets is important as some rules might override previous ones.

For example:

```bash
crafty jsLint src/** --preset format --preset node --preset recommended
```

If no preset is specified `recommended` is used.

If you pass the `--fix` flag it will fix all the errors it can and write them directly to the file.
