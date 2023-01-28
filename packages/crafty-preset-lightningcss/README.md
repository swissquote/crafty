<table>
<tr><th>Compatible Runners</th><td>

- [Webpack](05_Packages/02_crafty-runner-webpack.md)

</td></tr>
</table>

[TOC]

## Description

The principle of CSS is easy to grasp, yet CSS is complicated to write at large scales.

We want to offer the best experience for writing CSS that is compatible with most browsers without the long configuration process.

## Features

**LightningCSS** is a CSS Processor that will take your CSS, and make it compatible with the largest number of browers. Write tomorrow's CSS today.

## Linting

**Stylelint** is a wonderful tool to lint CSS in according to your rules, we have a custom configuration preset for Stylelint that comes pre-configured.

Stylelint is provided automatically in this preset by also including [`crafty-preset-stylelint`](05_Packages/05_crafty-preset-stylelint/index.md).

## Installation

```bash
npm install @swissquote/crafty-preset-lightningcss --save
```

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-lightningcss",
    "@swissquote/crafty-runner-webpack"
  ]
};
```

## Usage with Webpack

Webpack defines the right loaders to support CSS.

To use it, add `import "myfile.scss"` in your Webpack imported file.

### Hot Module Replacement

When setting `hot: true` in your `crafty.config.js` for your main JavaScript bundle, you can enable Hot Module Replacement.

With this, the CSS files imported in your Webpack bundles are automatically reloaded upon changes.

This is used inside `crafty watch`, the build mode will not take it into account.

### Extracting CSS

By default, the CSS will be embedded in your bundle, but you can provide the `extractCSS` option to extract your styles using the `MiniCssExtractPlugin`.

#### Side effects

Be careful when using `extractCSS` option and `sideEffects: false` in `package.json` of your project. Crafty is using `css-loader` and when you import a CSS file in your project, it needs to be added to the side effect list so it will not be unintentionally dropped in production mode.

[Webpack docs and examples](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free)

## Bundle Options

| Option       | Type                      | Optional ? | Runner  | Description                                                                                                                                                                                                                                                                                                        |
| ------------ | ------------------------- | ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `extractCSS` | Boolean / String / Object | Yes        | Webpack | This will extract the CSS out of the bundle, all [Official options](https://github.com/webpack-contrib/mini-css-extract-plugin#configuration) work, you can also pass `true` which will use `[bundle]-[name].min.css` as file name, you can use `[bundle]` in the file name which is replaced by your bundle name. |
