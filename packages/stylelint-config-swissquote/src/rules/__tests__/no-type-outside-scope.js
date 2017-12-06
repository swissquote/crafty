var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-type-outside-scope");

describe("tests for no-type-outside-scope", () => {
  it("works on class", () =>
    createRuleTester
      .test(rule, ".somethingElse {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works on id", () =>
    createRuleTester
      .test(rule, "#someId {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works on mixed, class-id", () =>
    createRuleTester
      .test(rule, ".someClass #someId {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works on mixed, id-class", () =>
    createRuleTester
      .test(rule, "#someId .someClass {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works on mixed, idclass", () =>
    createRuleTester
      .test(rule, "#someId.someClass {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works on scoped class", () =>
    createRuleTester
      .test(rule, ".s-something h1 {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works on nested scoped class", () =>
    createRuleTester
      .test(rule, ".s-something { h1 {} }")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works on multiple types after scope", () =>
    createRuleTester
      .test(rule, ".s-something ul li {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("Fails on type", () =>
    createRuleTester.test(rule, "header {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 1,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on type with compound class", () =>
    createRuleTester.test(rule, "header.class {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 1,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on type with compund class, nested", () =>
    createRuleTester.test(rule, "header { &.class {} }").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 10,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on type with class", () =>
    createRuleTester.test(rule, "header.class {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 1,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on class with type", () =>
    createRuleTester.test(rule, ".class header {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 1,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on multiple selectors", () =>
    createRuleTester.test(rule, "header.class, .s-hey header {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 1,
        line: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on multiple selectors 2", () =>
    createRuleTester.test(rule, "header.class, .s-hey { header {} }").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 24,
        line: 1,
        text: rule.messages.rejected
      })
    ));
});
