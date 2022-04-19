const testRule = require("../../testUtils/ruleTester");
const { ruleName } = require("../no-variable-in-transpiled-function");

// no warnings for browers that transpile variables
testRule({
  plugins: ["./index.js"],
  ruleName,
  config: [
    true,
    {
      browsers: "ie 11"
    }
  ],

  accept: [
    {
      code: ".foo { color: color-mod(#ff0000 w(50%));  }"
    },
    {
      code: ".foo { transform: translate(var(--translate-amount));  }"
    },
    {
      code: ".foo { color: color-mod(var(--color) blue(20)); }"
    },
    {
      code: ".foo { color: color-mod(#f00 blue(var(--color))); }"
    },
    {
      code:
        ".foo { color: oklab(66.016% -0.1084 0.1114 / var(--color-opacity)); }"
    }
  ],

  reject: []
});

testRule({
  plugins: ["./index.js"],
  ruleName,
  config: [
    true,
    {
      browsers: "safari 15"
    }
  ],

  accept: [
    {
      description: "works on supported function",
      code:
        ".foo { color: color(xyz-d50 0.2005 0.14089 0.4472 / var(--color-alpha));  }"
    }
  ],

  reject: [
    {
      description: "Fails on color-mod var()",
      code: ".foo { color: color(var(--color) blue(20)); }",
      column: 15,
      line: 1,
      message:
        'Unexpected var() in transpiled function "color" (swissquote/no-variable-in-transpiled-function)'
    }
  ]
});

testRule({
  plugins: ["./index.js"],
  ruleName,
  config: [
    true,
    {
      browsers: "chrome 95"
    }
  ],

  accept: [
    {
      description: "works on function without variables",
      code: ".foo { color: color-mod(#ff0000 w(50%));  }"
    },
    {
      description: "works on supported functions",
      code: ".foo { transform: translate(var(--translate-amount));  }"
    },
    {
      description: "works on comma-separated rgba()",
      code: ".foo { color: rgba(0, 255, 0, var(--color-opacity)); }"
    }
  ],

  reject: [
    {
      description: "Fails on space separated rgba()",
      code:
        ".foo { color: rgba(46.27% 32.94% 80.39% / var(--color-opacity)); }",
      column: 15,
      line: 1,
      message:
        'Unexpected var() in transpiled function "rgba" (swissquote/no-variable-in-transpiled-function)'
    },
    {
      description: "Fails on gray var()",
      code: ".foo { color: gray(var(--gray-20)); }",
      column: 15,
      line: 1,
      message:
        'Unexpected var() in transpiled function "gray" (swissquote/no-variable-in-transpiled-function)'
    },
    {
      description: "Fails on height var()",
      code: ".foo { height: height(var(--image)); }",
      column: 16,
      line: 1,
      message:
        'Unexpected var() in transpiled function "height" (swissquote/no-variable-in-transpiled-function)'
    },
    {
      description: "Fails on color-mod var()",
      code: ".foo { color: color-mod(var(--color) blue(20)); }",
      column: 15,
      line: 1,
      message:
        'Unexpected var() in transpiled function "color-mod" (swissquote/no-variable-in-transpiled-function)'
    },
    {
      description: "Fails on nested color-mod var()",
      code: ".foo { color: color-mod(#f00 blue(var(--color))); }",
      column: 15,
      line: 1,
      message:
        'Unexpected var() in transpiled function "color-mod" (swissquote/no-variable-in-transpiled-function)'
    },
    {
      description: "Fails on oklab var()",
      code:
        ".foo { color: oklab(66.016% -0.1084 0.1114 / var(--color-opacity)); }",
      column: 15,
      line: 1,
      message:
        'Unexpected var() in transpiled function "oklab" (swissquote/no-variable-in-transpiled-function)'
    },
    {
      description: "Fails on lab var()",
      code: ".foo { color: lab(44.36% 36.05 -58.99 / var(--color-opacity)); }",
      column: 15,
      line: 1,
      message:
        'Unexpected var() in transpiled function "lab" (swissquote/no-variable-in-transpiled-function)'
    },
    {
      description: "Fails on image-set()",
      code: `.BigImage {
        background-image: image-set(
          url(img/test.png) 1x,
          var(--image2x) 2x
        );
      }`,
      column: 27,
      line: 2,
      message:
        'Unexpected var() in transpiled function "image-set" (swissquote/no-variable-in-transpiled-function)'
    }
  ]
});
