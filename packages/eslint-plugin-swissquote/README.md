# Swissquote ESLint preset

## Features

- Provide a style guide for your JavaScript
- Warns on common mistakes in JavaScript
- Works with EcmaScript 2015+ using the `babel-eslint` parser

## Presets

This plugin comes with four presets

- `format` Base formatting rules, should work on any code (included in `legacy`
  and `recommended`)
- `node` Adds environment information for Node.js
- `legacy` For all your EcmaScript 5 code
- `recommended` For all your EcmaScript 2015+ code, also contains rules for React

## Included plugins

the `recommended` preset includes three plugins:

- `eslint-plugin-import` provides some rules to clean imports.
- `eslint-plugin-react` ensures you follow some best practices with React.
- `eslint-plugin-react-hooks` ensures you follow some best practices with React Hooks.
- `eslint-plugin-sonarjs` provides some advanced rules made by the guys at [SonarQube](https://www.sonarqube.org/).

To make it easy to install this plugin, those rules are added to ESLint automatically, but prefixed with `swissquote/`.
This is due to a limitation with ESLint that doesn't allow us to add plugins to ESLint through an API.

## Usage

Include them with in your projects like this:

```json
{
  "plugins": ["@swissquote/swissquote"],
  "extends": ["plugin:@swissquote/swissquote/recommended"]
}
```
