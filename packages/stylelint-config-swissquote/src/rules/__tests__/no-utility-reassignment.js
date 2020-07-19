/* global describe, it, expect */
var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-utility-reassignment");

describe("tests for no-utility-reassignment", () => {
  it("works on non-utility", async () => {
    const t = await createRuleTester.test(rule, ".somethingElse {}");
    expect(t).toEqual([]);
  });

  it("works on simple utility", async () => {
    const t = await createRuleTester.test(rule, ".u-okayDude {}");
    expect(t).toEqual([]);
  });

  it("works on simple utility", async () => {
    const t = await createRuleTester.test(rule, ".u-test {}");
    expect(t).toEqual([]);
  });

  it("Fails on utility with ID", async () => {
    const t = await createRuleTester.test(rule, "#something.u-test {}");
    expect(t).toEqual([
      {
        column: 11,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on scoped utility", async () => {
    const t = await createRuleTester.test(
      rule,
      ".s-something .u-someUtility {}"
    );
    expect(t).toEqual([
      {
        column: 14,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on utility with type", async () => {
    const t = await createRuleTester.test(rule, "body .u-other {}");
    expect(t).toEqual([
      {
        column: 6,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on nested utility", async () => {
    const t = await createRuleTester.test(rule, "body { .u-other {} }");
    expect(t).toEqual([
      {
        column: 13,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on sub-assignment", async () => {
    const t = await createRuleTester.test(rule, ".u-other a {}");
    expect(t).toEqual([
      {
        column: 1,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });
});
