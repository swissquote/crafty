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
    builder("typescript-packages")
      .packages((pkgBuilder) =>
        pkgBuilder
          .package("@onigoetz/gulp-typescript", "gulpTypescript")
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
    // Would be needed as fallback by fork-ts-checker-webpack-plugin if no `typescriptPath` is provided
    await fs.promises.unlink(
      "dist/fork-ts-checker-webpack-plugin/typescript.js"
    );

    const tsBundle = "dist/typescript-packages/bundled.js";

    // Fix path to .ts-jest-digest
    const fileBuffer = await fs.promises.readFile(tsBundle);
    const fileBufferEdited = replace(fileBuffer, "../../../.ts-jest-digest", ".ts-jest-digest");
    await fs.promises.writeFile(tsBundle, fileBufferEdited);

    // Create a new digest for ts-jest
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBufferEdited);
    await fs.promises.writeFile("dist/typescript-packages/.ts-jest-digest", hashSum.digest("hex"));
  },
  (builder) =>
    builder("ts-checker-rspack-plugin")
      .packages((pkgBuilder) =>
        pkgBuilder
          .package(
            "ts-checker-rspack-plugin",
            "tsCheckerRspackPlugin"
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
    // Would be needed as fallback by ts-checker-rspack-plugin if no `typescriptPath` is provided
    await fs.promises.unlink(
      "dist/ts-checker-rspack-plugin/typescript.js"
    );

    fs.copyFileSync(
      require.resolve("ts-checker-rspack-plugin/lib/getIssuesWorker.js"),
      "dist/ts-checker-rspack-plugin/getIssuesWorker.js"
    );

    fs.copyFileSync(
      require.resolve("ts-checker-rspack-plugin/lib/getDependenciesWorker.js"),
      "dist/ts-checker-rspack-plugin/getDependenciesWorker.js"
    );

    const tsBundle = "dist/ts-checker-rspack-plugin/bundled.js";

    // Create a new digest for ts-jest
    const fileBuffer = await fs.promises.readFile(tsBundle);

    // Add path to files
    const fileBufferEdited = replace(
      fileBuffer,
      "var __nested_webpack_require_18__ = {};",
      "var __nested_webpack_require_18__ = {ab: `${__dirname}/`};"
    );

    const { version } = require("ts-checker-rspack-plugin/package.json");

    const fileBufferEdited2 = replace(
      fileBufferEdited,
      "const pkgJson = JSON.parse((0, external_node_fs_namespaceObject.readFileSync)(external_node_path_namespaceObject.join(__dirname, '../package.json'), 'utf-8'));",
      `const pkgJson = ${JSON.stringify({ version })}`
    );

    await fs.promises.writeFile(tsBundle, fileBufferEdited2);
  },
];
