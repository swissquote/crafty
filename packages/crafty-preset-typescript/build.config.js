const { getExternals } = require("../../utils/externals");
const fs = require("fs");

const externals = getExternals();

// source-map-js seems to not work with babel:
// Error: original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.
delete externals["source-map"];

module.exports = [
  {
    name: "typescript-packages",
    externals: {
      // Provided by other Crafty packages
      ...externals,

      // Dependencies of this package
      "@babel/core": "@babel/core",
      "@babel/code-frame": "@babel/code-frame",
      "@babel/helper-module-imports": "@babel/helper-module-imports",
      typescript: "typescript",
    },
  },
  {
    name: "fork-ts-checker-webpack-plugin-packages",
    externals: {
      // Provided by other Crafty packages
      ...externals,

      // Dependencies of this package
      "@babel/core": "@babel/core",
      "@babel/code-frame": "@babel/code-frame",
      "@babel/helper-module-imports": "@babel/helper-module-imports",
      typescript: "typescript",
    },
  },
  async function() {
    fs.mkdirSync("dist/compiled/typescript/worker", { recursive: true });

    // Create worker files
    await fs.promises.writeFile(
      "dist/compiled/typescript/worker/get-dependencies-worker.js",
      "module.exports = require('../../fork-ts-checker-webpack-plugin-packages.js').forkTsCheckerWebpackPluginWorkerDependencies();"
    );

    await fs.promises.writeFile(
      "dist/compiled/typescript/worker/get-issues-worker.js",
      "module.exports = require('../../fork-ts-checker-webpack-plugin-packages.js').forkTsCheckerWebpackPluginWorkerIssues();"
    );

    // Remove a compiled version of TypeScript
    // Would be needed as fallback by fork-ts-checker-webpabk-plugin if no `typescriptPath` is provided
    await fs.promises.unlink(
      "dist/compiled/typescript.js",
    );
  },
];
