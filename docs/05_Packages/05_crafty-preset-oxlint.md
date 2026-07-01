<table>
<tr><th>Commands</th><td>

- `oxlint`: Lint JavaScript and TypeScript with oxlint, pre-configured with our preset.

</td></tr>
</table>

[TOC]

## Description

**oxlint** is the Rust linter from the [oxc](https://oxc.rs) project. This
preset is an alternative to `crafty-preset-eslint`.

It declares that it provides the `oxlint` linter; Crafty resolves the active
linter declaratively. With a single linter preset loaded it is used
automatically; when several are loaded (for example oxlint alongside a TypeScript
preset that pulls in ESLint), oxlint wins by default because of its higher
priority. When oxlint is the active linter, ESLint's build-time and IDE
integration stand down in its favor. You can force the choice in
`crafty.config.js`:

```js
export default {
  presets: ["@swissquote/crafty-preset-oxlint", "@swissquote/crafty-preset-typescript"],
  linter: "oxlint",   // "oxlint" | "eslint"
  formatter: "oxfmt", // "oxfmt" | "prettier" | "prettier:1" | "prettier:2" | "prettier:3"
};
```

It depends on `crafty-preset-oxfmt` (the formatter) the same way the ESLint
preset depends on Prettier, so installing this preset gives you both linting and
formatting.

## Linting

```bash
# Lint the project
crafty oxlint

# Lint a specific path with a flavor and auto-fix
crafty oxlint --preset node src --fix
```

Crafty-specific flags:

- `--preset <flavor>` (repeatable): `recommended` (default), `node`, `legacy`.
- `--config <file>`: merge an external `.oxlintrc.json`.

Every other [oxlint CLI flag](https://oxc.rs/docs/guide/usage/linter/cli) is
forwarded as-is. A SARIF report is written to `reports/oxlint/`.

> oxlint re-implements a large subset of the ESLint rules in Rust but cannot run
> the custom JavaScript rules of `eslint-plugin-swissquote`, so the rule set is
> _close_, not identical.

## Build integration

On non-watch `webpack`/`rspack` builds, the preset runs oxlint and fails the
build on lint errors. oxlint resolves the TypeScript/JSX extensions natively.

## IDE integration

Running `crafty ide` generates a `.oxlintrc.json` that editors pick up natively.
