module.exports = {
  presets: ["@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-webpack"],
  js: {
    myBundle: {
      source: "js/script.ts"
    }
  },
  eslint: {
    rules: {
      // Add rules to test eslint-import-resolver-typescript
      "@swissquote/swissquote/import/order": [
        "error",
        {
          alphabetize: { order: "asc", caseInsensitive: true }
        }
      ]
    }
  }
};
