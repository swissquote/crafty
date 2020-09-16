/* global describe, it, expect */
var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-negative-var");

describe("no-negative-var", () => {
  it("normal vars don't trigger", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Component1 { margin: var(--test); }"
    );
    expect(t).toEqual([]);
  });

  it("negative vars fail", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Component1 { margin: -var(--test); }"
    );
    expect(t).toEqual([
      {
        column: 23,
        line: 1,
        text: `Using "-" in front of "var()" doesn't work, use "calc(var(...) * -1)".`
      }
    ]);
  });
});
