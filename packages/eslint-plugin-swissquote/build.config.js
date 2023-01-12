const { getExternals } = require("../../utils/externals");

module.exports = [
  builder =>
    builder("packages-eslint").externals({
      // Provided by this package
      typescript: "typescript",
      "typescript/package.json": "typescript/package.json",
      prettier: "prettier",
      eslint: "eslint",
      "eslint/use-at-your-own-risk": "eslint/use-at-your-own-risk",
      "eslint/package.json": "eslint/package.json",
      "/eslint/lib(/.*)/": "eslint/lib$1",

      // Provided by other Crafty package
      ...getExternals(),

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
    })
];
