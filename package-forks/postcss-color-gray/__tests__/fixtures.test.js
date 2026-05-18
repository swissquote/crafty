import { test } from "node:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import { expect } from "expect";

import plugin from "../index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function fixturePath(name) {
  return join(__dirname, "fixtures", `${name}.css`);
}

function readFixture(name) {
  return readFileSync(fixturePath(name), "utf8");
}

function testFixture(name, pluginOpts = {}, postcssOpts = {}) {
  postcssOpts.from = fixturePath(name);
  let expected = readFixture(`${name}.expect`);
  return postcss([plugin(pluginOpts)])
    .process(readFixture(name), postcssOpts)
    .then((result) => {
      expect(result.css).toEqual(expected);
      expect(result.warnings().length).toBe(0);
    });
}

test("Transforms gray()", () => {
  return testFixture("basic");
});

test("Transforms gray(), preserve original", () => {
  return testFixture("basic-preserve", { preserve: true });
});
