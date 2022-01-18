#!/usr/bin/env node

const rimraf = require("rimraf");
const compileUtils = require("./compile.js");
const configuration = require(process.cwd() + "/build.config.js");

async function main() {
  // Start with a cleanup
  rimraf.sync(process.cwd() + "/dist/compiled");

  for (const bundle of configuration) {
    if (bundle.name) {
      const name = bundle.name;
      console.log(`${name}\n${'='.repeat(name.length)}`);
      await compileUtils.compile(
        `./src/${name}.js`,
        `dist/compiled/${name}.js`,
        bundle
      );
      continue;
    }

    await bundle(compileUtils);
  }
}

main().then(
  () => {
    console.log("Success");
  },
  (e) => {
    console.error("Failed", e);
    process.exit(1);
  }
);
