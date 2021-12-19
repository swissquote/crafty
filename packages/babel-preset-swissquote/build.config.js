module.exports = [
  {
    name: "babel-packages",
    externals: {
      // Browserslist (post-css plugins)
      browserslist: "@swissquote/crafty-commons/packages/browserslist",
      glob: "@swissquote/crafty-commons/packages/glob",
      minimatch: "@swissquote/crafty-commons/packages/minimatch",
      semver: "@swissquote/crafty-commons/packages/semver",
      "semver/functions/cmp": "@swissquote/crafty-commons/packages/semver-cmp",
      "semver/functions/coerce":
        "@swissquote/crafty-commons/packages/semver-coerce",

      "caniuse-lite": "caniuse-lite",
      "/caniuse-lite(/.*)/": "caniuse-lite$1",

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
