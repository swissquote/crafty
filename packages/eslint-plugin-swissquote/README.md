# Swissquote ESLint preset

## Features

* Provide a style guide for your JavaScript
* Warns on common mistakes in JavaScript
* Works with EcmaScript 2015+ using the `babel-eslint` parser

## Presets

This plugin comes with four presets

* `format` Base formatting rules, should work on any code (included in `legacy`
  and `recommended`)
* `node` Adds environment information for Node.js
* `legacy` For all your EcmaScript 5 code
* `recommended` For al your EcmaScript 2015+ code, also contains rules for React

## Included plugins

the `recommended` preset uses the `eslint-plugin-import` and
`eslint-plugin-react` inside. To make it easy to install this plugin, those
rules are added to ESLint automatically, but prefixed with `swissquote/`.

## Usage

Include them with in your projects like this:

```json
{ "extends": ["plugin:@swissquote/swissquote/recommended"] }
```
