In this guide you will learn to create a configuration for your project.

[TOC]

## Foreword

> All Paths are relative to the current working directory. Maven projects
> default to `src/main/frontend`.

Your configuration file must be in `crafty.config.js`

In its simplest form a configuration can look like this.

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-runner-gulp"
  ],
  js: {
    app: {
      // Will create js/app.min.js containing both source files
      source: ["js/panel.js", "js/nothing.js"]
    }
  }
};
```

More advanced configuration can look like this:

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-maven",
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-runner-gulp",
    "@swissquote/crafty-runner-webpack"
  ],
  name: "test-plugin",
  mavenType: "webjar", // This artifact is a webjar
  css: {
    testIndex: {
      source: "css/test.scss", // You can specify one or more entry files
      destination: "index.min.css", // You can make the destination explicit
      watch: "css/**/*.scss" // When a change occurs on files corresponding to this patterns this task will be rerun
    },
    testIndex2: {
      source: ["css/test2.scss", "css/more.scss"],
      destination: "index2.min.css",
      watch: "css/**/*.scss"
    }
  },
  js: {
    app: {
      runner: "webpack", // Use Webpack and Babel to compile this bundle
      source: "js/app.js"
    }
  }
};
```

## Presets

Each feature of Crafty is declared through a preset, if you wish to compile your
JavaScript with Babel, we created `crafty-preset-babel`. If you wish to compile
your CSS with PostCSS, we created `crafty-preset-postcss`.

All these presets can create Tasks which are then taken by a Runner. We provide
three runners: `crafty-runner-gulp`, `crafty-runner-webpack` and
`crafty-runner-rollup`.

## Bundles

A bundle is a set of one or more source files that will be compiled in a single
destination file.

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

> Bundles have more options that are specific to the selected runners and bundle
> types.

### CSS Bundles (`crafty-preset-postcss`)

```javascript
testIndex: {
    source: 'css/test/test.scss',
    destination: 'index.min.css',
    watch: 'css/test/**.scss'
}
```

`testIndex` is the bundle name, you will be able to call `crafty css_testIndex`
to build it.

The preset itself documents all options and features that are available to you.

[More about `crafty-preset-postcss`](05_Packages/05_crafty-preset-postcss.md)

### JavaScript Bundles (`crafty-preset-babel` or `crafty-preset-typescript`)

```javascript
app: {
    source: ['js/panel.js', 'js/nothing.js'],
    destination: 'app.min.js'
}
```

`app` is the bundle name, you will be able to call `crafty run js_app` to build
it.

Apart from the common options, here are the options you can use for JavaScript
bundles. The presets document all options and features that are available to
you.

[More about `crafty-preset-babel`](05_Packages/05_crafty-preset-babel.md)<br />
[More about `crafty-preset-typescript`](05_Packages/05_crafty-preset-typescript.md)

## Images (`crafty-preset-images` or `crafty-preset-images-simple`)

You can add the `crafty-preset-images` or `crafty-preset-images-simple` package
to your project to be able to compress your jpg, png, gif and svg files
(`images-simple` will compress svg and copy the rest).

[More about `crafty-preset-images`](05_Packages/05_crafty-preset-images.md)<br />
[More about `crafty-preset-images-simple`](05_Packages/05_crafty-preset-images-simple.md)

## Naming and locations conventions

### Locations

Your assets can be located anywhere you want next to your `package.json` and
`crafty.config.js` but we recommend putting them inside a sub-directory:

- `js` for JavaScript / TypeScript files
- `css` for Style sheets
- `images` for images

If you have some external JavaScript or CSS that aren't available in NPM. You
can also use create a `vendor` directory either in the `js`/`css` folder or in
`frontend` if your libraries contains both JavaScript and CSS files.

### Bundle names

Your bundle names should have an expressive name, if you have a single bundle,
name it either "app" or the name of your application.

### Bundle destinations

When setting a destination, you should always prefix the extension with ".min"
for example `file.min.js` or `file.min.css`

This is a convention that allows some tools to know the content is minified. And
will bring you the following benefits :

- When compressing files together, a file with ".min" in the name will not be
  minified again, thus you get a performance boost.
- Files with ".min" in their names won't go through the linting hooks.

## Destination directory

By default, your compiled assets will be in `dist/<bundleType>`. But you can
override the `config.destination` or `config.destination_<bundleType>` option.

You can also use the `crafty-preset-maven` with the `mavenType` option to move
your assets to Maven's `target` directory.

[More about `crafty-preset-maven`](05_Packages/05_crafty-preset-maven.md)

## All Options

**Crafty** has options that can be tweaked, the exhaustive documentation is
[available here](crafty.config.js_Available_Options.md).
