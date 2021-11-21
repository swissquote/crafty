const postcss = require("postcss");
const plugin = require("../src");
const replaceRuleSelector = require("../src/replaceRuleSelector");

function transform(css, options = {}) {
  return postcss(plugin(options)).process(css).css;
}

describe("postcss-selector-matches", () => {
  it("expose 'replaceRuleSelector' function (for postcss-custom-selectors)", () => {
    expect(typeof replaceRuleSelector === "function").toBeTruthy();
  });

  it("should do nothing if there is no :matches", () => {
    expect(transform("body {}")).toEqual("body {}");
  });

  it("should really do nothing if there is no :matches", () => {
    expect(transform("body, matches {}")).toEqual("body, matches {}");
  });

  it("should transform simple :matches()", () => {
    expect(transform(":matches(a, b) {}")).toEqual("a, b {}");
  });

  it("should transform directes :matches()", () => {
    expect(transform("tag:matches(.class, .class2) {}")).toEqual(
      "tag.class, tag.class2 {}"
    );
  });

  it("should transform :matches()", () => {
    expect(transform("tag :matches(tag2, tag3) {}")).toEqual(
      "tag tag2, tag tag3 {}"
    );
  });

  it("should transform mutltiples :matches()", () => {
    expect(
      transform("tag :matches(tag2, tag3) :matches(tag4, tag5) {}")
    ).toEqual("tag tag2 tag4, tag tag3 tag4, tag tag2 tag5, tag tag3 tag5 {}");
  });

  it("should transform mutltiples :matches() with stuff after", () => {
    expect(
      transform("tag :matches(tag2, tag3) :matches(tag4, tag5), test {}")
    ).toEqual(
      "tag tag2 tag4, tag tag3 tag4, tag tag2 tag5, tag tag3 tag5, test {}"
    );
  });

  it("should transform mutltiples :matches() with pseudo after", () => {
    expect(transform(":matches(tag) :matches(tag2, tag3):hover {}")).toEqual(
      "tag tag2:hover, tag tag3:hover {}"
    );
  });

  it("should transform :matches() recursively", () => {
    expect(
      transform("tag :matches(tag2 :matches(tag4, tag5), tag3) {}")
    ).toEqual("tag tag2 tag4, tag tag2 tag5, tag tag3 {}");
  });

  it("should transform shit if you ask for shit ?", () => {
    expect(transform("p:matches(a, span) {}")).toEqual("pa, pspan {}");
  });

  it("should transform childs with parenthesis", () => {
    expect(transform(".foo:matches(:nth-child(-n+2), .bar) {}")).toEqual(
      ".foo:nth-child(-n+2), .foo.bar {}"
    );
  });

  it("should works with lots of whitespace", () => {
    expect(
      transform(`a:matches(
        .b,
        .c
      ) {}`)
    ).toEqual("a.b, a.c {}");
  });

  it("should add line break if asked too", () => {
    expect(
      transform(".foo:matches(:nth-child(-n+2), .bar) {}", { lineBreak: true })
    ).toEqual(".foo:nth-child(-n+2),\n.foo.bar {}");
  });

  it("should add line break if asked too, and respect indentation", () => {
    expect(
      transform("  .foo:matches(:nth-child(-n+2), .bar) {}", {
        lineBreak: true,
      })
    ).toEqual("  .foo:nth-child(-n+2),\n  .foo.bar {}");
  });

  it("should add line break if asked too, and respect indentation even with \n", () => {
    expect(
      transform("\n  .foo:matches(:nth-child(-n+2), .bar) {}", {
        lineBreak: true,
      })
    ).toEqual("\n  .foo:nth-child(-n+2),\n  .foo.bar {}");
  });

  it("should avoid duplicates", () => {
    expect(
      transform(`
      button:matches(:hover, :active),
      .button:matches(:hover, :active) {}`)
    ).toEqual(`
      button:hover, button:active, .button:hover, .button:active {}`);
  });

  it("should work with something after :matches()", () => {
    expect(transform(".foo:matches(:hover, :focus)::before {}")).toEqual(
      ".foo:hover::before, .foo:focus::before {}"
    );
  });

  it("should works correctly with adjacent selectors", () => {
    expect(transform("article :matches(h1, h2, h3) + p {}")).toEqual(
      "article h1 + p, article h2 + p, article h3 + p {}"
    );
  });

  it("should works correctly with adjacent selectors and line break", () => {
    expect(
      transform("article :matches(h1, h2, h3) + p {}", { lineBreak: true })
    ).toEqual(
      `article h1 + p,
article h2 + p,
article h3 + p {}`
    );
  });

  it("should works correctly with a class and an element", () => {
    expect(transform(".foo:matches(p) {color: red;}")).toEqual(
      "p.foo {color: red;}"
    );
  });

  it("regression https://github.com/postcss/postcss-selector-matches/issues/10", () => {
    expect(transform(".fo--oo > :matches(h1, h2, h3) {}")).toEqual(
      ".fo--oo > h1, .fo--oo > h2, .fo--oo > h3 {}"
    );
  });

  it("regression https://github.com/postcss/postcss-selector-matches/issues/10", () => {
    expect(transform(":matches(h4, h5, h6):hover .ba--z {}")).toEqual(
      "h4:hover .ba--z, h5:hover .ba--z, h6:hover .ba--z {}"
    );
  });

  it("regression https://github.com/postcss/postcss-selector-matches/issues/10", () => {
    expect(transform(":matches(a, b).foo, .bar {}")).toEqual(
      "a.foo, b.foo, .bar {}"
    );
  });
});
