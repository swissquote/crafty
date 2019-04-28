[TOC]

![Shows errors inline](./IDE_Integration_eslint_inline.png)

ESLint's IDE integration relies in general on the `.eslintrc` files (optionally with a .js or .json extension) 

## Options

When generating the configuration file, you can add arguments to specify which presets you want, if you specify nothing it will use the `format` preset.

### Presets

- `format` Base formatting rules, should work on any code (included in `legacy` and `recommended`)
- `node` Adds environment information for Node.js
- `legacy` For all your EcmaScript 5 code
- `recommended` For al your EcmaScript 2015+ code, also contains rules for React

You can use the number of presets you wish, the `format` preset is the one checked by the hooks

You can define them with `--preset {presetName}`

For example running with `crafty ide --preset recommended` will verify for formatting, common rules, EcmaScript 2015+ specific and React specific rules.

## IDE plugins

- __[Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)__
- __[IntelliJ IDEA](https://plugins.jetbrains.com/plugin/7494-eslint)__
