const { getExternals } = require("../../utils/externals");
const fs = require("fs");
const crypto = require("crypto");

const externals = getExternals();

// source-map-js seems to not work with babel:
// Error: original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.
delete externals["source-map"];

function replace(buf, a, b) {
  if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
  const idx = buf.indexOf(a);
  if (idx === -1) return buf;
  if (!Buffer.isBuffer(b)) b = Buffer.from(b);

  const before = buf.slice(0, idx);
  const after = replace(buf.slice(idx + a.length), a, b);
  const len = idx + b.length + after.length;
  return Buffer.concat([before, b, after], len);
}

module.exports = [
  (builder) =>
    builder("fs-extra")
      .externals(externals)
      .package(),
  (builder) => builder("fast-deep-equal").package(),
  (builder) => builder("fast-json-stable-stringify").package(),
  (builder) =>
    builder("rollup-plugin-typescript2")
      .externals({
        // Provided by other Crafty packages
        ...externals,

        "fs-extra": "../fs-extra/index.js",

        typescript: "typescript",
      })
      .package(),
  (builder) =>
    builder("typescript-packages")
      .packages((pkgBuilder) =>
        pkgBuilder
          .package("gulp-typescript", "gulpTypescript")
          .package("ts-jest", "tsJest")
          .package("ts-loader", "tsLoader")
      )
      .externals({
        // Provided by other Crafty packages
        ...externals,

        "fs-extra": "../fs-extra/index.js",
        "fast-deep-equal": "../fast-deep-equal/index.js",
        "fast-json-stable-stringify": "../fast-json-stable-stringify/index.js",

        // Dependencies of this package
        "schema-utils": "schema-utils",
        typescript: "typescript",
      }),
  (builder) =>
    builder("fork-ts-checker-webpack-plugin")
      .packages((pkgBuilder) =>
        pkgBuilder
          .package(
            "fork-ts-checker-webpack-plugin",
            "forkTsCheckerWebpackPlugin"
          )
          .package(
            "fork-ts-checker-webpack-plugin/lib/typescript/worker/get-dependencies-worker.js",
            "forkTsCheckerWebpackPluginWorkerDependencies",
            "dist/fork-ts-checker-webpack-plugin/typescript/worker/get-dependencies-worker.js"
          )
          .package(
            "fork-ts-checker-webpack-plugin/lib/typescript/worker/get-issues-worker.js",
            "forkTsCheckerWebpackPluginWorkerIssues",
            "dist/fork-ts-checker-webpack-plugin/typescript/worker/get-issues-worker.js"
          )
      )
      .externals({
        // Provided by other Crafty packages
        ...externals,

        "fs-extra": "../fs-extra/index.js",
        "fast-deep-equal": "../fast-deep-equal/index.js",
        "fast-json-stable-stringify": "../fast-json-stable-stringify/index.js",

        // Dependencies of this package
        "@babel/core": "@babel/core",
        "@babel/code-frame": "@babel/code-frame",
        "@babel/helper-module-imports": "@babel/helper-module-imports",
        typescript: "typescript",

        cosmiconfig: "../../src/dummy.js",
      }),
  async function() {
    // Remove a compiled version of TypeScript
    // Would be needed as fallback by fork-ts-checker-webpabk-plugin if no `typescriptPath` is provided
    await fs.promises.unlink(
      "dist/fork-ts-checker-webpack-plugin/typescript.js"
    );

    const tsBundle = "dist/typescript-packages/bundled.js";

    // Create a new digest for ts-jest
    const fileBuffer = await fs.promises.readFile(tsBundle);

    // Fix path to .ts-jest-digest
    const fileBufferEdited = replace(fileBuffer, "../../../.ts-jest-digest", "../../.ts-jest-digest");

    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBufferEdited);
    await fs.promises.writeFile(".ts-jest-digest", hashSum.digest("hex"));

    await fs.promises.writeFile(tsBundle, fileBufferEdited);
  },
];
