As explained in [Differences with SQ-Gulp](Differences_with_SQ-gulp.md); A big
number of features have changed between SQ-Gulp and Crafty, but it doesn't mean
that the migration is complicated.

[TOC]

## NPM Dependencies

To get the same feature set, here are the packages you need to have. If you
don't wish to have a feature (like PostCSS or TypeScript) you don't need to
install the package.

```bash
npm remove --save-dev gulp sq-gulp
npm install  --save-dev @swissquote/crafty \
  @swissquote/crafty-preset-babel @swissquote/crafty-preset-images-simple \
  @swissquote/crafty-preset-maven @swissquote/crafty-preset-postcss \
  @swissquote/crafty-preset-typescript @swissquote/crafty-runner-gulp \
  @swissquote/crafty-runner-webpack
```

## Configuration files

* remove `gulpfile.js` as it's not needed anymore.
* rename `config.js` to `crafty.config.js`

## `crafty.config.js`

* Add presets a presets configuration entry
  ```javascript
  module.exports = {
    presets: [
      "@swissquote/crafty-preset-babel",
      "@swissquote/crafty-preset-images-simple",
      "@swissquote/crafty-preset-maven",
      "@swissquote/crafty-preset-postcss",
      "@swissquote/crafty-preset-typescript",
      "@swissquote/crafty-runner-gulp",
      "@swissquote/crafty-runner-webpack"
    ]
  };
  ```
* change the `type` configuration key to `mavenType`
* remove `eslint_es5` as all JavaScript is now compiled with Babel
* rename `eslint_es6` to `eslint`
* rename `jsProvidedLibraries` to `externals`
* If you use the `babel` configuration key,
  [follow the preset's configuration](05_Packages/05_crafty-preset-babel.md) on
  how to use it now.

### Bundles

For each bundle present in your configuration

* rename `filename` to `destination`
* rename `jsProvidedLibraries` to `externals`
* change `webpack: true` with `runner: "webpack"`
* change `isES6: true` with `runner: "webpack"`

If your JavaScript bundle was meant to run with Gulp, you can reproduce its old
behavior with `concat: true` in the bundle as now the files will be kept
separate by default.

If a JavaScript bundle doesn't contain a `runner` key; add `runner:
"gulp/typescript"`, `runner: "gulp/babel"` or `runner: "webpack"` to it.

### `more(gulp, config, watcher)`

This method can be renamed to `gulp(crafty, gulp, StreamHandler)`

You can do a search and replace in your function for the following:

* `config` is now `crafty.config`
* `watcher` is now `crafty.watcher`
* `watcher.isWatching()` is now `crafty.isWatching()`
* `watcher.isProduction()` is now `crafty.getEnvironment() === "production"`

Also, you can't return values, if you wish to add tasks, call
`crafty.addDefaultTask("your-task")`.

You can also
[read more about Gulp's extension point](05_Packages/02_crafty-runner-gulp.md)
and [Crafty's API](05_Packages/01_crafty/The_Crafty_instance.md)

## `tsconfig.json`

If you use TypeScript, we changed the way its configuration is handled. A
majority of tools in the TypeScript ecosystem don't support overrides of
`tsconfig.json`'s configuration.

You can replace the content of your `tsconfig.json` with the following
configuration:

```json
{
  "exclude": ["node_modules", "node", "css", "etc"],
  "compilerOptions": {
    "declaration": true,
    "moduleResolution": "node",
    "charset": "UTF-8",
    "jsx": "react",
    "module": "esnext", // Using an ES6 module with an ES5 target allows to leverage tree shaking
    "sourceMap": true,
    "target": "es5",
    "lib": ["DOM", "ES2017", "DOM.Iterable", "ScriptHost"]
  }
}
```

## Command line calls

* Replace all calls to `gulp` with `crafty run`
* Replace all calls to `gulp watch` with `crafty watch`
