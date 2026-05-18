import { test } from "node:test";
import { expect } from "expect";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import postcss from "postcss";
import plugin from "../index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function filename(name) {
  return __dirname + "/" + name + ".css";
}

function read(name) {
  return readFileSync(name, "utf8");
}

function compareFixtures(name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {};
  postcssOpts.from = filename("fixtures/" + name);
  opts = opts || {};

  return postcss([plugin(opts)])
    .process(read(postcssOpts.from), postcssOpts)
    .then((result) => {
      const expected = read(filename("fixtures/" + name + ".expected"));
      const actual = result.css;
      expect(actual).toEqual(expected);
    });
}

test("hwb", () => {
  return compareFixtures("hwb", "should transform hwb");
});

test("hwb Colors Level 4", () => {
  return compareFixtures("hwb-4", "should transform hwb");
});
