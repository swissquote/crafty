[TOC]

## Introduction

All bundles made with Babel have the same features, regardless of the bundler that was used.

Except Gulp that will not use Babel to create your final bundle.

## EcmaScript 2015/2016 with Babel

By default, when you declare a JavaScript bundle in your `crafty.config.js` it will be compiled in the simplest possible way.

Let's take this example.

```javascript
{
  js: {
    app: {
      runner: "webpack",
      source: ['js/app.js']
    }
  }
}
```

In this case, this build will run through Webpack and execute the following tasks:

- Linting with ESLint
- Resolve dependencies and create one bundle
- Compile the code using Babel
- Minify all files with Terser

After this, we get a bundle named `app.min.js` in `dist/js`.

Both Webpack and rollup.js us Babel to compile modern JavaScript to JavaScript that all browsers understand.

### Babel

Babel is a compiler that gets all its features through plugins.
We chose the best plugins in the community to get the best out of it.

[Our Babel preset](05_Packages/10_babel-preset-swissquote.md) contains everything we need for our web applications.

The options we have for this preset are `environment` and `browsers`.

- `environment` is defined automatically from how you run it (`crafty run/watch/test`).
- `browsers` is defined from `config.browsers`.
  The default list is `"Edge >= 18, Safari >= 13, iOS >= 13, Chrome >= 77, and_chr >= 77, Firefox >= 69"`.
  You can override those defaults using any valid [Browserslist query source](https://github.com/browserslist/browserslist#queries)

You can override this browsers list in your crafty configuration file.
