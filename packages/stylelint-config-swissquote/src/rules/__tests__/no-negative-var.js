const test = require("ava");

var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-negative-var");

  test("normal vars don't trigger", async (t) => {
    const result = await createRuleTester.test(
      rule,
      ".Component1 { margin: var(--test); }"
    );
    t.deepEqual(result, []);
  });

  test("negative vars fail", async (t) => {
    const result = await createRuleTester.test(
      rule,
      ".Component1 { margin: -var(--test); }"
    );
    t.deepEqual(result, [
      {
        column: 23,
        line: 1,
        text: `Using "-" in front of "var()" doesn't work, use "calc(var(...) * -1)".`
      }
    ]);
  });

  test("negative var fails on multi vars", async (t) => {
    const result = await createRuleTester.test(
      rule,
      ".Component1 { margin: var(--Component-margin) -var(--Component-margin); }"
    );
    t.deepEqual(result, [
      {
        column: 47,
        line: 1,
        text: `Using "-" in front of "var()" doesn't work, use "calc(var(...) * -1)".`
      }
    ]);
  });
