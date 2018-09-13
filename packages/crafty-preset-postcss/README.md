<table>
<tr><th>Compatible Runners</th><td>

- [Gulp](05_Packages/02_crafty-runner-gulp.md)
- [Webpack](05_Packages/02_crafty-runner-webpack.md)

</td></tr>
<tr><th>Linters</th><td>

Provides stylelint, configured with [`stylelint-config-swissquote`](05_Packages/10_stylelint-config-swissquote.md)

</td></tr>
<tr><th>Commands</th><td>

- `cssLint`: Lint CSS files, this is a facade for Stylelint, pre-configured with our preset.

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

[Read more about it here](CSS_Linting.md)

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

By default, the CSS will be embedded in your bundle, but you can provide the `extractCSS` option to extract your styles using the `ExtractTextWebpackPlugin`.

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
   */
  postcss(crafty, config) {
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

## Commands

### `crafty cssLint`

This command will lint CSS files using Stylelint's CLI too, you can get it's documentation [here](https://stylelint.io/user-guide/cli/).

The additions made by this command are:

- Pre-configured rules, defined by [`stylelint-config-swissquote`](05_Packages/10_stylelint-config-swissquote.md) activated using `--preset`.
- Set the syntax to `scss`.

there are 3 presets available for you :

- `recommended`: Contains all BEM specific rules.
- `legacy`: Contains rules specific to legacy code.
- `common`: Enforces the styleguide of the CSS. (included in both `recommended` and `legacy`)

Setting presets is done with the `--preset` option

The order of the presets is important as some rules might override previous ones.

It can be used the following way:

```bash
crafty cssLint css/**/*.scss --preset recommended
```

If no preset is specified `recommended` is used.

## Bundle Options

| Option       | Type                      | Optional ? | Runner  | Description                                                                                                                                                                                                                                                                                                        |
| ------------ | ------------------------- | ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `extractCSS` | Boolean / String / Object | Yes        | Webpack | This will extract the CSS out of the bundle, all [Official options](https://github.com/webpack-contrib/mini-css-extract-plugin#configuration) work, you can also pass `true` which will use `[bundle]-[name].min.css` as file name, you can use `[bundle]` in the file name which is replaced by your bundle name. |

### Linting options

You can read about the linting options in the page about [CSS Linting](CSS_Linting.md)
