function resolveNestedSelector(initialSelector, node) {
  var parent = node.parent;
  var parentIsNestAtRule = parent.type === "atrule" && parent.name === "nest";

  const selector = Array.isArray(initialSelector)
    ? initialSelector
    : [{ selector: initialSelector, node }];

  if (parent.type === "root") {
    return [selector];
  }
  if (parent.type !== "rule" && !parentIsNestAtRule) {
    return resolveNestedSelector(selector, parent);
  }

  var parentSelectors = parentIsNestAtRule
    ? parent.params.split(",").map(s => s.trim())
    : parent.selectors;

  return parentSelectors.reduce((result, parentSelector) => {
    // TODO :: Add feature back later
    /*if (selector.indexOf('&') !== -1) {
        var newlyResolvedSelectors = resolveNestedSelector(parentSelector, parent)
          .map(resolvedParentSelector => selector.replace(/&/g, resolvedParentSelector));

        return result.concat(newlyResolvedSelectors);
      }*/

    var combinedSelector = [{ selector: parentSelector, node: parent }].concat(
      selector
    );
    return result.concat(resolveNestedSelector(combinedSelector, parent));
  }, []);
}

module.exports = resolveNestedSelector;
