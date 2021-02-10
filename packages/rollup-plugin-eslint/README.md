# @swissquote/rollup-plugin-eslint 

[Rollup](https://github.com/rollup/rollup) plugin to verify entry point and all imported files with ESLint.

> This plugin is a fork of [rollup-plugin-eslint](https://www.npmjs.com/package/@rollup/plugin-eslint) with one difference
> Linting is done on all files and a single report is printed at the end of 
> the run this allows to lint all files and not fail after the first one.

## Install

```sh
yarn add @swissquote/rollup-plugin-eslint --dev
```

## Usage

```js
import { rollup } from "rollup";
import eslint from "@swissquote/rollup-plugin-eslint";

export default {
  input: "main.js",
  plugins: [
    eslint({
      /* your options */
    })
  ]
};
```

## Options

See more options here [eslint-config](http://eslint.org/docs/developer-guide/nodejs-api#cliengine).

You can also use eslint configuration in the form of a `.eslintrc.*` file in your project's root. It will be loaded automatically.

### fix

Type: `boolean`  
Default: `false`

If true, will auto fix source code.

### throwOnError

Type: `boolean`  
Default: `false`

If true, will throw an error if any errors were found.

### throwOnWarning

Type: `boolean`  
Default: `false`

If true, will throw an error if any warnings were found.

### include

Type: `array` or `string`  
Default: `[]`

A single file, or array of files, to include when linting.

### exclude

Type: `array` or `string` or RegExp 
Default: `/node_modules/`

A single file, or array of files, to exclude when linting.

### formatter

Type: `function` or `string`  
Default: `stylish`

Custom error formatter or the name of a built-in formatter.

# License

MIT © [Bogdan Chadkin](mailto:trysound@yandex.ru)
