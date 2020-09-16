/* global describe, it, expect */
var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-hack-reassignment");

describe("no-hack-reassignment", () => {
  it("works on non-hack", async () => {
    const t = await createRuleTester.test(rule, ".somethingElse {}");
    expect(t).toEqual([]);
  });

  it("works on simple hack", async () => {
    const t = await createRuleTester.test(rule, "._okayDude {}");
    expect(t).toEqual([]);
  });

  it("works on simple hack", async () => {
    const t = await createRuleTester.test(rule, "._test {}");
    expect(t).toEqual([]);
  });

  it("Fails on hack with ID", async () => {
    const t = await createRuleTester.test(rule, "#something._test {}");
    expect(t).toEqual([
      {
        column: 11,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on scoped hack", async () => {
    const t = await createRuleTester.test(
      rule,
      ".s-something ._someUtility {}"
    );
    expect(t).toEqual([
      {
        column: 14,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on hack with type", async () => {
    const t = await createRuleTester.test(rule, "body ._other {}");
    expect(t).toEqual([
      {
        column: 6,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on nested hack", async () => {
    const t = await createRuleTester.test(rule, "body { ._other {} }");
    expect(t).toEqual([
      {
        column: 13,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on sub-assignment", async () => {
    const t = await createRuleTester.test(rule, "._other a {}");
    expect(t).toEqual([
      {
        column: 1,
        line: 1,
        text: rule.messages.rejected
      }
    ]);
  });
});
