const replaceRuleSelector = require("./replaceRuleSelector");

function postcssSelectorMatches(options = {}) {
  return {
    postcssPlugin: "postcss-selector-matches",
    Rule(rule, { list }) {
      if (rule.selector && rule.selector.indexOf(":matches") > -1) {
        rule.selector = replaceRuleSelector(rule, options, list);
      }
    }
  };
}
postcssSelectorMatches.postcss = true;

module.exports = postcssSelectorMatches;
