function resolveModules(...args) {
  return args.map(arg => require.resolve(`./src/${arg}.js`));
}

module.exports = {
  configs: {
    format: {
      parser: require.resolve("babel-eslint"),
      extends: resolveModules("formatting", "es6-format"),
      overrides: [
        {
          files: ["*.ts", "*.tsx"],
          parser: require.resolve("@typescript-eslint/parser"),
          // Extends doesn't work in overrides, so we add rules directly
          rules: require("./src/typescript.js").rules
        }
      ]
    },
    node: {
      parser: require.resolve("babel-eslint"),
      extends: resolveModules("node")
    },
    legacy: {
      env: {
        browser: true,
        amd: true
      },
      extends: resolveModules("formatting", "best-practices"),
      rules: {
        "no-dupe-keys": "error"
      }
    },
    recommended: {
      parser: require.resolve("babel-eslint"),
      env: {
        browser: true,
        amd: true
      },
      extends: resolveModules(
        "formatting",
        "best-practices",
        "es6-format",
        "es6-recommended",
        "react"
      ),
      overrides: [
        {
          files: ["*.ts", "*.tsx"],
          parser: require.resolve("@typescript-eslint/parser"),

          // Extends doesn't work in overrides, so we add rules directly
          rules: Object.assign(
            {},
            require("./src/typescript.js").rules,
            require("./src/typescript-best-practices.js").rules
          )
        }
      ]
    }
  },
  rules: require("./rules")
};
