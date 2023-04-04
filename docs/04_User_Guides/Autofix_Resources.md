[TOC]

### What is this?

In this guide we provide some simple examples for the usage of the auto-fix functionality.
Crafty comes with some default linter configuration including among other

- ESLint (JavaScript)
- PostCSS (CSS)
- Prettier (JavaScript + CSS)

### When should you use it ?

When your build produces a lot of errors, you might want to automate the task of fixing the errors.

Some of them need to be fixed manually but most can be fixed automatically.
Before diving into fixing 100 lines of code try these commands they come in handy.

## Option 1 : Crafty `jsLint`, `cssLint` options

This command will lint all your JavaScript files inside the `src` folder.

```bash
crafty jsLint src/** --fix --preset recommended
```

This command will lint all your CSS files inside your `src` folder.

```bash
crafty cssLint src/** --fix --preset recommended
```

- More info for crafty ESLint options here: [`crafty-preset-eslint`](../05_Packages/05_crafty-preset-eslint/index.md)
- More info for crafty PostCSS options here: [`crafty-preset-postcss`](../05_Packages/05_crafty-preset-postcss/index.md)

## Option 2 : use Prettier directly

Before running `yarn prettier` you should run

```bash
yarn crafty ide
```

More information [IDE Integration](../IDE_Integration.md)

This command will generate prettier configuration for your project.

Prettier is used internally with Crafty, you can also use Prettier directly to fix the formatting of your files without the linting:

```bash
npx prettier --write "**/*.js"
npx prettier --write "**/*.ts" "**/*.tsx" "**/*.mts" "**/*.cts"
```

Note the `--write` option will write the changes to disk. Omitting it will allow you to have a preview of the changes.

Example for linting TypeScript files:

```bash
npx prettier --write "**/*.ts" "**/*.tsx" "**/*.mts" "**/*.cts"
```

More options here: [Prettier Configuration](https://prettier.io/docs/en/cli.html)
