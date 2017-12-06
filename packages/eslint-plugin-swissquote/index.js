module.exports = {
  configs: {
    format: {
      parser: require.resolve("babel-eslint"),
      extends: require.resolve("./src/formatting.js")
    },
    node: {
      parser: require.resolve("babel-eslint"),
      extends: require.resolve("./src/node.js")
    },
    legacy: {
      env: {
        browser: true,
        amd: true
      },
      extends: ["./src/formatting.js", "./src/best-practices.js"].map(
        require.resolve
      ),
      parserOptions: {
        sourceType: "script"
      },
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
      extends: [
        "./src/formatting.js",
        "./src/best-practices.js",
        "./src/es6.js",
        "./src/react.js"
      ].map(require.resolve)
    }
  },
  rules: require("./rules")
};
