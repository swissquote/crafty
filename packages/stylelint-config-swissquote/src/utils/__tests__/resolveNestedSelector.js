import { test } from "node:test";
import { expect } from "expect";

import isKeyframeSelector from "stylelint/lib/utils/isKeyframeSelector.js";
import isStandardSyntaxRule from "stylelint/lib/utils/isStandardSyntaxRule.js";
import isStandardSyntaxSelector from "stylelint/lib/utils/isStandardSyntaxSelector.js";
import postcss from "postcss";
import scssSyntax from "postcss-scss";

import resolveNestedSelector from "../resolveNestedSelector";

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

test("Non nested selector", async () => {
  const result = await postcssProcess("header {}");
  expect(result).toEqual([["header"]]);
});

test("Multiple non nested selector", async () => {
  const result = await postcssProcess("h1, h2 {}");
  expect(result).toEqual([["h1"], ["h2"]]);
});

test("Simple nested selector", async () => {
  const result = await postcssProcess(".Main { .Child {} }");
  expect(result).toEqual([[".Main", ".Child"]]);
});

test("Multiple nested selector", async () => {
  const result = await postcssProcess(".Component { a:hover, a:focus {} }");
  expect(result).toEqual([
    [".Component", "a:hover"],
    [".Component", "a:focus"]
  ]);
});

test("Multiple nested selector, more levels", async () => {
  const result = await postcssProcess(
    ".Component { a:hover, a:focus { span {} } }"
  );
  expect(result).toEqual([
    [".Component", "a:hover", "span"],
    [".Component", "a:focus", "span"]
  ]);
});

test("Complex nested selector", async () => {
  const result = await postcssProcess(
    ".Component, .OtherComponent { a:hover, a:focus {} strong, em {} }"
  );
  expect(result).toEqual([
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

test("Nested with parent selector, beginning", async () => {
  // I'm well aware that using "&" at the beginning of a selector is pointless
  const result = await postcssProcess(".Component { & a:hover {} }");
  expect(result).toEqual([[".Component", "a:hover"]]);
});

test("Nested with parent selector, beginning, multiple", async () => {
  // I'm well aware that using "&" at the beginning of a selector is pointless
  const result = await postcssProcess(
    ".Component { & a:hover, .notParent {} }"
  );
  expect(result).toEqual([
    [".Component", "a:hover"],
    [".Component", ".notParent"]
  ]);
});

test("Nested with parent selector, beginning, multiple 2", async () => {
  // I'm well aware that using "&" at the beginning of a selector is pointless
  const result = await postcssProcess(".Component { & a:hover, & a:focus {} }");
  expect(result).toEqual([
    [".Component", "a:hover"],
    [".Component", "a:focus"]
  ]);
});

test("Nested with parent selector, end", async () => {
  const result = await postcssProcess(".Component { a:hover & {} }");
  expect(result).toEqual([["a:hover", ".Component"]]);
});

test("Nested with parent selector, end, multiple", async () => {
  const result = await postcssProcess(
    ".Component { a:hover &, .notParent {} }"
  );
  expect(result).toEqual([
    ["a:hover", ".Component"],
    [".Component", ".notParent"]
  ]);
});

test("Nested with parent selector, end, multiple 2", async () => {
  // I'm well aware that using "&" at the beginning of a selector is pointless
  const result = await postcssProcess(".Component { a:hover &, a:focus & {} }");
  expect(result).toEqual([
    ["a:hover", ".Component"],
    ["a:focus", ".Component"]
  ]);
});

test("Nested on many levels, with parent selector", async () => {
  const result = await postcssProcess(
    ".Parent1 { .Parent2 { .Parent3 & { .Parent4 {} } } }"
  );
  expect(result).toEqual([[".Parent3", ".Parent1", ".Parent2", ".Parent4"]]);
});

test("Nested on many levels, with parent selector, multiple", async () => {
  const result = await postcssProcess(
    ".Parent1 { .Parent2 { .Parent3 & { .Parent4, .Parent5 {} } } }"
  );
  expect(result).toEqual([
    [".Parent3", ".Parent1", ".Parent2", ".Parent4"],
    [".Parent3", ".Parent1", ".Parent2", ".Parent5"]
  ]);
});

test("Nested with compound parent selector", async () => {
  const result = await postcssProcess("header { &.class {} }");
  expect(result).toEqual([["header.class"]]);
});

test("Nested with parent selector, middle", async () => {
  const result = await postcssProcess(
    ".Component { .Wrapper & .SubComponent {} }"
  );
  expect(result).toEqual([[".Wrapper", ".Component", ".SubComponent"]]);
});

test("Works on compound selector concatenating class names", async () => {
  const result = await postcssProcess(`
  .Parent {
    &--before { }
    &--after { }
  }
  `);
  expect(result).toEqual([[".Parent--before"], [".Parent--after"]]);
});

test("Nesting and multiple selectors", async () => {
  const result = await postcssProcess(`
  .Button, [dir="rtl"] .Button, .Button2 {
    .Button__icon, .Button__icon2 {
        &:first-child:last-child {
            margin: var(--Button--icon-margin) calc(-1 * var(--Button--icon-size));
        }
    }
  }
  `);
  expect(result).toEqual([
    [".Button", ".Button__icon:first-child:last-child"],
    ['[dir="rtl"] .Button', ".Button__icon:first-child:last-child"],
    [".Button2", ".Button__icon:first-child:last-child"],
    [".Button", ".Button__icon2:first-child:last-child"],
    ['[dir="rtl"] .Button', ".Button__icon2:first-child:last-child"],
    [".Button2", ".Button__icon2:first-child:last-child"]
  ]);
});
