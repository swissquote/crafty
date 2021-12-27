module.exports = [
  {
    name: "eslint-packages",
    externals: {
      "eslint": "eslint",
      "ajv": "ajv",

      picomatch: "@swissquote/crafty-commons/packages/picomatch",
      micromatch: "@swissquote/crafty-commons/packages/micromatch"
    }
  },
];
