const isKeyframeSelector = require("stylelint/lib/utils/isKeyframeSelector");
const isStandardSyntaxRule = require("stylelint/lib/utils/isStandardSyntaxRule");
const isStandardSyntaxSelector = require("stylelint/lib/utils/isStandardSyntaxSelector");
const report = require("stylelint/lib/utils/report");
const resolvedNestedSelector = require("postcss-resolve-nested-selector");
const selectorParser = require("postcss-selector-parser");

const ruleName = "swissquote/no-type-outside-scope";

const messages = {
  rejected: "Types are allowed only inside a scope"
};

const isScope = /^s-/;

function checkSelector(selectorNode, ruleNode, result) {
  // Selectors can be within selectors, so check those too
  selectorNode.each(childNode => {
    if (childNode.type === "selector" || childNode.value === ":not") {
      checkSelector(childNode, ruleNode, result);
    }
  });

  const hasTypes = selectorNode.some(childNode => childNode.type === "tag");

  if (
    selectorNode.type === "root" ||
    selectorNode.type === "pseudo" ||
    !hasTypes
  ) {
    return;
  }

  let hasScope = false;
  for (const i in selectorNode.nodes) {
    if (!selectorNode.nodes.hasOwnProperty(i)) {
      continue;
    }

    const node = selectorNode.nodes[i];

    if (node.type === "class" && node.value.match(isScope)) {
      hasScope = true;
    }

    if (node.type === "tag" && !hasScope) {
      report({
        ruleName,
        result,
        node: ruleNode,
        message: messages.rejected,
        word: selectorNode
      });

      return;
    }
  }
}

module.exports = function() {
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
        resolvedNestedSelector(selector, rule).forEach(resolvedSelector => {
          if (!isStandardSyntaxSelector(resolvedSelector)) {
            return;
          }

          try {
            selectorParser(container =>
              checkSelector(container, rule, result)
            ).process(resolvedSelector);
          } catch (e) {
            result.warn("Cannot parse selector", { node: rule });
          }
        });
      });
    });
  };
};

module.exports.ruleName = ruleName;
module.exports.messages = messages;
