module.exports = [
  {
    name: "packages-eslint",
    externals: {
      // Provided by this package
      typescript: "typescript",
      prettier: "prettier",
      eslint: "eslint",
      "eslint/use-at-your-own-risk": "eslint/use-at-your-own-risk",
      "eslint/package.json": "eslint/package.json",
      "/eslint/lib(/.*)/": "eslint/lib$1",

      // Provided by other Crafty package
      debug: "@swissquote/crafty-commons/packages/debug",
      "find-up": "@swissquote/crafty-commons/packages/find-up",
      "object-keys": "@swissquote/crafty-commons/packages/object-keys",
      "object.assign": "@swissquote/crafty-commons/packages/object-assign",
      glob: "@swissquote/crafty-commons/packages/glob",
      picomatch: "@swissquote/crafty-commons/packages/picomatch",
      micromatch: "@swissquote/crafty-commons/packages/micromatch",
      minimatch: "@swissquote/crafty-commons/packages/minimatch",
      semver: "@swissquote/crafty-commons/packages/semver",

      // Replace functions that can be optimized
      "./report": "../../src/shims/eslint-plugin-react_report.js",
      "../util/report": "../../src/shims/eslint-plugin-react_report.js",

      // Replace polyfills that aren't needed
      "array-includes": "../../src/shims/array-includes.js",
      "array.prototype.flat": "../../src/shims/array-prototype-flat.js",
      "array.prototype.flatmap": "../../src/shims/array-prototype-flatmap.js",
      "object.entries": "../../src/shims/object-entries.js",
      "object.fromentries": "../../src/shims/object-fromentries.js",
      "object.fromentries/polyfill":
        "../../src/shims/object-fromentries-polyfill.js",
      "object.hasown/polyfill": "../../src/shims/object-hasown-polyfill.js",
      "object.values": "../../src/shims/object-values.js",
      "string.prototype.matchall":
        "../../src/shims/string-prototype-matchall.js"
    }
  }
];
