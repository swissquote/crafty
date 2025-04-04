import stylelint from "../../packages/stylelint.js";

import isKeyframeSelector from "../../dist/stylelint/utils-isKeyframeSelector.js";
import isStandardSyntaxRule from "../../dist/stylelint/utils-isStandardSyntaxRule.js";
import isStandardSyntaxSelector from "../../dist/stylelint/utils-isStandardSyntaxSelector.js";

import resolveNestedSelector from "../utils/resolveNestedSelector.js";
import parseSelector from "../utils/parseSelector.js";

export const ruleName = "swissquote/no-type-outside-scope";

export const messages = {
  rejected: "Types are allowed only inside a scope"
};

const scopeRegex = /^s-/;

function isScope(node) {
  return node && node.type === "class" && scopeRegex.test(node.value);
}

function getOriginalNode(node) {
  return node.originalNode || getOriginalNode(node.parent);
}

function alreadyWarned(warnings, node) {
  return warnings
    .filter(warning => warning.rule === ruleName)
    .some(warning => warning.node === node);
}

function checkSelector(selectorNode, ruleNode, result) {
  // Selectors can be within selectors, so check those too
  selectorNode.each(childNode => {
    if (childNode.type === "selector" || childNode.value === ":not") {
      checkSelector(childNode, ruleNode, result);
    }
  });

  if (selectorNode.type === "root" || selectorNode.type === "pseudo") {
    return;
  }

  let typeWithoutScope = false;
  for (const childNode of selectorNode.nodes) {
    if (isScope(childNode)) {
      break;
    }

    if (childNode.type === "tag") {
      typeWithoutScope = childNode;
      break;
    }
  }

  if (typeWithoutScope) {
    const originalNode = getOriginalNode(typeWithoutScope);
    if (alreadyWarned(result.warnings(), originalNode)) {
      // Don't warn twice for the same node
      return;
    }

    stylelint.utils.report({
      ruleName,
      result,
      node: originalNode,
      index: typeWithoutScope.sourceIndex,
      endIndex: typeWithoutScope.sourceIndex + typeWithoutScope.value.length,
      message: messages.rejected,
      word: selectorNode
    });
  }
}

export default function noTypeOutsideScope() {
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

          try {
            const container = parseSelector(resolvedSelector);
            checkSelector(container, rule, result);
          } catch {
            result.warn("Cannot parse selector", { node: rule });
          }
        });
      });
    });
  };
}

noTypeOutsideScope.ruleName = ruleName;
noTypeOutsideScope.messages = messages;
