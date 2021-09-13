#!/usr/bin/env node

const compile = require("../../utils/compile.js");

const externals = [
  "assets",
  "browserslist",
  "caniuse-lite" // caniuse-lite will still be imported by autoprefixer
];

async function main() {
  await compile(
    "./src/postcss-packages.js",
    "dist/compiled/postcss-packages.js",
    { externals }
  );
}

main().then(
  () => {
    console.log("Success");
  },
  e => {
    console.error("Failed", e);
    process.exit(1);
  }
);
