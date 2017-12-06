#!/usr/bin/env node

// Ensure `rejectUnauthorized=false` is in `.typingsrc`
const fs = require("fs");

const file = `${process.cwd()}/.typingsrc`;
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file);

  // Is the file in JSON ?
  if (/^\s*{/.test(content)) {
    const parsed = JSON.parse(content);
    parsed.rejectUnauthorized = false;
    fs.writeFileSync(file, JSON.stringify(parsed));
  } else {
    const regex = /^\s*?rejectUnauthorized\s*?=\s*?false/m;

    if (regex.exec(content) === null) {
      fs.writeFileSync(file, `${content}\n#Added automatically by SQ-Gulp\nrejectUnauthorized=false\n`);
    }
  }

} else {
  fs.writeFileSync(file, "#Added automatically by SQ-Gulp\nrejectUnauthorized=false\n");
}

require("typings/dist/bin");
