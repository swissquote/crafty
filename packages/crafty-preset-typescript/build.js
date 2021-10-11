#!/usr/bin/env node

const compile = require("../../utils/compile.js");

const externals = {
  "@babel/core": "@babel/core",
  "@babel/code-frame": "@babel/code-frame",
  "@babel/helper-module-imports": "@babel/helper-module-imports",
  typescript: "typescript",
  webpack: "webpack",
  
};

async function main() {
  await compile("./src/typescript-packages.js", "dist/compiled/typescript-packages.js", {
    externals
  });
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
