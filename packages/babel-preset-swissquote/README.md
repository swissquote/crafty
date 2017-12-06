# Swissquote Preset for Babel

This package includes the Babel preset used by Crafty.

This preset will do the following for you:

* Transform EcmaScript 2015+ back to EcmaScript 5, according to the list of
  browsers you support. (`babel-preset-env`)
* Handle non-standard class properties
  (`babel-plugin-transform-class-properties`)
* Support Object rest and spread (`babel-plugin-transform-object-rest-spread`)
* [prod/dev] Transpile generators (`babel-plugin-transform-regenerator`)
* Polyfills the runtime needed for `async`/`await` and generators
  (`babel-plugin-transform-runtime`)
* Convert JSX to JavaScript (`babel-preset-react`)
* [test/dev] Add debug information to JSX
  (`babel-plugin-transform-react-jsx-self`,
  `babel-plugin-transform-react-jsx-source`)
* Support Dynamic imports (`babel-plugin-syntax-dynamic-import`) or convert them
  to a deferred require in tests (`babel-plugin-dynamic-import-node`)

## Options

| Option        | Default                                         | Effect                                                                          |
| ------------- | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| `environment` | `process.env.BABEL_ENV || process.env.NODE_ENV` | Overrides the environment, must be one of `development`, `test` or `production` |
| `browsers`    | `babel-preset-env`'s default + IE9              | Sets the list of browsers to support, must be a valid Browserslist query        |

## Usage in Crafty

The easiest way to use this configuration is with Crafty, which includes it by
default. **You don’t need to install it separately in Crafty projects.**

## Usage Outside of Crafty

If you want to use this Babel preset in a project not built with Create React
App, you can install it with following steps.

First, [install Babel](https://babeljs.io/docs/setup/).

Then create a file named `.babelrc` with following contents in the root folder
of your project:

```json
{
  "presets": ["@swissquote/swissquote"]
}
```
