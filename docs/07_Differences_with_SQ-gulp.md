**Crafty** differs in many ways from **SQ-Gulp**.

In a few words, Crafty is agnostic of which technology you use to build your
application with, whereas SQ-Gulp is very opinionated.

Also Crafty allows you to take only the pieces you need, where SQ-Gulp forced
you to take the whole package.

[TOC]

## New in Crafty

### General

* In Crafty everything is executed from the `crafty` command line tool
* Tslint, Stylelint and ESLint all fail the build on linting errors (was only
  the case for ESLint before).
* In watch mode, ESLint and Stylelint formatting errors are reported as
  warnings.
* Gulp for JavaScript now compiles with Babel, and outputs one file per entry
  file, old behaviour can be done with `concat: true` in the bundle
  configuration.

* running `crafty watch` will run all tasks one time before staying on watch.
* Many updated modules.
* Doesn't need Gulp to work.
* The configuration file `config.js` is now `crafty.config.js`

### Tests

* Added a **Jest** test runner.
* Integration tests: the majority of the features now have tests.

### Runners

* Added **rollup.js** runner intended for libraries.
* a new `hot` option on bundles to enable Hot Module Replacement in Webpack

### Modularity

* extracted `eslint`, `babel`, `stylelint` and `postcss` presets in separate
  packages, ready to be used outside of crafty if needed.

### Postcss

* Optionally extract CSS from webpack build using `ExtractTextPlugin`.
* New custom Stylelint rules to follow the Swissquote CSS Guideline.

## Moved, renamed or Changed

* The `type` option for maven is now `mavenType`
* `jsProvidedLibraries` is now `externals`
* removed `verbose` configuration option, can be enabled with `--verbose`.
  Webpack profiles are created with the `--profile` argument
* removed `eslint_es5`, renamed `eslint_es6` to `eslint` the only supported
  preset is now ES2015+
* removed `babel` as a configuration object, it's now a function: check
  [The preset's configuration](05_Packages/05_crafty-preset-babel.md) on how to
  use it.

## Momentarily removed, will come back in another form

* **Included Polyfills**: Is not configurable, doesn't always bring the right
  polyfills.
* **React Hot Loader**: Has been moved to a separate preset, didn't work
  correctly, will come back once we can make it work correctly.

## Doesn't exist anymore

* Auto reload of the configuration. Might come back once in the future, not
  planned yet.
* `sq-gulp` cli tool
* `sq-gulp postinstall` wasn't used anymore.
* removed `postcss-apply` that handles `@apply` in CSS as the feature that was
  planned to be implemented has been removed from the spec.

* Removed some configuration options

  * removed `cache_enabled`
  * removed `watch_development`
  * removed `jsAutoExternal` as it is an anti-pattern, just specify `externals`
    instead
  * removed `destinationFallback`: defaults to `dist`

* Removed some bundle options
  * remove `isES6`/`webpack`: you can now specify the runner with `runner`
  * `createSprites` removed from PostCSS

## Other packages

### `babel-preset-swissquote`

* Extracted all Babel plugins and presets in a single preset. Can be used like
  any Babel preset.

### `eslint-plugin-swissquote`

* Don't need to install peerDependencies anymore, they come bundled. (this is a
  workaround to a missing ESLint feature)

### `postcss-swissquote-preset`

* Extracted all Postcss plugins in a separate package.

### `stylelint-config-swissquote`

* Extracted all Stylelint configuration in a separate package.
* Added a few tests to ensure the package works as expected across updates.
