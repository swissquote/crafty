module.exports = (options = { single: true }) => {
  const selectors = options.selectors || [
    "before",
    "after",
    "first-letter",
    "first-line"
  ];

  const replacements = new RegExp(`:{1,}(${selectors.join("|")})`, "gi");
  const replaceWith = options.single ? ":$1" : "::$1";

  return {
    postcssPlugin: "pseudoelements",
    Rule(rule) {
      rule.selector = rule.selector.replace(replacements, replaceWith);
    }
  };
};
