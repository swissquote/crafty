## Description

Rspack is an asset bundler, its purpose is to compile your JavaScript code to
be the most efficient possible for production.

[TOC]

## Features

- Bundle your JavaScript using EcmaScript 2015 imports or commonjs imports
- Your code is Uglified after compilation.
- Configurable output formats
- Watch mode, re-compiles your files on changes
- Analyze your bundles with `--analyze` which will create a stats file next to the generated JavaScript
- Profile Rspack's execution time with `--analyze`

## Configuration

### Options

We don't provide any option to configure Rspack outside bundles, but as
`crafty.config.js` is considered as a preset, you can define the `rspack`
override method in your configuration file and change the configuration to your
needs.

Check the **Extending the configuration** section below for more information on
that.

### Bundle Options

| Option          | Type                | Optional ? | Runner  | Description                                                                                                                                      |
| --------------- | ------------------- | ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hot`           | Boolean             | Yes        | Webpack | Allows to use Hot Module Replacement in watch mode (`false` by default)                                                                          |
| `libraryTarget` | String              | Yes        | Webpack | Define the library type to export. By default we use `amd`. [Possible values](https://webpack.js.org/configuration/output/#output-librarytarget) |
| `library`       | String              | Yes        | Webpack | Define the library name for the Webpack module or export.                                                                                        |
| `externals`     | Array&lt;String&gt; | Yes        | Webpack | Extends the list of provided libraries (Webpack understands both globs and strings)                                                              |

### Extending the configuration

Extending Rspack's configuration can be done in two different way, either with
a `rspack.config.js` file or with the `rspack` extension point

#### `rspack.config.js`

In this solution, you have to create a `rspack.config.js` file next to your
`package.json`.

This file should contain the configuration you wish to change, the rest being
already configured inside **Crafty** we will merge your custom settings.

This solution is a bit less powerful than the extension point: You can replace
configuration but you can't remove loaders and you can't change the loader's
configuration.

#### `rspack(crafty, bundle, chain)`

Each preset and `crafty.config.js` can define the `rspack(crafty, bundle, chain)` function to override Rspack configuration.

Rspack's configuration is built using
[`rspack-chain`](https://www.npmjs.com/package/rspack-chain)
which is a configuration builder.

```javascript
module.exports = {
  /**
   * Represents the extension point for Rspack configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} bundle - The bundle that is being prepared for build (name, input, source, destination)
   * @param {RspackChain} chain - The current Rspack configuration using `rspack-chain`
   */
  rspack(crafty, bundle, chain) {
    // Change any value of the chain object

    // For example, adding supported extensions to the resolution
    chain.resolve.extensions.add(".ts").add(".tsx").add(".mts").add(".cts");

    // For example to add a reverse proxy
    chain.devServer.set("middleware", (app, builtins) => {
      app.use(builtins.proxy("/hey", { target: "https://google.com" }));
    });
  },
};
```
