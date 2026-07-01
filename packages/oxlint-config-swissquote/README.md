# `@swissquote/oxlint-config-swissquote`

[oxlint](https://oxc.rs/docs/guide/usage/linter) configuration presets for
Swissquote, used by
[`@swissquote/crafty-preset-oxlint`](../crafty-preset-oxlint).

This package is the oxlint counterpart of
[`@swissquote/eslint-plugin-swissquote`](../eslint-plugin-swissquote). It exposes
the same three flavors:

| Flavor        | Intended for                                  |
| ------------- | --------------------------------------------- |
| `recommended` | Modern browser code (ES2015+, React)          |
| `node`        | Node.js code                                  |
| `legacy`      | ES5 scripts                                    |

> **Parity note:** oxlint is a Rust linter and re-implements a large subset of
> the `eslint` / `typescript-eslint` / `react` / `unicorn` / `import` rules
> natively. It cannot run the JavaScript-authored custom rules of
> `eslint-plugin-swissquote`, so these presets are an _approximate_ — not
> identical — equivalent. Formatting is **not** handled here; it is the job of
> [`oxfmt`](../crafty-preset-oxfmt).

## Usage

These configs are normally consumed through `@swissquote/crafty-preset-oxlint`,
which serializes the selected flavor to a temporary `.oxlintrc.json`. They can
also be used directly:

```js
const { configs } = require("@swissquote/oxlint-config-swissquote");

// configs.recommended / configs.node / configs.legacy
```
