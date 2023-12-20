# Swissquote ESLint preset

## Features

- Provide a style guide for your JavaScript
- Warns on common mistakes in JavaScript
- Works with EcmaScript 2015+

## Presets

This plugin comes with four presets

- `format` Base formatting rules, should work on any code (included in `legacy`
  and `recommended`)
- `node` Adds environment information for Node.js
- `legacy` For all your EcmaScript 5 code
- `recommended` For all your EcmaScript 2015+ code, also contains rules for React

## Included plugins

### Plugins in the `format` preset

- `eslint-plugin-prettier` Uses Prettier to format your code.

Due to breaking changes in behavior between Prettier major versions, this preset provides multiple Prettier versions.
By default we use Prettier 1 for backwards compatibility.

You can choose which version you want to use by using ESLint's `settings` key.
Valid values are `prettier:1`, `prettier:2`, and `prettier:3`.

```javascript
{
  settings: {
    "formatting/mode": "prettier:2"
  }
}
```

| Prettier Version | TypeScript Compatibility |
| ---------------- | ------------------------ |
| Prettier 1       | >= 1 && <=4.2            |
| Prettier 2       | >= 1 && <=5.1            |
| Prettier 3       | >= 1                     |

### Plugins in the `recommended` preset

- `eslint-plugin-import` provides some rules to clean imports.
- `eslint-plugin-react` ensures you follow some best practices with React.
- `eslint-plugin-react-hooks` ensures you follow some best practices with React Hooks.

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
