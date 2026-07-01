<table>
<tr><th>Commands</th><td>

- `oxfmt`: Format your code with oxfmt. Defaults to writing files in place; pass `--check` for CI.

</td></tr>
</table>

[TOC]

## Description

**oxfmt** is the Rust formatter from the [oxc](https://oxc.rs) project. This
preset is an alternative to `crafty-preset-prettier`.

It declares that it provides the `oxfmt` formatter; Crafty resolves the active
formatter (see [Choosing a linter and formatter](#choosing-a-linter-and-formatter)).
When oxfmt is the active formatter, Prettier's IDE integration stands down in its
favor.

It formats JavaScript, JSX, TypeScript, TSX, JSON, CSS, SCSS, Markdown and YAML.

## Choosing a linter and formatter

Crafty picks the active formatter declaratively. With a single formatter preset
loaded it is used automatically; when several are loaded (for example oxfmt
alongside a TypeScript preset that pulls in Prettier), oxfmt wins by default
because of its higher priority. You can always be explicit in `crafty.config.js`:

```js
export default {
  presets: ["@swissquote/crafty-preset-eslint", "@swissquote/crafty-preset-oxfmt"],
  // Mix and match freely: keep ESLint for linting, use oxfmt for formatting.
  formatter: "oxfmt", // "oxfmt" | "prettier" | "prettier:1" | "prettier:2" | "prettier:3"
};
```

When the active formatter is not Prettier, the ESLint preset turns its
`prettier/prettier` rule off so the two never fight over formatting.

## Formatting

```bash
# Format the project in place
crafty oxfmt

# Check formatting without writing (CI), fails on unformatted files
crafty oxfmt --check
```

The command reuses an existing `.prettierignore` (as oxfmt's `--ignore-path`)
and defaults to the current directory when no path is given. Other
[oxfmt CLI flags](https://oxc.rs/docs/guide/usage/formatter/cli) are forwarded
as-is.

## Build integration

On non-watch `webpack`/`rspack` builds, the preset checks the formatting of the
source files that took part in the compilation and fails the build when any are
not formatted, preserving the behavior of the eslint+prettier preset. The check
runs **in-process** through oxfmt's `format()` JS API — no process is spawned per
build. (The standalone `crafty oxfmt` command, by contrast, spawns the oxfmt CLI
so it keeps the binary's globbing, ignore-file handling and `--write`/`--check`.)

## IDE integration

Running `crafty ide` generates a `.oxfmtrc.json` from `crafty.config.oxfmt`.
oxfmt's defaults are Prettier-compatible, so most projects need no
configuration.

## Migrating from Prettier

```bash
npx oxfmt --migrate
```
