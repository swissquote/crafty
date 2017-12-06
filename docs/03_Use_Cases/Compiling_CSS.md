[TOC]

To compile CSS we leverage PostCSS and a selection of plugins, the final result
is a syntax that is almost Sass (SCSS style) with imports, nested styles,
variables and more.

## Compiling your CSS on its own ( Gulp )

The easiest way to get started is to use Gulp to generate your final CSS bundle

### Installing the preset with Gulp

```bash
cd src/main/frontend
npm install @swissquote/crafty @swissquote/crafty-preset-postcss @swissquote/crafty-runner-gulp --save
```

In your `crafty.config.js` file, you must add the following presets and create a
bundle.

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-runner-gulp"
  ],
  css: {
    app: {
      runner: "gulp",
      source: "css/style.scss"
    }
  }
};
```

You are now ready to run `crafty run` and compile your CSS source files with
PostCSS and Gulp.

Read more about [`crafty-preset-postcss`](05_Packages/05_crafty-preset-postcss).

## Importing your CSS in Webpack

The other way `crafty-preset-postcss` works is by adding PostCSS as a loader to
Webpack. Allowing you to use `import` from EcmaScript 2015 for your CSS.

### Installing the preset with Webpack

```bash
cd src/main/frontend
npm install @swissquote/crafty @swissquote/crafty-preset-postcss @swissquote/crafty-runner-gulp --save
```

In your `crafty.config.js` file, you must add the following presets.

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-runner-webpack"
  ],
  js: {
    app: {
      source: "js/index.js",
      extractCSS: true
    }
  }
};
```

> The `extractCSS` option will extract the generated CSS from the JavaScript
> bundle and into its own CSS file.

You can use this preset with one of our presets to TypeScript or JavaScript.

You are now ready to run `crafty run` and compile your CSS source files with
PostCSS and Webpack.

Read more about [`crafty-preset-postcss`](05_Packages/05_crafty-preset-postcss).

## Features

We use more than 30 plugins for our PostCSS preset, including nesting,
variables, imports, future CSS features and more.

See details in
[CSS Features](05_Packages/05_crafty-preset-postcss/CSS_Features.md).
