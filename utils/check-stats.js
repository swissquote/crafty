#!/usr/bin/env node
const path = require("path");
const file = process.argv[2];

const data = require(path.join(process.cwd(), file));

const incorrectImports = data.modules
  .filter((m) => m.name.indexOf("/packages/") > -1)
  .filter((m) => m.name.indexOf("external ") !== 0)
  .map((m) => `Module "${m.name}" requested by "${m.issuerName}"`);

if (incorrectImports.length > 0) {
  console.log(file);
  console.log("=".repeat(file.length));
  incorrectImports.forEach((m) => {
    console.log(m);
  });
  console.log();
}
