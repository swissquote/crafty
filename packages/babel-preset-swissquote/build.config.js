module.exports = [
  {
    name: "babel-packages",
    externals: {
      // Browserslist (post-css plugins)
      browserslist: "browserslist",
      "caniuse-lite": "caniuse-lite", // FIXME: `autoprefixer` will still bundle this because it uses direct imports
      "caniuse-lite/data/features/border-radius":
        "caniuse-lite/data/features/border-radius",
      "caniuse-lite/data/features/css-featurequeries.js":
        "caniuse-lite/data/features/css-featurequeries",

      chalk: "chalk",

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
