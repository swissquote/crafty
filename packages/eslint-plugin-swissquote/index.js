const { prefixPlugins } = require("./src/utils.js");
const globals = require("./packages/globals");
const { defineConfig } = require("eslint/config");

module.exports = {
  configs: {
    format: prefixPlugins(
      defineConfig(
        require(`./src/formatting.js`),
        require(`./src/es6-format.js`),
        require("./src/typescript.js")
      )
    ),
    node: prefixPlugins(
      defineConfig(require(`./src/node.js`), require("./src/typescript.js"))
    ),
    legacy: prefixPlugins(
      defineConfig(
        require(`./src/formatting.js`),
        require(`./src/best-practices.js`),
        {
          languageOptions: {
            ecmaVersion: 5,
            sourceType: "script",
            globals: {
              ...globals.browser,
              ...globals.amd
            }
          },
          rules: {
            "no-dupe-keys": "error"
          }
        }
      )
    ),
    recommended: prefixPlugins(
      defineConfig(
        require(`./src/formatting.js`),
        require(`./src/best-practices.js`),
        require(`./src/es6-format.js`),
        require(`./src/es6-recommended.js`),
        require(`./src/react.js`),
        {
          languageOptions: {
            globals: {
              ...globals.browser,
              ...globals.amd
            }
          }
        },
        require("./src/typescript.js"),
        require("./src/typescript-best-practices.js")
      )
    )
  }
};
