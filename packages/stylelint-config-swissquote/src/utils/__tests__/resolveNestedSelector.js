const test = require("ava");

/* eslint-disable @swissquote/swissquote/sonarjs/no-duplicate-string */
const isKeyframeSelector = require("stylelint/lib/utils/isKeyframeSelector");
const isStandardSyntaxRule = require("stylelint/lib/utils/isStandardSyntaxRule");
const isStandardSyntaxSelector = require("stylelint/lib/utils/isStandardSyntaxSelector");
const postcss = require("postcss");
const scssSyntax = require("postcss-scss");

const resolveNestedSelector = require("../resolveNestedSelector");

function getResolvedSelectors(results) {
  return root => {
    root.walkRules(rule => {
      if (
        !isStandardSyntaxRule(rule) ||
        !isStandardSyntaxSelector(rule.selector) ||
        rule.selectors.some(s => isKeyframeSelector(s))
      ) {
        return;
      }

      // Skip unresolved nested selectors
      if (
        rule.nodes.some(node => ["rule", "atrule"].indexOf(node.type) !== -1)
      ) {
        return;
      }

      rule.selectors.forEach(selector => {
        resolveNestedSelector(selector, rule).forEach(resolvedSelector => {
          if (
            resolvedSelector.some(
              resolved => !isStandardSyntaxSelector(resolved.selector)
            )
          ) {
            return;
          }

          results.push(resolvedSelector);
        });
      });
    });
  };
}

async function postcssProcess(code) {
  const resultContainer = [];
  await postcss()
    .use(getResolvedSelectors(resultContainer))
    .process(code, { syntax: scssSyntax, from: undefined });

  return resultContainer.map(selectorContainer =>
    selectorContainer.map(selector => selector.selector)
  );
}

test("Non nested selector", async (t) => {
  const result = await postcssProcess("header {}");
  t.deepEqual(result, [["header"]]);
});

test("Multiple non nested selector", async (t) => {
  const result = await postcssProcess("h1, h2 {}");
  t.deepEqual(result, [["h1"], ["h2"]]);
});

test("Simple nested selector", async (t) => {
  const result = await postcssProcess(".Main { .Child {} }");
  t.deepEqual(result, [[".Main", ".Child"]]);
});

test("Multiple nested selector", async (t) => {
  const result = await postcssProcess(".Component { a:hover, a:focus {} }");
  t.deepEqual(result, [
    [".Component", "a:hover"],
    [".Component", "a:focus"]
  ]);
});

test("Multiple nested selector, more levels", async (t) => {
  const result = await postcssProcess(".Component { a:hover, a:focus { span {} } }");
  t.deepEqual(result, [
    [".Component", "a:hover", "span"],
    [".Component", "a:focus", "span"]
  ]);
});

test("Complex nested selector", async (t) => {
  const result = await postcssProcess(
    ".Component, .OtherComponent { a:hover, a:focus {} strong, em {} }"
  );
  t.deepEqual(result, [
    [".Component", "a:hover"],
    [".OtherComponent", "a:hover"],
    [".Component", "a:focus"],
    [".OtherComponent", "a:focus"],
    [".Component", "strong"],
    [".OtherComponent", "strong"],
    [".Component", "em"],
    [".OtherComponent", "em"]
  ]);
});

test("Nested with parent selector, beginning", async (t) => {
  // I'm well aware that using "&" at the beginning of a selector is pointless
  const result = await postcssProcess(".Component { & a:hover {} }");
  t.deepEqual(result, [[".Component", "a:hover"]]);
});

test("Nested with parent selector, beginning, multiple", async (t) => {
  // I'm well aware that using "&" at the beginning of a selector is pointless
  const result = await postcssProcess(".Component { & a:hover, .notParent {} }");
  t.deepEqual(result, [
    [".Component", "a:hover"],
    [".Component", ".notParent"]
  ]);
});

test("Nested with parent selector, beginning, multiple 2", async (t) => {
  // I'm well aware that using "&" at the beginning of a selector is pointless
  const result = await postcssProcess(".Component { & a:hover, & a:focus {} }");
  t.deepEqual(result, [
    [".Component", "a:hover"],
    [".Component", "a:focus"]
  ]);
});

test("Nested with parent selector, end", async (t) => {
  const result = await postcssProcess(".Component { a:hover & {} }");
  t.deepEqual(result, [["a:hover", ".Component"]]);
});

test("Nested with parent selector, end, multiple", async (t) => {
  const result = await postcssProcess(".Component { a:hover &, .notParent {} }");
  t.deepEqual(result, [
    ["a:hover", ".Component"],
    [".Component", ".notParent"]
  ]);
});

test("Nested with parent selector, end, multiple 2", async (t) => {
  // I'm well aware that using "&" at the beginning of a selector is pointless
  const result = await postcssProcess(".Component { a:hover &, a:focus & {} }");
  t.deepEqual(result, [
    ["a:hover", ".Component"],
    ["a:focus", ".Component"]
  ]);
});

test("Nested on many levels, with parent selector", async (t) => {
  const result = await postcssProcess(
    ".Parent1 { .Parent2 { .Parent3 & { .Parent4 {} } } }"
  );
  t.deepEqual(result, [[".Parent3", ".Parent1", ".Parent2", ".Parent4"]]);
});

test("Nested on many levels, with parent selector, multiple", async (t) => {
  const result = await postcssProcess(
    ".Parent1 { .Parent2 { .Parent3 & { .Parent4, .Parent5 {} } } }"
  );
  t.deepEqual(result, [
    [".Parent3", ".Parent1", ".Parent2", ".Parent4"],
    [".Parent3", ".Parent1", ".Parent2", ".Parent5"]
  ]);
});

test("Nested with compound parent selector", async (t) => {
  const result = await postcssProcess("header { &.class {} }");
  t.deepEqual(result, [["header.class"]]);
});

test("Nested with parent selector, middle", async (t) => {
  const result = await postcssProcess(".Component { .Wrapper & .SubComponent {} }");
  t.deepEqual(result, [[".Wrapper", ".Component", ".SubComponent"]]);
});

test("Works on compound selector concatenating class names", async (t) => {
  const result = await postcssProcess(`
  .Parent {
    &--before { }
    &--after { }
  }
  `);
  t.deepEqual(result, [[".Parent--before"], [".Parent--after"]]);
});
