import { test } from "node:test";
import { expect } from "expect";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const tests = require("./fixtures/color.json");

import Color from "../lib/color.js";

function stringifyTest(seed, calls) {
  let output = `${JSON.stringify(seed)}`;

  for (const [name, args, retVal] of calls) {
    output += ` ${name}(${args.join(", ")}) => ${JSON.stringify(retVal)}`;
  }

  return output;
}

for (const [seed, ...calls] of tests) {
  test(stringifyTest(seed, calls), () => {
    const color = new Color(seed);

    for (const [name, args, retVal] of calls) {
      const result = color[name].apply(color, args);

      const strigified = typeof result === "object" ? result.toString() : result;

      expect(strigified).toEqual(retVal);
    }
  });
}
