[TOC]

## Why we created Crafty

This package is a helper to compile your scripts to the best, optimized,
compressed and understood by all browser versions of the code you write.

It takes the best tools choices of the community between the huge amount of
options for the task at hand (**Sass**, **Less**, **Stylus**, **Postcss**,
**Traceur**, **Babel**, **rollup.js**, **Browserify**, **Webpack**, **Pundle**,
**ESLint**, **JSHint**, **Gulp**, **Broccoli**, **Grunt**) With a consideration
for features, configurability, update frequency, compatibility and community.

All these tools are then configured to work together seamlessly and to get the
best out of each one.

### Features

We support the full ES2015 and ES2016 Specifications, Advanced CSS with the help
of PostCSS and also TypeScript.

The features are best explained in each specific section :
[JavaScript](05_Packages/crafty-preset-babel),
[TypeScript](05_Packages/crafty-preset-typescript),
[CSS](05_Packages/crafty-preset-postcss)

### Update frequency

Almost all of the tools we use in this project are update more than once a
month. Keeping the more than 70 dependencies up to date on this project is a
continuous task. But it would be even more complex if it needs to be done on all
Swissquote projects separately.

### Compatibility

The tools and plugins are carefully picked to work together. We made many Pull
Requests to various projects to ensure they are compatible with one another and
we keep track of the open problems.

### Configurability

All tools of this type have dozens of configuration options. Knowing them all is
impossible. With Crafty we embedded all options that need to respect the
Swissquote Standards (Our CSS and JavaScript Guideline for example)

But we also expose a lot of configuration options to the final user. By doing it
this way, you can freely benefit from very advanced features without any complex
configuration, but can tweak many things to your specific needs.

### Community

The community around tools like **Babel**, **ESLint**, **Webpack** and others
are very active. Tens of issues are created and resolved each week, new features
come very often, always improved documentation and reliability.

## Why we developed our solution instead of an existing one

Some solutions outside Swissquote do a similar job, like
[neutrino](https://neutrino.js.org/). However they all tend to be very
opinionated and not offering many options to tailor the solution to our needs.
Or they are made only for one specific tool.

For example:

* [create-react-app](https://github.com/facebookincubator/create-react-app) is
  meant to create React applications with Babel and Webpack. You can't use
  TypeScript and you can't create multiple bundles.
* [neutrino](https://neutrino.js.org/) is more configurable but still allows to
  create only one bundle and only for Webpack.
