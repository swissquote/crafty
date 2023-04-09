/* eslint-disable no-await-in-loop */
const fs = require("fs");
const path = require("path");
const { getExternals } = require("../../utils/externals");

const externals = getExternals();

const jestWorkerDir = path.dirname(require.resolve("jest-worker/package.json"));

module.exports = [
  builder =>
    builder("jest-util")
      .package()
      .externals(externals),
  builder =>
    builder("jest-worker")
      .packages(pkgBuilder => {
        pkgBuilder
          .package("jest-worker", "jestWorker")
          .package(
            path.join(jestWorkerDir, "build/types.js"),
            "jestWorkerTypes",
            "dist/jest-worker/types.js"
          );
      })
      .options({ sourceMap: false })
      .externals(externals),
  async (builder, utils) => {
    await fs.promises.writeFile(
      "dist/jest-worker/index.js",
      `const { Worker } = require("./bundled.js").jestWorker(); module.exports = { default: Worker, Worker }; `
    );

    //await fs.promises.mkdir("dist/jest-worker/workers");

    const workers = ["processChild.js", "threadChild.js"];

    for (const worker of workers) {
      const content = await fs.promises.readFile(
        path.join(jestWorkerDir, "build/workers", worker),
        "utf8"
      );

      const tmpWorkerFile = path.join(
        jestWorkerDir,
        "build/workers",
        `${worker}.tmp.js`
      );

      await fs.promises.writeFile(
        tmpWorkerFile,
        content.replace(/require\(file\)/g, "__non_webpack_require__(file)")
      );

      await utils.compile(
        path.relative(__dirname, tmpWorkerFile),
        `dist/jest-worker/out/${worker}`,
        {
          name: `jest-worker-${worker}`,
          externals: {
            ...externals,
            "../types": "./types.js",
            "jest-util": "../jest-util/index.js"
          },
          sourceMap: false
        }
      );

      await fs.promises.rename(
        path.join(__dirname, "dist/jest-worker/out", worker),
        path.join(__dirname, "dist/jest-worker", worker)
      );

      await fs.promises.rename(
        path.join(
          __dirname,
          "dist/jest-worker/out",
          `jest-worker-${worker}-stats.json`
        ),
        path.join(
          __dirname,
          "dist/jest-worker",
          `jest-worker-${worker}-stats.json`
        )
      );
    }
    await fs.promises.rmdir(path.join(__dirname, "dist/jest-worker/out"));
  },

  builder =>
    builder("rollup-plugin-terser")
      .package()
      .externals({
        ...externals,
        "jest-worker": "../jest-worker/index.js"
      }),

  async (builder, utils) => {
    // transform.js in rollup-plugin-terser still has a reference to "terser"
    // This changes it to @swissquote/crafty-preset-terser
    const terserTransform = "dist/rollup-plugin-terser/transform.js";

    const content = await fs.promises.readFile(terserTransform, {
      encoding: "utf-8"
    });

    await fs.promises.writeFile(
      terserTransform,
      content.replace(
        'require("terser")',
        'require("@swissquote/crafty-preset-terser/dist/terser")'
      )
    );
  },

  builder =>
    builder("rollup-packages").externals({
      // Provided by other Crafty packages
      ...externals,

      // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends
      fsevents: "fsevents"
    })
];
