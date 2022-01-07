const test = require("ava");

var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-state-without-component");

  test("works on is state", async (t) => {
    const result = await createRuleTester.test(rule, ".Component.is-state {}");
    t.deepEqual(result, []);
  });
  test("works on has state", async (t) => {
    const result = await createRuleTester.test(rule, ".Component.has-state {}");
    t.deepEqual(result, []);
  });
  test("works on nested state", async (t) => {
    const result = await createRuleTester.test(
      rule,
      ".Component { &.has-state {} }"
    );
    t.deepEqual(result, []);
  });
  test("works on scoped component", async (t) => {
    const result = await createRuleTester.test(
      rule,
      ".s-something .Component.has-state {}"
    );
    t.deepEqual(result, []);
  });
  test("works on long-scoped component", async (t) => {
    const result = await createRuleTester.test(
      rule,
      ".someNamespace-something .Component.has-state {}"
    );
    t.deepEqual(result, []);
  });
  test("works on prefixed component", async (t) => {
    const result = await createRuleTester.test(
      rule,
      ".prefixed-Component.has-state {}"
    );
    t.deepEqual(result, []);
  });
  test("works on sub-element", async (t) => {
    const result = await createRuleTester.test(
      rule,
      ".Menu__item.has-submenu > .Caret {}"
    );
    t.deepEqual(result, []);
  });
  test("works on double state", async (t) => {
    const result = await createRuleTester.test(
      rule,
      ".Menu__item.has-submenu.is-open {}"
    );
    t.deepEqual(result, []);
  });
  test("works on component after the state", async (t) => {
    const result = await createRuleTester.test(rule, ".is-open.Menu__item {}");
    t.deepEqual(result, []);
  });

  test("works on complex selectors", async (t) => {
    const result = await createRuleTester.test(
      rule,
      ".Menu--block .Menu__item.has-submenu.is-open > .Caret {}"
    );
    t.deepEqual(result, []);
  });

  test("works with :not()", async (t) => {
    const result = await createRuleTester.test(
      rule,
      ".InputDate__placeholder:not(.is-empty) {}"
    );
    t.deepEqual(result, []);
  });

  test("Fails on state on ID", async (t) => {
    const result = await createRuleTester.test(rule, "#Something.is-state {}");
    t.deepEqual(result, [
      {
        line: 1,
        column: 11,
        text: rule.messages.rejected
      }
    ]);
  });

  test("Fails on state on ID 2", async (t) => {
    const result = await createRuleTester.test(rule, "#something.is-state {}");
    t.deepEqual(result, [
      {
        line: 1,
        column: 11,
        text: rule.messages.rejected
      }
    ]);
  });

  test("Fails on state on scope", async (t) => {
    const result = await createRuleTester.test(rule, ".s-something.is-state {}");
    t.deepEqual(result, [
      {
        line: 1,
        column: 13,
        text: rule.messages.rejected
      }
    ]);
  });

  test("Fails on state within scope", async (t) => {
    const result = await createRuleTester.test(rule, ".s-something .is-state {}");
    t.deepEqual(result, [
      {
        line: 1,
        column: 14,
        text: rule.messages.rejected
      }
    ]);
  });

  test("Fails on orphan state", async (t) => {
    const result = await createRuleTester.test(rule, ".is-state {}");
    t.deepEqual(result, [
      {
        line: 1,
        column: 1,
        text: rule.messages.rejected
      }
    ]);
  });

  test("Fails on orphan state 2", async (t) => {
    const result = await createRuleTester.test(rule, ".has-state {}");
    t.deepEqual(result, [
      {
        line: 1,
        column: 1,
        text: rule.messages.rejected
      }
    ]);
  });
