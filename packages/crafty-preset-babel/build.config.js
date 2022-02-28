const { getExternals } = require("../../utils/externals");

const externals = getExternals();

// source-map-js seems to not work with babel:
// Error: original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.
delete externals["source-map"];

module.exports = [
  (builder) => builder("babel-packages").externals({
    // Provided by other Crafty packages
    ...externals,

    // Dependencies of this package
    "@babel/core": "@babel/core",
    "@babel/code-frame": "@babel/code-frame",
    "@babel/helper-module-imports": "@babel/helper-module-imports"
  })
];
