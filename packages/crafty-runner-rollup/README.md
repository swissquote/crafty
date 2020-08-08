## Description

rollup.js is a module bundler for JavaScript which compiles small pieces of code
into something larger and more complex, such as a library or application.

rollup.js works well with libraries because it's able to output files with
EcmaScript 2015 exports which allow for advanced tree shaking.

> The rollup.js integration is experimental and has some issues that are known
> and some that are not pinpointed yet.

[TOC]

## Features

- Bundle your JavaScript using EcmaScript 2015 imports or commonjs imports
- Your code is Uglified after compilation.
- Configurable output formats
- Watch mode, re-compiles your files on changes

## Options

We don't provide any option to configure rollup.js outside bundles, but as
`crafty.config.js` is considered as a preset, you can define the `rollup`
override method in your configuration file and change the configuration to your
needs.

Check the **Extending the configuration** section below for more information on
that.

## Bundle Options

The rollup.js preset is compatible with our
[Babel](05_Packages/05_crafty-preset-babel.md) and
[TypeScript](05_Packages/05_crafty-preset-typescript.md)

| Option      | Type                | Optional ? | Description                                                                                                             |
| ----------- | ------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `format`    | String              | Yes        | Define the output format can be any of `amd`, `iife`, `cjs`, `es` or `umd`. Defaults to `es`.                           |
| `externals` | Array&lt;String&gt; | Yes        | Extends the list of provided libraries (Webpack understands both globs and strings, rollup.js doesn't understand globs) |

## Extending the configuration

Each preset and `crafty.config.js` can define the `rollup(crafty, bundle, rollupConfig)` function to override rollup.js' configuration.

```javascript
module.exports = {
  /**
   * Represents the extension point for rollup.js configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} bundle - The bundle that is being prepared for build (name, input, source, destination)
   * @param {Object} rollupConfig - The current rollup.js configuration (input, output, watch)
   */
  rollup(crafty, bundle, rollupConfig) {
    // Mutate any of rollupConfig.input, rollupConfig.output or rollupConfig.watch to your liking
  }
};
```

The full list of available configuration option is available
[on the official website](https://rollupjs.org/#javascript-api).

The difference with the official configuration is how plugins are handled. The
section below explains how plugins are configured.

### Adding / modifying plugins

In rollup.js, plugins are functions that are called with their options.

As we want to be able to override those options during the preparation phase of
the runner, those plugins are presented in the following way :

Here is an example of how the `rollup-plugin-eslint` is integrated into
rollup.js .

```javascript
const rollupEslint = require("rollup-plugin-eslint");

module.exports = {
  /**
   * Represents the extension point for rollup configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} bundle - The bundle that is being prepared for build (name, input, source, destination)
   * @param {string} rollupConfig - The current rollup configuration (input, output, watch)
   */
  rollup(crafty, bundle, rollupConfig) {
    // rollupConfig.input.plugins is an object during preparation phase with four possible keys :
    // - plugin : the function to initialize the plugin
    // - options : A configuration object, will be passed to the function as a first parameter upon initialization
    // - weight : (optional) The weight of the plugin, used to define the order in which the plugins are run (A weight of 0 is applied if this key is omitted)
    // - init : (optional) A function that Returns an instance of the plugin. The default is : `(plugin) => plugin.plugin(plugin.options)`

    rollupConfig.input.plugins.eslint = {
      plugin: rollupEslint,
      weight: -20,
      options: {
        ...crafty.config.eslint,
        throwOnError: crafty.getEnvironment() === "production",
        exclude: ["node_modules/**"],
        include: ["**/*.js", "**/*.jsx"]
      }
    };
  }
};
```

## Known issues

- If you have two bundles that run with rollup.js, if one fails, the second one
  stops as well.
- ESLint stops linting after the first file in error, this shouldn't be the
  case.
