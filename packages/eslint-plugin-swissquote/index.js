function resolveModules(...args) {
  return args.map(arg => require.resolve(`./src/${arg}.js`));
}

const parserOptions = {
  ecmaVersion: "latest",
  ecmaFeatures: {
    jsx: true
  }
};

module.exports = {
  configs: {
    format: {
      parserOptions,
      extends: resolveModules("formatting", "es6-format"),
      overrides: [
        {
          files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
          parser: require.resolve("./packages/typescript-eslint_parser.js"),
          // Extends doesn't work in overrides, so we add rules directly
          rules: require("./src/typescript.js").rules
        }
      ]
    },
    node: {
      parserOptions,
      extends: resolveModules("node"),
      overrides: [
        {
          files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
          parser: require.resolve("./packages/typescript-eslint_parser.js")
        }
      ]
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
      parserOptions,
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
          files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
          parser: require.resolve("./packages/typescript-eslint_parser.js"),
          // TODO: Figure out what's needed to get this to work properly
          /*parserOptions: {
            project: true
          },*/

          // Extends doesn't work in overrides, so we add rules directly
          rules: {
            ...require("./src/typescript.js").rules,
            ...require("./src/typescript-best-practices.js").rules,
            // This rule is handled by TypeScript and has false positives
            // https://github.com/jsx-eslint/eslint-plugin-react/issues/3325
            "@swissquote/swissquote/react/prop-types": "off"
          }
        }
      ]
    }
  },
  rules: require("./rules")
};
