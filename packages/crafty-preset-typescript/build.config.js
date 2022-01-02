const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "typescript-packages",
    externals: {
      // Provided by other Crafty packages
      ...getExternals(),

      // Dependencies of this package
      "@babel/core": "@babel/core",
      "@babel/code-frame": "@babel/code-frame",
      "@babel/helper-module-imports": "@babel/helper-module-imports",
      typescript: "typescript",

      // "readable-stream" is a drop-in replacement of "stream"
      // But its current version is big and outdated
      "readable-stream": "stream",
      "readable-stream/readable": "../../src/Readable.js",
      "readable-stream/passthrough": "../../src/PassThrough.js",
    }
  }
];
