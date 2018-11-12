const parentBeginning = /^\s*&\s*/;
const parentBeginningCompound = /^\s?&(?!\s)/;
const parentEnd = /\s*&\s*$/;

function hasParentSelector(selector) {
  return selector.some(part => part.selector.indexOf("&") !== -1);
}

function insertParent(parentSelector, selector) {
  for (const index in selector) {
    if (!selector.hasOwnProperty(index)) {
      continue;
    }

    const part = selector[index];
    if (part.selector.indexOf("&") === -1) {
      continue;
    }

    // Selector at the beginning
    if (part.selector.match(parentBeginning)) {

      // We have a compound parent selector
      // In this case, we append the current selector to the parent one,
      // so that we keep the compound part
      // Sadly, we loose the node information in the operation
      if (part.selector.match(parentBeginningCompound)) {

        const last = parentSelector[parentSelector.length - 1];
        last.selector += part.selector.replace(parentBeginning, "");

        selector.splice(index, 1, ...parentSelector);

        return selector;
      }

      part.selector = part.selector.replace(parentBeginning, "");
      selector.splice(index, 0, ...parentSelector);

      return selector;
    }

    // Selector at the end
    if (part.selector.match(parentEnd)) {
      part.selector = part.selector.replace(parentEnd, "");
      selector.splice(index + 1, 0, ...parentSelector);

      return selector;
    }

    // Selector in the middle
    const parts = part.selector.split("&").map(item => item.trim());
    const before = { selector: parts[0], node: part.node.clone() };
    const after = { selector: parts[1], node: part.node.clone() };
    selector.splice(index, 1, before, ...parentSelector, after);

    return selector;
  }

  // Shouldn't get here
  throw new Error("How did you get here ?");
}

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
    if (hasParentSelector(selector)) {
      var newlyResolvedSelectors = resolveNestedSelector(
        parentSelector,
        parent
      ).map(resolvedParentSelector =>
        insertParent(resolvedParentSelector, selector)
      );

      return result.concat(newlyResolvedSelectors);
    }

    var combinedSelector = [{ selector: parentSelector, node: parent }].concat(
      selector
    );
    return result.concat(resolveNestedSelector(combinedSelector, parent));
  }, []);
}

module.exports = resolveNestedSelector;
