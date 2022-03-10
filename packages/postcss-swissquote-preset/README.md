# PostCSS Swissquote Preset

## Features

The features provided by this preset are mainly:

- Provide future CSS Syntax today
- Allow you to use some features from SCSS in your CSS
- No need to worry about vendor prefixes; this preset will add them for you.
- Advanced and fast minification

See details in [CSS Features](05_crafty-preset-postcss/CSS_Features.md).

## Presets

## Usage within Crafty

`@swissquote/crafty-preset-postcss` automatically configures this preset for you for Webpack and Gulp.

## Usage outside Crafty

```bash
npm install @swissquote/postcss-swissquote-preset --save
```

### `options`

```javascript
postcss([
  require("@swissquote/postcss-swissquote-preset")({
    config: {
      browsers: "ie 9, last 3 versions", // A Browserslist compatible browsers list
      environment: "production" // (optional) The current environment to compile to, will also use the `NODE_ENV` variable, or will fallback to "production"
    }
  })
]);
```
