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
      "plugin-error" : "@swissquote/crafty-commons-gulp/packages/plugin-error",
      webpack: "@swissquote/crafty-runner-webpack/packages/webpack",
      micromatch: "@swissquote/crafty-commons/packages/micromatch",
      picomatch: "@swissquote/crafty-commons/packages/picomatch",

      // "readable-stream" is a drop-in replacement of "stream"
      // But its current version is big and outdated
      "readable-stream": "stream",
      "readable-stream/readable": "../../src/Readable.js",
      "readable-stream/passthrough": "../../src/PassThrough.js",
    }
  }
];
