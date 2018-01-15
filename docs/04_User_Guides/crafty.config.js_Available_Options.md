[TOC]

## All Options

All the options in `crafty.config.js` apart from your bundles in the `js` and
`css` bundles are optional.

| Option                     | Default Value                    | Description                                                                                                          | Preset                                                                   |
| -------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `browsers`                 | See below                        | The browser compatibility we wish in the compiled files. Read more below                                             | Core                                                                     |
| `destination`              | See below                        | The destination at which to put all files                                                                            | Core                                                                     |
| `destination_<bundleType>` | `destination + "/" + bundleType` | The destination for JavaScript/TypeScript files                                                                      | Core                                                                     |
| `eslint`                   | Swissquote JavaScript Guideline  | This defines the rules for all JavaScript source files that go through the Gulp builder                              | `crafty-preset-babel`                                                    |
| `eslintReactVersion`       | `"15.0"`                         | Some linting rules need to know the React version used.                                                              | `crafty-preset-babel`                                                    |
| `externals`                | `[]`                             | What libraries are already provided in the final application, see below for more information                         | `crafty-runner-rollup` / `crafty-runner-webpack`                         |
| `img_basedir`              | `"images"`                       | Where to take images from (Relative to current working directory)                                                    | `crafty-preset-images` / `crafty-preset-images-simple`                   |
| `img_extensions`           | `["png", "jpg", "jpeg", "gif"]`  | What extensions to compress (excludes svg)                                                                           | `crafty-preset-images`                                                   |
| `legacy_css`               | `false`                          | When enabling this feature, the CSS will be linted for errors and formatting instead of the Swissquote CSS Guideline | `crafty-preset-postcss`                                                  |
| `mavenType`                | See below                        | Defines wether this application is a `webapp` or `webjar`.                                                           | `crafty-preset-maven`                                                    |
| `stylelint`                | Swissquote CSS Guideline         | This defines the rules for all CSS source files, it contains the naming conventions                                  | `crafty-preset-postcss`                                                  |
| `stylelint_legacy`         | Swissquote CSS Guideline         | This defines the rules for all CSS source files, it contains the base formatting rules and best practices            | `crafty-preset-postcss`                                                  |
| `stylelint_pattern`        | See Below                        | Define the file types you want to target when linting CSS files.                                                     | `crafty-preset-postcss`                                                  |
| `tslint`                   | Swissquote JavaScript Guideline  | This defines the rules for all TypeScript source files.                                                              | `crafty-preset-typescript`                                               |
| `uglifyJS`                 | See below                        | Configure the compression level of your JavaScript assets.                                                           | `crafty-preset-babel` / `crafty-runner-rollup` / `crafty-runner-webpack` |

### `destination`

By default, your compiled assets will be in `dist/<bundleType>`. But you can
override the `config.destination` or `config.destination_<bundleType>` option.

You can also use the `crafty-preset-maven` with the `mavenType` option to move
your assets to Maven's `target` directory.

[More about `crafty-preset-maven`](05_Packages/05_crafty-preset-maven.md)

### `browser`: Browser compatibility

Default: `"> 1%, last 4 versions, Firefox ESR, Safari >= 7.1, iOS >= 7.1, Chrome >= 32, Firefox >= 24, Opera >= 24, IE >= 9"`

Depending on the target browsers, some optimization might be enabled or disabled
to create the smallest possible package for the browsers requirements we have.

This option is for example used by Autoprefixer to define which CSS Prefixes it
needs to add to the CSS file.

The default browsers we defined was taken from the statistics of browser usage
we have seen across all Swissquote Platforms

### `uglifyJS` : JavaScript compression

Default: `{ compress: true, sourceMap: true }`

By default, we compress our JavaScript with safe parameters, if you wish you can
go further and enable more advanced compression techniques.

The options are described
[in UglifyJS' documentation](https://github.com/mishoo/UglifyJS2#usage)

### `stylelint_pattern`: Which files to lint

Default: `["css/**/*.scss", "css/**/*.css", "!*.min.css", "!**/vendor/**/*.scss", "!**/vendor/**/*.css", "!**/vendor/*.scss", "!**/vendor/*.css"]`

Define the file types you want to target when linting CSS files.

## Bundles

A bundle is a set of one or more source files that will be compiled in on or
more destination files.

Each bundle has one mandatory option : `source`.

If we take this JavaScript bundle :

```javascript
app: { // name of the bundle
 source: ['js/panel.js', 'js/nothing.js'],
}
```

This will automatically create a file in `<destination_js>/app.min.js`
containing both source files that will be minified.

The file name is taken from the bundle name if no `destination` is specified

### Common Bundle options

| Option        | Type         | Optional ? | Description                                                                                                        |
| ------------- | ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `source`      | String/Array | No         | One single file or an array of files you wish to compile. Glob expressions are valid.                              |
| `runner`      | String       | No         | The name of the runner to use for this bundle. Is mandatory if more than one runner is loaded                      |
| `destination` | String       | Yes        | The name to give to the final file. Defaults to `<bundle_name>.min.<bundle_type>`                                  |
| `watch`       | String/Array | Yes        | The watch expression to use to rebuild this asset. Any glob expression is valid, is needed for Gulp in watch mode. |

### CSS Bundles

```javascript
testIndex: {
    source: 'css/test/test.scss',
    destination: 'index.min.css',
    watch: 'css/test/**.scss'
}
```

`testIndex` is the bundle name, you will be able to call `gulp css_testIndex` to
build it.

Apart from the common options, here are the options you can use for CSS bundles.

| Option       | Type                      | Runner  | Preset                  | Description                                                                                                                                                                                                                                                                                                      |
| ------------ | ------------------------- | ------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `extractCSS` | Boolean / String / Object | Webpack | `crafty-preset-postcss` | This will extract the CSS out of the bundle, all [Official options](https://github.com/webpack-contrib/extract-text-webpack-plugin#options) work, you can also pass `true` which will use `[bundle]-[name].min.css` as file name, you can use `[bundle]` in the file name which is replaced by your bundle name. |

### JavaScript Bundles

```javascript
app: {
    source: ['js/panel.js', 'js/nothing.js'],
    destination: 'app.min.js'
}
```

`app` is the bundle name, you will be able to call `gulp js_app` to build it.

Apart from the common options, here are the options you can use for JavaScript
bundles.

| Option          | Type                | Runner              | Preset                                           | Description                                                                                                                                      |
| --------------- | ------------------- | ------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `format`        | String              | rollup.js           | `crafty-runner-rollup`                           | Define the output format can be any of `amd`, `iife`, `cjs`, `es` or `umd`. Defaults to `es`.                                                    |
| `externals`     | Array&lt;String&gt; | rollup.js / Webpack | `crafty-runner-webpack` / `crafty-runner-rollup` | Extends the list of provided libraries (Webpack understands both globs and strings, rollup.js doesn't understand globs)                          |
| `hot`           | Boolean             | Webpack             | `crafty-runner-webpack`                          | Allows to use Hot Module Replacement in watch mode (`false` by default)                                                                          |
| `libraryTarget` | String              | Webpack             | `crafty-runner-webpack`                          | Define the library type to export. By default we use `amd`. [Possible values](https://webpack.js.org/configuration/output/#output-librarytarget) |
| `library`       | String              | Webpack             | `crafty-runner-webpack`                          | Define the library name for the Webpack module or export.                                                                                        |
| `concat`        | Boolean             | Gulp                | `crafty-preset-babel`                            | This will merge all files together, outputting a single file. (This doesn't resolve imports, use Webpack or rollup.js for this)                  |

#### JavaScript External assets

By default, all bundlers include all external dependencies in the final bundle,
this works fine for applications, but if you wish to build a multi-tenant
application or a library, you don't wish to include all dependencies, because
you'll end up with the same dependency more than one time.

The `externals` option allows you to define a list of libraries that are
provided and should not be embedded in the build, here is an example :

```javascript
module.exports = {
    ...
    // patterns are strings or globs
    externals: ["react", "react-dom", "squp", "squp/**"],
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

In this example `react`, `react-dom` and all modules starting with `squp/` will
be treated as external

> You can see that globs were used here, note that they work for Webpack but not
> for rollup.js that needs complete strings.
