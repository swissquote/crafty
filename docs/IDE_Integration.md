[TOC]

One thing that's great about Crafty is that you don't end up with a folder full of configuration files in your project,
the downside is that IDEs use those configuration files to give you an out-of-the-box experience by reading these configuration files.

For this reason, we implemented `crafty ide`. This command will generate the configuration files in your project so that your IDE can give you the out-of-the-box experience you want.

> Note that these configuration files **should not be committed** with your project as they are different for each machine because module paths are absolute.

## Using this feature

Once Crafty is installed and you created your `crafty.config.js`, run `crafty ide` and the configuration files for your tools will be generated.

We strongly recommend adding those generated configuration files to your `.gitignore` file to not mistakenly commit them

Some integrations, like ESLint support command line options to tweak the generated configuration.

## Existing integrations

Three presets use this feature:

- [ESLint](./05_Packages/05_crafty-preset-eslint/ESLint_IDE_Integration.md)
- [stylelint](./05_Packages/05_crafty-preset-stylelint/Stylelint_IDE_Integration.md)
- [Jest](./05_Packages/05_crafty-preset-jest/Jest_IDE_Integration.md)

## Works best with

This feature was tested with Visual Studio Code and IntelliJ IDEA (Webstorm, PHPStorm, ...).

But since it works by using the standard files of these tools it should work with any IDE that has a plugin for those tools.
