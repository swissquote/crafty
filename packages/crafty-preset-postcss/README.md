<table>
<tr><th>Compatible Runners</th><td>

- [Gulp](05_Packages/02_crafty-runner-gulp.md)
- [Webpack](05_Packages/02_crafty-runner-webpack.md)

</td></tr>
</table>

[TOC]

## Description

The principle of CSS is easy to grasp, yet CSS is complicated to write at large scales.

We want to offer the best experience for writing CSS that is compatible with most browsers without the long configuration process.

## Features

**PostCSS** is a CSS parser that supports plugins, countless plugins are maintained by a big community, we use a handful of them.

[Features and examples](CSS_Features.md)

## Linting

**Stylelint** is a wonderful tool to lint CSS in according to your rules, we have a custom configuration preset for Stylelint that comes pre-configured.

Stylelint is provided automatically in this preset by also including [`crafty-preset-stylelint`](05_Packages/05_crafty-preset-stylelint/index.md).

## Installation

```bash
npm install @swissquote/crafty-preset-postcss --save
```

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-runner-webpack", // optional
    "@swissquote/crafty-runner-gulp" // optional
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

## Usage with Gulp

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-runner-gulp"
  ],
  css: {
    app: {
      runner: "gulp", // optional if you have a single runner defined
      source: "css/app.scss",
      watch: ["css/**"]
    }
  }
};
```

## Extending from your `crafty.config.js`

For this you need to add a `postcss` method to your `crafty.config.js`

```javascript
module.exports = {
  /**
   * Represents the extension point for Postcss configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {ProcessorMap} config - The list of plugins currently configured
   * @param {Object} bundle - The bundle that is being prepared for build (name, input, source, destination)
   */
  postcss(crafty, config, bundle) {
    // Add postcss-fixes
    // We recommend that for all plugins you add, you set a "before",
    // because otherwise they run as last plugins and some other plugins might miss some optimizations
    // For example if your plugin adds a `calc()` or a `var()` postcss-calc and postcss-custom-properties will already have run
    config.processor("postcss-fixes").before("autoprefixer");

    // Replace postcss-csso with cssnano,
    // - only enabled in production
    // - runs before postcss-reporter
    // - use cssnano's default preset
    config.delete("postcss-csso");
    config
      .processor("cssnano")
      .enableIf(options => crafty.getEnvironment() === "production")
      .before("postcss-reporter")
      .setOptions({
        preset: "default"
      });

    // Change autoprefixer's options to disable autoprefixing for flexbox
    const autoprefixerOptions = config.processor("autoprefixer").options;
    autoprefixerOptions.flexbox = false;

    // Override CSS custom properties in code
    const customProperties = config.processor("postcss-custom-properties")
      .options;
    customProperties.variables = {
      color: "#fa5b35"
    };
  }
};
```

[Read about the full API](./Postcss_Extension_API.md)


## Bundle Options

| Option       | Type                      | Optional ? | Runner  | Description                                                                                                                                                                                                                                                                                                        |
| ------------ | ------------------------- | ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `extractCSS` | Boolean / String / Object | Yes        | Webpack | This will extract the CSS out of the bundle, all [Official options](https://github.com/webpack-contrib/mini-css-extract-plugin#configuration) work, you can also pass `true` which will use `[bundle]-[name].min.css` as file name, you can use `[bundle]` in the file name which is replaced by your bundle name. |
