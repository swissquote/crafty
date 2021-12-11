module.exports = [
  {
    name: "packages-eslint",
    externals: {
      // Provided by this package
      "typescript": "typescript",
      "prettier": "prettier",
      "eslint": "eslint",
      "eslint/use-at-your-own-risk": "eslint/use-at-your-own-risk",
      "eslint/package.json": "eslint/package.json",
      "/eslint\/lib(/.*)/": "eslint/lib$1",

      // Provided by other Crafty package
      "debug": "@swissquote/crafty-commons/packages/debug",
      "glob": "@swissquote/crafty-commons/packages/glob",
      "picomatch": "@swissquote/crafty-commons/packages/picomatch",
      "micromatch": "@swissquote/crafty-commons/packages/micromatch",
      "minimatch": "@swissquote/crafty-commons/packages/minimatch",
      semver: "@swissquote/crafty-commons/packages/semver",

      // Replace a function that can be optimized
      "./report": "../../src/shims/eslint-plugin-react_report.js",
      "../util/report": "../../src/shims/eslint-plugin-react_report.js"
    }
  },
];
