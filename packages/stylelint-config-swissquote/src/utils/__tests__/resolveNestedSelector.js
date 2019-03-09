const isKeyframeSelector = require("stylelint/lib/utils/isKeyframeSelector");
const isStandardSyntaxRule = require("stylelint/lib/utils/isStandardSyntaxRule");
const isStandardSyntaxSelector = require("stylelint/lib/utils/isStandardSyntaxSelector");
const postcss = require("postcss");
const scssSyntax = require("postcss-scss");

const resolveNestedSelector = require("../resolveNestedSelector");

async function postcssProcess(code) {
  const resultContainer = [];
  await postcss()
    .use(getResolvedSelectors(resultContainer))
    .process(code, { syntax: scssSyntax, from: undefined });

  return resultContainer.map(selectorContainer =>
    selectorContainer.map(selector => selector.selector)
  );
}

function getResolvedSelectors(results) {
  return (root, result) => {
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

it("Non nested selector", async () => {
  const t = await postcssProcess("header {}");
  expect(t).toEqual([["header"]]);
});

it("Multiple non nested selector", async () => {
  const t = await postcssProcess("h1, h2 {}");
  expect(t).toEqual([["h1"], ["h2"]]);
});

it("Simple nested selector", async () => {
  const t = await postcssProcess(".Main { .Child {} }");
  expect(t).toEqual([[".Main", ".Child"]]);
});

it("Multiple nested selector", async () => {
  const t = await postcssProcess(".Component { a:hover, a:focus {} }");
  expect(t).toEqual([[".Component", "a:hover"], [".Component", "a:focus"]]);
});

it("Multiple nested selector, more levels", async () => {
  const t = await postcssProcess(".Component { a:hover, a:focus { span {} } }");
  expect(t).toEqual([
    [".Component", "a:hover", "span"],
    [".Component", "a:focus", "span"]
  ]);
});

it("Complex nested selector", async () => {
  const t = await postcssProcess(
    ".Component, .OtherComponent { a:hover, a:focus {} strong, em {} }"
  );
  expect(t).toEqual([
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

it("Nested with parent selector, beginning", async () => {
  // I'm well aware that using "&" at the beginning of a selector is pointless
  const t = await postcssProcess(".Component { & a:hover {} }");
  expect(t).toEqual([[".Component", "a:hover"]]);
});

it("Nested with parent selector, beginning, multiple", async () => {
  // I'm well aware that using "&" at the beginning of a selector is pointless
  const t = await postcssProcess(".Component { & a:hover, .notParent {} }");
  expect(t).toEqual([[".Component", "a:hover"], [".Component", ".notParent"]]);
});

it("Nested with parent selector, beginning, multiple 2", async () => {
  // I'm well aware that using "&" at the beginning of a selector is pointless
  const t = await postcssProcess(".Component { & a:hover, & a:focus {} }");
  expect(t).toEqual([[".Component", "a:hover"], [".Component", "a:focus"]]);
});

it("Nested with parent selector, end", async () => {
  const t = await postcssProcess(".Component { a:hover & {} }");
  expect(t).toEqual([["a:hover", ".Component"]]);
});

it("Nested with parent selector, end, multiple", async () => {
  const t = await postcssProcess(".Component { a:hover &, .notParent {} }");
  expect(t).toEqual([["a:hover", ".Component"], [".Component", ".notParent"]]);
});

it("Nested with parent selector, end, multiple 2", async () => {
  // I'm well aware that using "&" at the beginning of a selector is pointless
  const t = await postcssProcess(".Component { a:hover &, a:focus & {} }");
  expect(t).toEqual([["a:hover", ".Component"], ["a:focus", ".Component"]]);
});

it("Nested on many levels, with parent selector", async () => {
  const t = await postcssProcess(
    ".Parent1 { .Parent2 { .Parent3 & { .Parent4 {} } } }"
  );
  expect(t).toEqual([[".Parent3", ".Parent1", ".Parent2", ".Parent4"]]);
});

it("Nested on many levels, with parent selector, multiple", async () => {
  const t = await postcssProcess(
    ".Parent1 { .Parent2 { .Parent3 & { .Parent4, .Parent5 {} } } }"
  );
  expect(t).toEqual([
    [".Parent3", ".Parent1", ".Parent2", ".Parent4"],
    [".Parent3", ".Parent1", ".Parent2", ".Parent5"]
  ]);
});

it("Nested with compound parent selector", async () => {
  const t = await postcssProcess("header { &.class {} }");
  expect(t).toEqual([["header.class"]]);
});

it("Nested with parent selector, middle", async () => {
  const t = await postcssProcess(".Component { .Wrapper & .SubComponent {} }");
  expect(t).toEqual([[".Wrapper", ".Component", ".SubComponent"]]);
});

it("Works on compound selector concatenating class names", async () => {
  const t = await postcssProcess(`
  .Parent {
    &--before { }
    &--after { }
  }
  `);
  expect(t).toEqual([[".Parent--before"], [".Parent--after"]]);
});
