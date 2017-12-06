var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-state-without-component");

describe("tests for no-state-without-component", () => {
  it("works on is state", () =>
    createRuleTester
      .test(rule, ".Component.is-state {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));
  it("works on has state", () =>
    createRuleTester
      .test(rule, ".Component.has-state {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));
  it("works on nested state", () =>
    createRuleTester
      .test(rule, ".Component { &.has-state {} }")
      .then(t => expect(t).toEqual({ warnings: 0 })));
  it("works on scoped component", () =>
    createRuleTester
      .test(rule, ".s-something .Component.has-state {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));
  it("works on long-scoped component", () =>
    createRuleTester
      .test(rule, ".someNamespace-something .Component.has-state {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));
  it("works on prefixed component", () =>
    createRuleTester
      .test(rule, ".prefixed-Component.has-state {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));
  it("works on sub-element", () =>
    createRuleTester
      .test(rule, ".Menu__item.has-submenu > .Caret {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));
  it("works on double state", () =>
    createRuleTester
      .test(rule, ".Menu__item.has-submenu.is-open {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));
  it("works on component after the state", () =>
    createRuleTester
      .test(rule, ".is-open.Menu__item {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works on complex selectors", () =>
    createRuleTester
      .test(rule, ".Menu--block .Menu__item.has-submenu.is-open > .Caret {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("works with :not()", () =>
    createRuleTester
      .test(rule, ".InputDate__placeholder:not(.is-empty) {}")
      .then(t => expect(t).toEqual({ warnings: 0 })));

  it("Fails on state on ID", () =>
    createRuleTester.test(rule, "#Something.is-state {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        line: 1,
        column: 11,
        text: rule.messages.rejected
      })
    ));

  it("Fails on state on ID", () =>
    createRuleTester.test(rule, "#something.is-state {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        line: 1,
        column: 11,
        text: rule.messages.rejected
      })
    ));

  it("Fails on state on scope", () =>
    createRuleTester.test(rule, ".s-something.is-state {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        line: 1,
        column: 13,
        text: rule.messages.rejected
      })
    ));

  it("Fails on state within scope", () =>
    createRuleTester.test(rule, ".s-something .is-state {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        line: 1,
        column: 14,
        text: rule.messages.rejected
      })
    ));

  it("Fails on orphan state", () =>
    createRuleTester.test(rule, ".is-state {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        line: 1,
        column: 1,
        text: rule.messages.rejected
      })
    ));

  it("Fails on orphan state", () =>
    createRuleTester.test(rule, ".has-state {}").then(t =>
      expect(t).toEqual({
        warnings: 1,
        line: 1,
        column: 1,
        text: rule.messages.rejected
      })
    ));
});
