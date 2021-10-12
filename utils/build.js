#!/usr/bin/env node

const compile = require("./compile.js");
const configuration = require(process.cwd() + "/build.config.js");

async function main() {
  for (const bundle of configuration) {
    const { name, ...options } = bundle;
    await compile(`./src/${name}.js`, `dist/compiled/${name}.js`, options);
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
