var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-utility-reassignment");

describe("tests for no-utility-reassignment", () => {
  it("works on non-utility", () =>
    createRuleTester
      .test(rule, ".somethingElse {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works on simple utility", () =>
    createRuleTester
      .test(rule, ".u-okayDude {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works on simple utility", () =>
    createRuleTester
      .test(rule, ".u-test {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("Fails on utility with ID", () =>
    createRuleTester.test(rule, "#something.u-test {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 11,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on scoped utility", () =>
    createRuleTester.test(rule, ".s-something .u-someUtility {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 14,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on utility with type", () =>
    createRuleTester.test(rule, "body .u-other {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 6,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on nested utility", () =>
    createRuleTester.test(rule, "body { .u-other {} }").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 13,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on sub-assignment", () =>
    createRuleTester.test(rule, ".u-other a {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 1,
        line: 1,
        text: rule.messages.rejected
      })
    ));
});
