var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-hack-reassignment");

describe("tests for no-hack-reassignment", () => {
  it("works on non-hack", () =>
    createRuleTester
      .test(rule, ".somethingElse {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works on simple hack", () =>
    createRuleTester
      .test(rule, "._okayDude {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works on simple hack", () =>
    createRuleTester
      .test(rule, "._test {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("Fails on hack with ID", () =>
    createRuleTester.test(rule, "#something._test {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 11,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on scoped hack", () =>
    createRuleTester.test(rule, ".s-something ._someUtility {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 14,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on hack with type", () =>
    createRuleTester.test(rule, "body ._other {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 6,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on nested hack", () =>
    createRuleTester.test(rule, "body { ._other {} }").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 13,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on sub-assignment", () =>
    createRuleTester.test(rule, "._other a {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 1,
        line: 1,
        text: rule.messages.rejected
      })
    ));
});
