const hasOwnProperty = Object.prototype.hasOwnProperty;

const parentBeginning = /^\s*&\s*/;
const parentBeginningCompound = /^\s?&(?!\s)/;
const parentEnd = /\s*&\s*$/;

function hasParentSelector(selector) {
  return selector.some(part => part.selector.indexOf("&") !== -1);
}

function insertParent(initialParentSelector, initialSelector) {
  // As we are mutating the entries, we clone them here to not mess up the underlying data
  const parentSelector = initialParentSelector.map(entry => ({
    selector: entry.selector,
    node: entry.node.clone()
  }));
  const selector = initialSelector.map(entry => ({
    selector: entry.selector,
    node: entry.node.clone()
  }));

  for (const index in selector) {
    if (!hasOwnProperty.call(selector, index)) {
      continue;
    }

    const part = selector[index];
    if (part.selector.indexOf("&") === -1) {
      continue;
    }

    // Selector at the beginning
    if (parentBeginning.test(part.selector)) {
      // We have a compound parent selector
      // In this case, we append the current selector to the parent one,
      // so that we keep the compound part
      // Sadly, we loose the node information in the operation
      if (parentBeginningCompound.test(part.selector)) {
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
    if (parentEnd.test(part.selector)) {
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

export default function resolveNestedSelector(initialSelector, node) {
  const parent = node.parent;

  const selector = Array.isArray(initialSelector)
    ? initialSelector
    : [{ selector: initialSelector, node }];

  if (parent.type === "root") {
    return [selector];
  }

  const parentIsNestAtRule = parent.type === "atrule" && parent.name === "nest";
  if (parent.type !== "rule" && !parentIsNestAtRule) {
    return resolveNestedSelector(selector, parent);
  }

  const parentSelectors = parentIsNestAtRule
    ? parent.params.split(",").map(s => s.trim())
    : parent.selectors;

  return parentSelectors.reduce((result, parentSelector) => {
    if (hasParentSelector(selector)) {
      const newlyResolvedSelectors = resolveNestedSelector(
        parentSelector,
        parent
      ).map(resolvedParentSelector =>
        insertParent(resolvedParentSelector, selector)
      );

      return result.concat(newlyResolvedSelectors);
    }

    const combinedSelector = [
      { selector: parentSelector, node: parent }
    ].concat(selector);
    return result.concat(resolveNestedSelector(combinedSelector, parent));
  }, []);
}
