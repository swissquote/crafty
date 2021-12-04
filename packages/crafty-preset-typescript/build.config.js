
module.exports = [
  {
    name: "typescript-packages",
    externals: {
      // Dependencies of this package
      "@babel/core": "@babel/core",
      "@babel/code-frame": "@babel/code-frame",
      "@babel/helper-module-imports": "@babel/helper-module-imports",
      typescript: "typescript",

      // Provided by other Crafty packages
      glob: "@swissquote/crafty-commons/packages/glob",
      webpack: "@swissquote/crafty-runner-webpack/packages/webpack",
    }
  }
];
