<table>
<tr><th>Commands</th><td>

- `jsLint`: Lint JavaScript files, this is a facade for ESLint, pre-configured with our preset.

</td></tr>
</table>

[TOC]

## Description

**ESLint** is the leading tool to lint JavaScript and, using plugins, to lint many flavors of it like TypeScript.

## Linting

This preset comes with the Swissquote JavaScript Guideline.

[Read more](./JavaScript_Linting.md)

## Installation

`crafty-prest-eslint` comes automatically with `@swissquote/crafty-preset-babel` so install this only if you only need the linter without the bundler.

```bash
npm install @swissquote/crafty-preset-eslint --save
```

```javascript
module.exports = {
  presets: ["@swissquote/crafty-preset-eslint"]
};
```

## Configuration

### Linting options

You can read about the linting options in the page about [Read more](./JavaScript_Linting.md)

## Commands

### `crafty jsLint`

This linter will leverage ESLint to lint your JavaScript files with the Swissquote presets pre-configured. All [ESLint CLI](https://eslint.org/docs/user-guide/command-line-interface) options are valid here.

The additions made by this command are:

- Pre-configured rules, defined by [`eslint-plugin-swissquote`](05_Packages/10_eslint-plugin-swissquote.md) activated using `--preset`.
- Uses `@babel/eslint-parser` as a parser to support new syntax that ESLint doesn't understand yet.

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
