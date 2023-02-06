## Description

Webpack is an asset bundler, its purpose is to compile your JavaScript code to
be the most efficient possible for production.

[TOC]

## Features

- Bundle your JavaScript using EcmaScript 2015 imports or commonjs imports
- Your code is Uglified after compilation.
- Configurable output formats
- Watch mode, re-compiles your files on changes
- Analyze your bundles with `--analyze` which will create a stats file next to the generated JavaScript
- Profile Webpack's execution time with `--analyze`

## Configuration

### Options

We don't provide any option to configure Webpack outside bundles, but as
`crafty.config.js` is considered as a preset, you can define the `webpack`
override method in your configuration file and change the configuration to your
needs.

Check the **Extending the configuration** section below for more information on
that.

### Bundle Options

| Option          | Type                | Optional ? | Runner              | Description                                                                                                                                      |
| --------------- | ------------------- | ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hot`           | Boolean             | Yes        | Webpack             | Allows to use Hot Module Replacement in watch mode (`false` by default)                                                                          |
| `libraryTarget` | String              | Yes        | Webpack             | Define the library type to export. By default we use `amd`. [Possible values](https://webpack.js.org/configuration/output/#output-librarytarget) |
| `library`       | String              | Yes        | Webpack             | Define the library name for the Webpack module or export.                                                                                        |
| `externals`     | Array&lt;String&gt; | Yes        | Webpack / rollup.js | Extends the list of provided libraries (Webpack understands both globs and strings, rollup.js doesn't understand globs)                          |

### Extending the configuration

Extending Webpack's configuration can be done in two different way, either with
a `webpack.config.js` file or with the `webpack` extension point

#### `webpack.config.js`

In this solution, you have to create a `webpack.config.js` file next to your
`package.json`.

This file should contain the configuration you wish to change, the rest being
already configured inside **Crafty** we will merge your custom settings.

This solution is a bit less powerful than the extension point: You can replace
configuration but you can't remove loaders and you can't change the loader's
configuration.

#### `webpack(crafty, bundle, chain)`

Each preset and `crafty.config.js` can define the `webpack(crafty, bundle, chain)` function to override rollup.js' configuration.

Webpack's configuration is built using
[`webpack-chain`](https://github.com/mozilla-neutrino/webpack-chain#getting-started)
which is a configuration builder.

```javascript
module.exports = {
  /**
   * Represents the extension point for Webpack configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} bundle - The bundle that is being prepared for build (name, input, source, destination)
   * @param {WebpackChain} chain - The current Webpack configuration using `webpack-chain`
   */
  webpack(crafty, bundle, chain) {
    // Change any value of the chain object

    // For example, adding supported extensions to the resolution
    chain.resolve.extensions.add(".ts").add(".tsx");
  }
};
```
