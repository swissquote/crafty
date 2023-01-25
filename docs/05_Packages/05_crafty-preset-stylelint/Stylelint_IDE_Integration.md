[TOC]

stylelint's IDE integration relies in general on the `stylelint.config.js` files.

With the `crafty ide` command, a configuration file is generated to be read by your IDE.

The generated file will be different if you use the `legacy_css` option in your `crafty.config.js` file.

> Note that these configuration files **should not be committed** with your project as they are different for each machine because module paths are absolute.

## IDE plugins

- **[Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint)**
- **[IntelliJ IDEA](https://plugins.jetbrains.com/plugin/9276-intellij-stylelint-plugin)**
