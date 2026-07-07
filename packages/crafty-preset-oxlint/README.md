# `@swissquote/crafty-preset-oxlint`

Lint your JavaScript and TypeScript with [oxlint](https://oxc.rs/docs/guide/usage/linter),
the Rust linter from the [oxc](https://oxc.rs) project. This preset is an
alternative to [`@swissquote/crafty-preset-eslint`](../crafty-preset-eslint):
when it is loaded, ESLint's build-time and IDE integration stand down in its
favor.

It depends on [`@swissquote/crafty-preset-oxfmt`](../crafty-preset-oxfmt) (the
formatter) the same way the ESLint preset depends on Prettier, so installing
this preset gives you both linting and formatting.

## Install

```bash
npm install --save-dev @swissquote/crafty @swissquote/crafty-preset-oxlint
```

```js
// crafty.config.js
module.exports = {
  presets: ["@swissquote/crafty-preset-oxlint"]
};
```

## Commands

```bash
# Lint the project (defaults to the current directory)
crafty oxlint

# Lint a specific path with a flavor and auto-fix
crafty oxlint --preset node src --fix
```

Crafty-specific flags:

- `--preset <flavor>` (repeatable): pick the Swissquote flavor(s) —
  `recommended` (default), `node`, `legacy`. See
  [`@swissquote/oxlint-config-swissquote`](../oxlint-config-swissquote).
- `--config <file>`: merge an external `.oxlintrc.json`.

Every other [oxlint CLI flag](https://oxc.rs/docs/guide/usage/linter/cli) is
forwarded as-is. A SARIF report is written to `reports/oxlint/` for tooling.

## Build integration

On non-watch `webpack`/`rspack` builds, the preset runs oxlint and fails the
build on lint errors. oxlint resolves the TypeScript/JSX extensions natively, so
no extra configuration is needed when used with the TypeScript preset.

## IDE integration

Running `crafty ide` generates a `.oxlintrc.json` from the `recommended` flavor
(plus any preset overrides), which editors pick up natively.

> **Parity note:** oxlint re-implements a large subset of the ESLint rules in
> Rust but cannot run the custom JavaScript rules of
> `eslint-plugin-swissquote`, so the rule set is _close_, not identical.
