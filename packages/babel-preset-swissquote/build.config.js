const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "babel-packages",
    externals: {
      // Provided by other Crafty packages
      ...getExternals(),

      // Provided by this package
      "caniuse-lite": "caniuse-lite",
      "/caniuse-lite(/.*)/": "caniuse-lite$1",
      "@babel/code-frame": "@babel/code-frame",
      "@babel/generator": "@babel/generator",
      "@babel/traverse": "@babel/traverse",
      "@babel/template": "@babel/template",
      "@babel/types": "@babel/types",
      "@babel/parser": "@babel/parser",
      "@babel/core": "@babel/core",
      "@babel/helper-module-transforms": "@babel/helper-module-transforms",
      "@babel/helper-compilation-targets": "@babel/helper-compilation-targets"
    }
  }
];
