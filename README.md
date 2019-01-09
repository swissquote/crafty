# Crafty

[![Latest Version](https://img.shields.io/github/release/swissquote/crafty.svg?style=flat-square)](https://github.com/swissquote/crafty/releases)
[![license](https://img.shields.io/github/license/swissquote/crafty.svg?style=flat-square)](https://github.com/swissquote/crafty/blob/master/LICENSE.md)
[![Build Status](https://img.shields.io/travis/swissquote/crafty/master.svg?style=flat-square)](https://travis-ci.org/swissquote/crafty)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=crafty&metric=alert_status)](https://sonarcloud.io/dashboard?id=crafty)
[![npm](https://img.shields.io/npm/dt/@swissquote/crafty.svg?style=flat-square)](https://npmjs.com/package/@swissquote/crafty) [![Greenkeeper badge](https://badges.greenkeeper.io/swissquote/crafty.svg)](https://greenkeeper.io/)

Crafty is a build configuration manager, Opinionated but configurable, you can use its presets to build your applications with Webpack, Gulp, rollup.js, Babel, ESLint, TypeScript, TSLint, PostCSS, Stylelint and other tools.

Crafty has a default configuration and provides possibilities to extend that default configuration.

## Installation and usage

### Install

```bash
npm install @swissquote/crafty \
  @swissquote/crafty-preset-babel \
  @swissquote/crafty-preset-postcss \
  @swissquote/crafty-preset-jest \
  @swissquote/crafty-runner-webpack \
  @swissquote/crafty-runner-gulp
```

### Configure

In `crafty.config.js` add

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-preset-jest",
    "@swissquote/crafty-runner-webpack",
    "@swissquote/crafty-runner-gulp"
  ],
  js: {
    app: {
      runner: "webpack",
      source: "js/app.js"
    }
  },
  css: {
    app: {
      source: "css/app.scss",
      watch: ["css/**"]
    }
  }
};
```

### Run

You can run the commands using [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) or by adding them to the `scripts` section of your `package.json`

```bash
npx crafty run
npx crafty test
```

With this configuration you get:

- Create a JavaScript bundle compiled with [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/).
- Linted your JavaScript with [ESLint](https://eslint.org/).
- Create a CSS bundle compiled with [PostCSS](http://postcss.org/).
- Lint your CSS with [Stylelint](https://stylelint.io/).
- Run your tests with [Jest](https://facebook.github.io/jest/) and compile them with [Babel](https://babeljs.io/).

## Why

Getting started in a web application is easy, write an `index.html`, a
`style.css`, and a `script.js` file and you're good to go.

But on bigger apps you might want some CSS preprocessing ? but which one to
choose ? **Sass**, **Less**, **Stylus**, **PostCSS** ? Then you want to write
your JavaScript using EcmaScript 2015+, but do you transpile it with **Traceur** or
**Babel** ? Then you have to package your JavaScript in bundles, you have the
choice between **rollup.js**, **Browserify**, **Webpack** or **Pundle**. Now you
want to lint your JavaScript, do you choose **ESLint** or **JSHint** ? To
orchestrate all this, do you use **Gulp**, **Broccoli** or **Grunt** ?

You guessed it, each tool in the JavaScript stack has at least two alternatives,
and there is not always a clear winner. This lead to a "JavaScript Fatigue" in
the community these last years and people got lost in what tools to choose
to do these tasks.

But even when you chose the tool you want to work with, you still have to
configure it, maintain it up to date and follow up on changes.

**Crafty** is an attempt to create a package that is simple to install and
configure. Specify your JavaScript and CSS files in entry and get them compiled,
compressed and linted with the best tools available.

Each tool is fine-tuned to give the best and to follow Swissquote's Guidelines
and best practices for Frontend development.

Most aspects of **Crafty** are configurable and updates are painless.

[More on Why](https://swissquote.github.io/crafty/Why.html)

## Features

The main feature of **Crafty** is to compile your JavaScript, CSS, compress your
images and deliver them in the target directory.

But shortening the list of features you gain with **Crafty** to one sentence
doesn't give it's full measure. Here's some other features it has:

### JavaScript

- Write **EcmaScript 2015**, transpiled to JavaScript all browsers understand
  with Babel.
- Write **TypeScript**, transpiled to EcmaScript 5 with the TypeScript compiler.
- Bundle all JavaScript files together with the help of **Webpack**.
- Compress the output with **Terser** to create the smallest possible bundles.
- Lint your code with **ESLint**, points you to possible mistakes and formatting
  errors.
- Simple debugging with Source Maps.

[Read more about features here](https://swissquote.github.io/crafty/Use_Cases/Compiling_JavaScript.html)

### CSS

- Preprocess your CSS using **PostCSS** and plugins that will allow to
  write in a syntax approaching the one of Sass.
- Some plugins include `postcss-nested` to nest your styles, some plugins to use
  Future CSS features today and `postcss-advanced-variables` to define mixins
- Compress the CSS output with `postcss-csso` to get the smallest possible file.
- Automatically add vendor prefixes to properties with `autoprefixer`.
- Simple Debugging with Source Maps

[Read more about features here](https://swissquote.github.io/crafty/Use_Cases/Compiling_CSS.html)

### Images

With the help of
[`crafty-preset-images`](https://swissquote.github.io/crafty/Packages/crafty-preset-images.html) you can also
compress your images (svg/png/jpg/gif).

[Read more about features and configuration here](https://swissquote.github.io/crafty/Use_Cases/Compressing_Images.html)

### Watching for Changes / Hot Module Replacement

By running the `gulp watch` command, a process is launched to trigger a rebuild
of your asset on each change in `src/main/frontend`.

A change on the configuration while Watching will reconfigure itself.

For Assets built with **Webpack** this can be even more powerful : after
compiling your code, it can change the code within the browsers **without
reloading**.

Here's an example:

![React Hot Module Reload example](docs/react-hot-loader.gif)

[Read more about `watch`](https://swissquote.github.io/crafty/User_Guides/Developing_Faster_with_Crafty_watch.html)

## Maven, Node and Gulp

Swissquote's build environment is based mainly on Maven and it's plugin
ecosystem. But the Frontend world solely relies on Node tooling to build
JavaScript and CSS assets.

To use the best of both worlds, we take advantage of the
`maven-frontend-plugin`. This plugin will ensure a Node version is installed and
will run an `npm install` to install our JavaScript dependencies.

We also use Gulp, a JavaScript task runner (can be seen a bit like Ant but for
the JavaScript world).

**Crafty** is the glue that will take all these pieces we mentioned, and build
you assets with the best-in-class tools. Working with Swissquote's JavaScript and CSS Guidelines as well.

Everything bundled in a way that `mvn clean install` will build your assets like
you would expect with pure Java plugins.

## Getting started

To get started, follow [the guide](https://swissquote.github.io/crafty/Getting_Started.html)
