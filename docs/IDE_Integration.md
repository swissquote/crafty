[TOC]

One thing that's great about Crafty is that you don't have too many configuration files in your project, 
the downside of it is that IDEs use those configuration files to give you an out-of-the-box experience by reading these configuration files.

For this reason, we implemented `crafty ide`. This command will generate the configuration files in your project so that your IDE can give you the out-of-the-box experience you want.

> Note that these configuration files __should not be commited__ with your project as they are different for each machine because module paths are absolute.

## Using this feature

Once your project is configured correctly, run `crafty ide` and the configuration files for your tools will be generated.

We strongly recommend adding those generated configuration files to your `.gitignore` file to not mistakenly commit them

Some integrations, like ESLint support command line options to tweak the generated configuration.

## Existing integrations

We currently have two presets that benefit from this feature :

- [ESLint](./05_Packages/05_crafty-preset-babel/ESLint_IDE_Integration.md)
- [stylelint](./05_Packages/05_crafty-preset-postcss/Stylelint_IDE_Integration.md)
- Jest

## Works best with

This feature was tested with Visual Studio Code and IntelliJ IDEA (Webstorm, PHPStorm, ...).

But since it works by using the standard files of these tools it should work with any IDE that has a plugin for those tools.