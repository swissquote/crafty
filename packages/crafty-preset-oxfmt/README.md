# `@swissquote/crafty-preset-oxfmt`

Format your code with [oxfmt](https://oxc.rs/docs/guide/usage/formatter), the
Rust formatter from the [oxc](https://oxc.rs) project. This preset is an
alternative to [`@swissquote/crafty-preset-prettier`](../crafty-preset-prettier):
when it is loaded, Prettier's IDE integration stands down in its favor.

oxfmt formats JavaScript, JSX, TypeScript, TSX, JSON, CSS, SCSS, Markdown and
YAML.

## Install

```bash
npm install --save-dev @swissquote/crafty @swissquote/crafty-preset-oxfmt
```

It is usually used together with
[`@swissquote/crafty-preset-oxlint`](../crafty-preset-oxlint), which depends on
this preset.

```js
// crafty.config.js
module.exports = {
  presets: ["@swissquote/crafty-preset-oxlint"]
};
```

## Commands

```bash
# Format the project in place (oxfmt's default is --write)
crafty oxfmt

# Check formatting without writing (use this in CI), fails on unformatted files
crafty oxfmt --check
```

By default the command reuses an existing `.prettierignore` (as oxfmt's
`--ignore-path`) and formats the current directory when no path is given. Any
other [oxfmt CLI flag](https://oxc.rs/docs/guide/usage/formatter/cli) is
forwarded as-is.

## Build integration

On non-watch `webpack`/`rspack` builds, the preset runs `oxfmt --check` and
**fails the build** when files are not formatted — preserving the behavior of
the eslint+prettier preset.

## Configuration

The generated IDE config (`.oxfmtrc.json`, via `crafty ide`) is built from
`crafty.config.oxfmt`. oxfmt's defaults are Prettier-compatible, so most
projects need no configuration.

## Migrating from Prettier

oxfmt can migrate an existing Prettier configuration:

```bash
npx oxfmt --migrate
```
