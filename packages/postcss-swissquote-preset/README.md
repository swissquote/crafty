# PostCSS Swissquote Preset

## Features

* **Organization**
  * Nested Styles (`postcss-nesting`, `postcss-nested`, `postcss-atroot`)
  * Import CSS Files (`postcss-import`, `postcss-url`)
  * Mixins (`postcss-mixins`)
  * Comments (`postcss-scss`)
* **Variables**
  * Variables (`postcss-advanced-variables`, `postcss-custom-properties`)
  * Property Lookup (`postcss-property-lookup`)
* **Images**
  * Images in CSS (`postcss-assets`)
* **Dynamic Styles**
  * Math in your CSS (`postcss-calc`)
  * Conditionals (`postcss-advanced-variables`)
  * Loops (`postcss-advanced-variables`)
  * Initial Values (`postcss-initial`)
  * Colors (`postcss-color-function`, `postcss-color-gray`,
    `postcss-color-hex-alpha`, `postcss-color-hwb`,
    `postcss-color-rebeccapurple`, `postcss-color-rgba-fallback`)
* **Syntax simplification**
  * Selectors (`postcss-selector-matches`, `postcss-selector-not`,
    `postcss-pseudo-class-any-link`, `postcss-custom-selectors`)
  * Media Queries (`postcss-custom-media`, `postcss-media-minmax`)
* **Fallbacks**
  * Vendor Prefixes (`autoprefixer`)
  * Browser support (`postcss-pseudoelements`, `postcss-replace-overflow-wrap`,
    `postcss-filter-gradient`, `postcss-font-variant`)

See details in [CSS Features](05_crafty-preset-postcss/CSS_Features.md).

## Presets

## Usage within Crafty

This preset is included in the styles preset, you don't need to include anything
specific

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
