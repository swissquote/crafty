var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-state-without-component");

describe("tests for no-state-without-component", () => {
  it("works on is state", async () => {
    const t = await createRuleTester.test(rule, ".Component.is-state {}");
    expect(t).toEqual([]);
  });
  it("works on has state", async () => {
    const t = await createRuleTester.test(rule, ".Component.has-state {}");
    expect(t).toEqual([]);
  });
  it("works on nested state", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Component { &.has-state {} }"
    );
    expect(t).toEqual([]);
  });
  it("works on scoped component", async () => {
    const t = await createRuleTester.test(
      rule,
      ".s-something .Component.has-state {}"
    );
    expect(t).toEqual([]);
  });
  it("works on long-scoped component", async () => {
    const t = await createRuleTester.test(
      rule,
      ".someNamespace-something .Component.has-state {}"
    );
    expect(t).toEqual([]);
  });
  it("works on prefixed component", async () => {
    const t = await createRuleTester.test(
      rule,
      ".prefixed-Component.has-state {}"
    );
    expect(t).toEqual([]);
  });
  it("works on sub-element", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Menu__item.has-submenu > .Caret {}"
    );
    expect(t).toEqual([]);
  });
  it("works on double state", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Menu__item.has-submenu.is-open {}"
    );
    expect(t).toEqual([]);
  });
  it("works on component after the state", async () => {
    const t = await createRuleTester.test(rule, ".is-open.Menu__item {}");
    expect(t).toEqual([]);
  });

  it("works on complex selectors", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Menu--block .Menu__item.has-submenu.is-open > .Caret {}"
    );
    expect(t).toEqual([]);
  });

  it("works with :not()", async () => {
    const t = await createRuleTester.test(
      rule,
      ".InputDate__placeholder:not(.is-empty) {}"
    );
    expect(t).toEqual([]);
  });

  it("Fails on state on ID", async () => {
    const t = await createRuleTester.test(rule, "#Something.is-state {}");
    expect(t).toEqual([
      {
        line: 1,
        column: 11,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on state on ID", async () => {
    const t = await createRuleTester.test(rule, "#something.is-state {}");
    expect(t).toEqual([
      {
        line: 1,
        column: 11,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on state on scope", async () => {
    const t = await createRuleTester.test(rule, ".s-something.is-state {}");
    expect(t).toEqual([
      {
        line: 1,
        column: 13,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on state within scope", async () => {
    const t = await createRuleTester.test(rule, ".s-something .is-state {}");
    expect(t).toEqual([
      {
        line: 1,
        column: 14,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on orphan state", async () => {
    const t = await createRuleTester.test(rule, ".is-state {}");
    expect(t).toEqual([
      {
        line: 1,
        column: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  it("Fails on orphan state", async () => {
    const t = await createRuleTester.test(rule, ".has-state {}");
    expect(t).toEqual([
      {
        line: 1,
        column: 1,
        text: rule.messages.rejected
      }
    ]);
  });
});
