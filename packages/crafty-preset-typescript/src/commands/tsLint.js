#!/usr/bin/env node

const createTempFile = require("../utils").createTempFile;

const tmpfile = createTempFile(JSON.stringify(global.craftyConfig.tslint));

// TODO :: merge config files if one is provided
process.argv.push("--config");
process.argv.push(tmpfile);

if (process.argv.indexOf("--format") === -1) {
  process.argv.push("--format");
  process.argv.push("stylish");
}

require("tslint/bin/tslint");
