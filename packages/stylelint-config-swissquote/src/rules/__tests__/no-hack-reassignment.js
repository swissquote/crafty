const test = require("ava");

var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-hack-reassignment");

  test("works on non-hack", async (t) => {
    const result = await createRuleTester.test(rule, ".somethingElse {}");
    t.deepEqual(result, []);
  });

  test("works on simple hack", async (t) => {
    const result = await createRuleTester.test(rule, "._okayDude {}");
    t.deepEqual(result, []);
  });

  test("works on simple hack 2", async (t) => {
    const result = await createRuleTester.test(rule, "._test {}");
    t.deepEqual(result, []);
  });

  test("Fails on hack with ID", async (t) => {
    const result = await createRuleTester.test(rule, "#something._test {}");
    t.deepEqual(result, [
      {
        column: 11,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  test("Fails on scoped hack", async (t) => {
    const result = await createRuleTester.test(
      rule,
      ".s-something ._someUtility {}"
    );
    t.deepEqual(result, [
      {
        column: 14,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  test("Fails on hack with type", async (t) => {
    const result = await createRuleTester.test(rule, "body ._other {}");
    t.deepEqual(result, [
      {
        column: 6,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  test("Fails on nested hack", async (t) => {
    const result = await createRuleTester.test(rule, "body { ._other {} }");
    t.deepEqual(result, [
      {
        column: 13,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  test("Fails on sub-assignment", async (t) => {
    const result = await createRuleTester.test(rule, "._other a {}");
    t.deepEqual(result, [
      {
        column: 1,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });
