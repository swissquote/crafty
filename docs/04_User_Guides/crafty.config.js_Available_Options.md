[TOC]

## All Options

All the options in `crafty.config.js` apart from your bundles in the `js` and
`css` bundles are optional.

| Option                     | Default Value                    | Description                                                                                                          | Preset                                                 |
| -------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `browsers`                 | See below                        | The browser compatibility we wish in the compiled files. Read more below                                             | Core                                                   |
| `destination`              | See below                        | The destination at which to put all files                                                                            | Core                                                   |
| `destination_<bundleType>` | `destination + "/" + bundleType` | The destination for JavaScript/TypeScript files                                                                      | Core                                                   |
| `eslint`                   | Swissquote JavaScript Guideline  | This defines the rules for all JavaScript source files that go through the Gulp builder                              | `crafty-preset-babel`                                  |
| `externals`                | `[]`                             | What libraries are already provided in the final application, see below for more information                         | `crafty-runner-rollup` / `crafty-runner-webpack`       |
| `img_basedir`              | `"images"`                       | Where to take images from (Relative to current working directory)                                                    | `crafty-preset-images` / `crafty-preset-images-simple` |
| `img_extensions`           | `["png", "jpg", "jpeg", "gif"]`  | What extensions to compress (excludes svg)                                                                           | `crafty-preset-images`                                 |
| `legacy_css`               | `false`                          | When enabling this feature, the CSS will be linted for errors and formatting instead of the Swissquote CSS Guideline | `crafty-preset-postcss`                                |
| `mavenType`                | See below                        | Defines wether this application is a `webapp` or `webjar`.                                                           | `crafty-preset-maven`                                  |
| `stylelint`                | Swissquote CSS Guideline         | This defines the rules for all CSS source files, it contains the naming conventions                                  | `crafty-preset-postcss`                                |
| `stylelint_legacy`         | Swissquote CSS Guideline         | This defines the rules for all CSS source files, it contains the base formatting rules and best practices            | `crafty-preset-postcss`                                |
| `stylelint_pattern`        | See Below                        | Define the file types you want to target when linting CSS files.                                                     | `crafty-preset-postcss`                                |
| `terser`                   | See below                        | Configure the compression level of your JavaScript assets.                                                           | `crafty-preset-terser`                                 |

### `destination`

By default, your compiled assets will be in `dist/<bundleType>`. But you can
override the `config.destination` or `config.destination_<bundleType>` option.

You can also use the `crafty-preset-maven` with the `mavenType` option to move
your assets to Maven's `target` directory.

[More about `crafty-preset-maven`](05_Packages/05_crafty-preset-maven.md)

### `browser`: Browser compatibility

Default: `Edge >= 86, Safari >= 15, iOS >= 15, Chrome >= 86, and_chr >= 86, Firefox >= 81, > 1%, not dead, not op_mini all`

Depending on the target browsers, some optimization might be enabled or disabled
to create the smallest possible package for the browsers requirements we have.

This option is, for example, used by Autoprefixer to define which CSS Prefixes it
needs to add to the CSS file.

We created this list of browsers based on the statistics of browser usage
we have seen across all Swissquote Platforms.

If you want a different list, you can override those defaults using any valid [Browserslist query source](https://github.com/browserslist/browserslist#queries)

### `terser` : JavaScript compression

Default: `{ compress: true, sourceMap: true }`

By default, we compress our JavaScript with safe parameters. If you wish, you can
go further and enable more advanced compression techniques.

[Terser's documentation](https://github.com/terser/terser#minify-options) has all the details on its options.

### `stylelint_pattern`: Which files to lint

Default: `["css/**/*.scss", "css/**/*.css", "!*.min.css", "!**/vendor/**/*.scss", "!**/vendor/**/*.css", "!**/vendor/*.scss", "!**/vendor/*.css"]`

Define the file types you want to target when linting CSS files.

### `externals` to not bundle dependencies

By default, all bundlers include all external dependencies in the final bundle.

Including all dependencies works fine for applications, but if you wish to build a multi-tenant
application or a library, you might not want to include all dependencies because
you'll end up with the same dependency more than one time.

The `externals` option allows you to define a list of provided libraries and should not be embedded in the build. Here is an example :

```javascript
module.exports = {
    ...
    // patterns are strings or globs
    externals: ["react", "react-dom", "moment", "moment/**"],
    ...
    js: {
        app: {
            // You can provide more items here, they will be merged with the main list for this bundle
            externals: ["my-plugin", "my-plugin/**"]
            ...
        }
    }
    ...
}
```

In this example, `react`, `react-dom`, and all modules starting with `moment/` will
be treated as external

> This configuration example uses glob patterns.
> These patterns work fine for Webpack but are not supported by rollup.js.

## `js` and `css` Bundles

The two configuration objects inside `css` and `js` are what Crafty uses to create the build tasks when running `crafty run`.

A bundle is a set of one or more **source files** that a **runner** compiles to one or
more **destination files**.

From these three options, one is mandatory; `source`.

If we take this JavaScript bundle :

```javascript
{
  presets: [
      "@swissquote/crafty-runner-gulp",
      "@swissquote/crafty-preset-babel"
  ],
  js: {
    app: { // name of the bundle
      source: ['js/panel.js', 'js/nothing.js'],
      concat: true
    }
  }
}
```

This configuration will:

1. Use the `gulp/babel` runner implicitly, as no other runner is available.
1. Read `js/panel.js` and `js/nothing.js`.
1. Convert them using the Babel preset.
1. Concatenate both files together; That option is exclusive to the gulp runner.
1. Write the file to `<destination_js>/app.min.js`. Which is inferred from the bundle name because no destination was specified.

### Common Bundle options

| Option        | Type              | Optional ? | Description                                                                                                                   |
| ------------- | ----------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `source`      | `string|string[]` | No         | One single file or an array of files you wish to compile. Glob expressions are valid.                                         |
| `runner`      | `string`          | No         | The runner's name to use for this bundle. This option is mandatory if more than one runner is loaded                          |
| `destination` | `string`          | Yes        | The name to give to the final file. Defaults to `<bundle_name>.min.<bundle_type>`                                             |
| `watch`       | `string|string[]` | Yes        | The watch expression to use to rebuild this asset. Any glob expression is valid. Webpack and rollup.js don't use this option. |

### Runners

You can define which runner should run for which bundle. The different values are

| Runner Name       | Bundle Type | Required presets                                                          |
| ----------------- | ----------- | ------------------------------------------------------------------------- |
| `webpack`         | JavaScript  | `@swissquote/crafty-runner-webpack`                                       |
| `rollup`          | JavaScript  | `@swissquote/crafty-runner-rollup`                                        |
| `gulp/babel`      | JavaScript  | `@swissquote/crafty-runner-gulp` + `@swissquote/crafty-preset-babel`      |
| `gulp/typescript` | JavaScript  | `@swissquote/crafty-runner-gulp` + `@swissquote/crafty-preset-typescript` |
| `gulp/swc`        | JavaScript  | `@swissquote/crafty-runner-gulp` + `@swissquote/crafty-preset-babel`      |
| `gulp/postcss`    | CSS         | `@swissquote/crafty-runner-gulp` + `@swissquote/crafty-preset-postcss`    |

### CSS Bundles

```javascript
{
  presets: [
      "@swissquote/crafty-runner-gulp",
      "@swissquote/crafty-preset-postcss"
  ],
  css: {
    testIndex: {
        source: 'css/test/test.scss',
        destination: 'index.min.css',
        watch: 'css/test/**.scss'
    }
  }
}

```

`testIndex` is the bundle name; you will be able to call `crafty run css_testIndex` to
build it.

CSS bundling provides no particular option.
When bundling your CSS inside your JavaScript, you must set the configuration in the JavaScript bundle.

### JavaScript Bundles

```javascript
app: {
    source: ['js/panel.js', 'js/nothing.js'],
    destination: 'app.min.js'
}
```

`app` is the bundle name; you will be able to call `crafty run js_app` to build it.

Apart from the common options, here are the options you can use for JavaScript
bundles.

| Option          | Type                 | Runner              | Preset                                           | Description                                                                                                                                                                                                                                                                                                        |
| --------------- | -------------------- | ------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `format`        | `string`             | rollup.js           | `crafty-runner-rollup`                           | Define the output format can be any of `amd`, `iife`, `cjs`, `es` or `umd`. Defaults to `es`.                                                                                                                                                                                                                      |
| `externals`     | `string[]`           | rollup.js / Webpack | `crafty-runner-webpack` / `crafty-runner-rollup` | Extends the list of provided libraries (Webpack understands both globs and strings, rollup.js doesn't understand globs)                                                                                                                                                                                            |
| `hot`           | `bool`               | Webpack             | `crafty-runner-webpack`                          | Allows to use Hot Module Replacement in watch mode (`false` by default)                                                                                                                                                                                                                                            |
| `libraryTarget` | `string`             | Webpack             | `crafty-runner-webpack`                          | Define the library type to export. By default we use `amd`. [Possible values](https://webpack.js.org/configuration/output/#output-librarytarget)                                                                                                                                                                   |
| `library`       | `string`             | Webpack             | `crafty-runner-webpack`                          | Define the library name for the Webpack module or export.                                                                                                                                                                                                                                                          |
| `extractCSS`    | `bool|string|object` | Webpack             | `crafty-preset-postcss`                          | This will extract the CSS out of the bundle, all [Official options](https://github.com/webpack-contrib/mini-css-extract-plugin#configuration) work, you can also pass `true` which will use `[bundle]-[name].min.css` as file name, you can use `[bundle]` in the file name which is replaced by your bundle name. |
| `concat`        | `bool`               | Gulp                | `crafty-preset-babel`                            | This will merge all files together, outputting a single file. (This doesn't resolve imports, use Webpack or rollup.js for this)                                                                                                                                                                                    |
