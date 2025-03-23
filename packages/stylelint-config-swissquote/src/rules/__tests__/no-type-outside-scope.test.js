const testRule = require("../../testUtils/ruleTester");
const { ruleName, messages } = require("../no-type-outside-scope");

testRule({
  plugins: ["./index.js"],
  ruleName,
  config: true,

  accept: [
    { description: "works on class", code: ".somethingElse {}" },
    { description: "works on id", code: "#someId {}" },
    { description: "works on mixed, class-id", code: ".someClass #someId {}" },
    { description: "works on mixed, id-class", code: "#someId .someClass {}" },
    { description: "works on mixed, idclass", code: "#someId.someClass {}" },
    {
      description: "works on nested with parent selector",
      code: "section { .s-scope & {} }"
    },
    { description: "works on scoped class", code: ".s-something h1 {}" },
    {
      description: "works on nested scoped class",
      code: ".s-something { h1 {} }"
    },
    {
      description: "works on multiple types after scope",
      code: ".s-something ul li {}"
    }
  ],

  reject: [
    {
      description: "Fails on type",
      code: "header {}",
      column: 1,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on type with compound class",
      code: "header.class {}",
      column: 1,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on type with compund class, nested",
      code: "header { &.class {} }",
      column: 1,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on type with class",
      code: "header.class {}",
      column: 1,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on class with type",
      code: ".class header {}",
      column: 1,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on nested with parent selector",
      code: "section { .not-a-scope & {} }",
      column: 1,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails once multiple selectors",
      code: "header.class, .s-hey header {}",
      column: 1,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on multiple selectors 2",
      code: "header.class {} .s-hey { header {} }",
      column: 1,
      line: 1,
      message: messages.rejected
    },
    {
      // This is a tricky case, here the `a:focus` is the case
      // That should trigger the rule
      // But since we check with the nested elements as well,
      // we must make sure that it reports the error only once
      description: "Fails only once for multiple selectors",
      code: `.Section--news a:focus {
        .MediaObject, .MediaObject__content {
            overflow: visible;
        }
      }`,
      length: 1,
      column: 1,
      line: 1,
      message: messages.rejected
    }
  ]
});
