/* eslint-disable no-await-in-loop */
const fs = require("fs");
const path = require("path");
const { getExternals } = require("../../utils/externals");

const singlePackages = [
  "babel-jest", // writes index.js twice !
  "ci-info",
  "graceful-fs",
  "has-flag",
  "jest-config", // writes index.js twice !
  "jest-get-type",
  "jest-haste-map",
  "jest-regex-util",
  "jest-util",
  "jest-validate",
  "leven",
  "merge-stream",
  "pretty-format",
  "slash",
  "prompts"
];

const externals = 
{
  ...getExternals(),

  // Doesn't seem to compile well
  "jest-resolve": "jest-resolve",
  "ts-node": "ts-node",
  "@babel/preset-typescript": "@babel/preset-typescript",
  "@babel/preset-typescript/package.json": "@babel/preset-typescript/package.json",
  "node-notifier": "node-notifier",

  // Dependency of this package
  "@babel/core": "@babel/core",
  "@babel/code-frame": "@babel/code-frame",

  // Provided by this package
  "jest-worker": "../jest-worker/index.js",
  ...Object.fromEntries(singlePackages.map(pkg => [pkg, `../${pkg}/index.js`])),
}

const jestWorkerDir = path.dirname(require.resolve("jest-worker/package.json"));

module.exports = [
  ...singlePackages.map(pkg => {
    const newExternals = { ...externals };
    delete newExternals[pkg];

    return builder =>
      builder(pkg)
        .package()
        .externals(newExternals);
  }),
  builder =>
   {

    const newExternals = { ...externals };
    delete newExternals["jest-worker"];
    
    return builder("jest-worker")
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
      .externals(newExternals)
    },
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
    builder("jest-cli")
      .package()
      .destination(`dist/jest-cli/main.js`)
      .externals(externals),
];
