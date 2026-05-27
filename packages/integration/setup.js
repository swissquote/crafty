import { expect } from "vitest";
import fs from "node:fs";

expect.extend({
  toExist(received) {
    const { isNot } = this;
    return {
      pass: fs.existsSync(received),
      message: () =>
        `${received} ${
          isNot ? " exists but should not" : " does not exist but should"
        }`
    };
  }
});
