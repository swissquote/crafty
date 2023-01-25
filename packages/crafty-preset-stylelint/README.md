<table>
<tr><th>Linters</th><td>

Provides stylelint, configured with [`stylelint-config-swissquote`](05_Packages/10_stylelint-config-swissquote.md)

</td></tr>
<tr><th>Commands</th><td>

- `cssLint`: Lint CSS files, this is a facade for Stylelint, pre-configured with our preset.

</td></tr>
</table>

[TOC]

## Description

**Stylelint** is a wonderful tool to lint CSS in according to your rules, we have a custom configuration preset for Stylelint that comes pre-configured.

[Read more about it here](CSS_Linting.md)

## Installation

> `@swissquote/crafty-preset-stylelint` is also automatically provided by `@swissquote/crafty-preset-postcss`.
> No need to add it manually if `crafty-preset-postcss` is already in your presets.

```bash
npm install @swissquote/crafty-preset-stylelint --save
```

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-stylelint"
  ]
};
```

## Commands

### `crafty cssLint`

This command will lint CSS files using Stylelint's CLI too, you can get it's documentation [here](https://stylelint.io/user-guide/cli/).

The additions made by this command are:

- Pre-configured rules, defined by [`stylelint-config-swissquote`](05_Packages/10_stylelint-config-swissquote.md) activated using `--preset`.
- Set the syntax to `scss`.

there are 3 presets available for you :

- `recommended`: Contains all BEM specific rules.
- `legacy`: Contains rules specific to legacy code.
- `common`: Enforces the styleguide of the CSS. (included in both `recommended` and `legacy`)

Setting presets is done with the `--preset` option

The order of the presets is important as some rules might override previous ones.

It can be used the following way:

```bash
crafty cssLint css/**/*.scss --preset recommended
```

If no preset is specified `recommended` is used.

### Linting options

You can read about the linting options in the page about [CSS Linting](CSS_Linting.md)
