/* global describe, it, expect */
/* eslint-disable @swissquote/swissquote/sonarjs/no-identical-functions */
var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-type-outside-scope");

describe("tests for no-type-outside-scope", () => {
  it("works on class", async () => {
    const t = await createRuleTester.test(rule, ".somethingElse {}");
    expect(t).toEqual([]);
  });

  it("works on id", async () => {
    const t = await createRuleTester.test(rule, "#someId {}");
    expect(t).toEqual([]);
  });

  it("works on mixed, class-id", async () => {
    const t = await createRuleTester.test(rule, ".someClass #someId {}");
    expect(t).toEqual([]);
  });

  it("works on mixed, id-class", async () => {
    const t = await createRuleTester.test(rule, "#someId .someClass {}");
    expect(t).toEqual([]);
  });

  it("works on mixed, idclass", async () => {
    const t = await createRuleTester.test(rule, "#someId.someClass {}");
    expect(t).toEqual([]);
  });

  it("works on nested with parent selector", async () => {
    const t = await createRuleTester.test(rule, "section { .s-scope & {} }");
    expect(t).toEqual([]);
  });

  it("works on scoped class", async () => {
    const t = await createRuleTester.test(rule, ".s-something h1 {}");
    expect(t).toEqual([]);
  });

  it("works on nested scoped class", async () => {
    const t = await createRuleTester.test(rule, ".s-something { h1 {} }");
    expect(t).toEqual([]);
  });

  it("works on multiple types after scope", async () => {
    const t = await createRuleTester.test(rule, ".s-something ul li {}");
    expect(t).toEqual([]);
  });

  it("Fails on type", async () => {
    const t = await createRuleTester.test(rule, "header {}");
    expect(t).toEqual([
      {
        column: 1,
        line: 1,
        text: rule.messages.rejected,
      },
    ]);
  });

  it("Fails on type with compound class", async () => {
    const t = await createRuleTester.test(rule, "header.class {}");
    expect(t).toEqual([
      {
        column: 1,
        line: 1,
        text: rule.messages.rejected,
      },
    ]);
  });

  it("Fails on type with compund class, nested", async () => {
    const t = await createRuleTester.test(rule, "header { &.class {} }");
    expect(t).toEqual([
      {
        column: 1,
        line: 1,
        text: rule.messages.rejected,
      },
    ]);
  });

  it("Fails on type with class", async () => {
    const t = await createRuleTester.test(rule, "header.class {}");
    expect(t).toEqual([
      {
        column: 1,
        line: 1,
        text: rule.messages.rejected,
      },
    ]);
  });

  it("Fails on class with type", async () => {
    const t = await createRuleTester.test(rule, ".class header {}");
    expect(t).toEqual([
      {
        column: 8,
        line: 1,
        text: rule.messages.rejected,
      },
    ]);
  });

  it("Fails on nested with parent selector", async () => {
    const t = await createRuleTester.test(
      rule,
      "section { .not-a-scope & {} }"
    );
    expect(t).toEqual([
      {
        column: 1,
        line: 1,
        text: rule.messages.rejected,
      },
    ]);
  });

  it("Fails once multiple selectors", async () => {
    const t = await createRuleTester.test(
      rule,
      "header.class, .s-hey header {}"
    );
    expect(t).toEqual([
      {
        column: 1,
        line: 1,
        text: rule.messages.rejected,
      },
    ]);
  });

  it("Fails on multiple selectors 2", async () => {
    const t = await createRuleTester.test(
      rule,
      "header.class {} .s-hey { header {} }"
    );
    expect(t).toEqual([
      {
        column: 1,
        line: 1,
        text: rule.messages.rejected,
      },
    ]);
  });

  it("Fails only once for multiple selectors", async () => {
    // This is a tricky case, here the `a:focus` is the case
    // That should trigger the rule
    // But since we check with the nested elements as well,
    // we must make sure that it reports the error only once
    const t = await createRuleTester.test(
      rule,
      `.Section--news a:focus {
        .MediaObject, .MediaObject__content {
            overflow: visible;
        }
      }`
    );
    expect(t).toEqual([
      {
        column: 16,
        line: 1,
        text: rule.messages.rejected,
      },
    ]);
  });
});
