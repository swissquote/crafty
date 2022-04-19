const testRule = require("../../testUtils/ruleTester");
const { ruleName } = require("../no-block-inside-block");

testRule({
  plugins: ["./index.js"],
  ruleName,
  config: true,

  accept: [
    {
      description: "Block selector with Element selector should be allowed",
      code: ".Component .Component__element {}"
    },
    {
      description: "Element selector in Block should be allowed",
      code: ".Component { .Component__element {} }"
    },
    {
      description: "Two independent blocks should be allowed",
      code: ".Component1 {} .Component2 {}"
    }
    // TODO :: .Component { @at-root { .Component } } should work fine
  ],

  reject: [
    {
      description: "Any nested Block shouldn't be OK",
      code: ".Component1 { .Component2 {} }",
      message: "A block should not depend on another block directly",
      line: 1,
      column: 15
    },
    {
      description:
        "Block inside Element of another Block should not be allowed",
      code: ".Component1 { .Component1__element { .Component2 {}}}",
      column: 38,
      line: 1,
      message: "A block should not depend on another block directly"
    },
    {
      description:
        "Block inside Element with nesting selector of another Block should not be allowed",
      code: ".Component1 { & .Component1__element { .Component2 {} } }",
      column: 40,
      line: 1,
      message: "A block should not depend on another block directly"
    },
    {
      description: "Block selector in subling Element should not be allowed",
      code: ".Component1 { .Component1__element .Component2 {}}",
      column: 15,
      line: 1,
      message: "A block should not depend on another block directly"
    },
    {
      description: "Block selector in child Element should not be allowed",
      code: ".Component1 { .Component1__element > .Component2 {}}",
      column: 15,
      line: 1,
      message: "A block should not depend on another block directly"
    }
  ]
});
