const testRule = require("../../testUtils/ruleTester");
const { ruleName, messages } = require("../no-state-without-component");

testRule({
  plugins: ["./index.js"],
  ruleName,
  config: true,

  accept: [
    { description: "works on is state", code: ".Component.is-state {}" },
    { description: "works on has state", code: ".Component.has-state {}" },
    {
      description: "works on nested state",
      code: ".Component { &.has-state {} }"
    },
    {
      description: "works on scoped component",
      code: ".s-something .Component.has-state {}"
    },
    {
      description: "works on long-scoped component",
      code: ".someNamespace-something .Component.has-state {}"
    },
    {
      description: "works on prefixed component",
      code: ".prefixed-Component.has-state {}"
    },
    {
      description: "works on sub-element",
      code: ".Menu__item.has-submenu > .Caret {}"
    },
    {
      description: "works on double state",
      code: ".Menu__item.has-submenu.is-open {}"
    },
    {
      description: "works on component after the state",
      code: ".is-open.Menu__item {}"
    },
    {
      description: "works on complex selectors",
      code: ".Menu--block .Menu__item.has-submenu.is-open > .Caret {}"
    },
    {
      description: "works with :not()",
      code: ".InputDate__placeholder:not(.is-empty) {}"
    }
  ],

  reject: [
    {
      description: "Fails on state on ID",
      code: "#Something.is-state {}",
      line: 1,
      column: 11,
      message: messages.rejected
    },
    {
      description: "Fails on state on ID 2",
      code: "#something.is-state {}",
      line: 1,
      column: 11,
      message: messages.rejected
    },
    {
      description: "Fails on state on scope",
      code: ".s-something.is-state {}",
      line: 1,
      column: 13,
      message: messages.rejected
    },
    {
      description: "Fails on state within scope",
      code: ".s-something .is-state {}",
      line: 1,
      column: 14,
      message: messages.rejected
    },
    {
      description: "Fails on orphan state",
      code: ".is-state {}",
      line: 1,
      column: 1,
      message: messages.rejected
    },
    {
      description: "Fails on orphan state 2",
      code: ".has-state {}",
      line: 1,
      column: 1,
      message: messages.rejected
    }
  ]
});
