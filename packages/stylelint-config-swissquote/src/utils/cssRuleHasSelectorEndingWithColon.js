const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Check whether a rule has a selector ending in a colon
 *
 * @param {Rule} rule postcss rule node
 * @return {boolean} If `true`, the rule has a selector ending in a colon
 */
module.exports = function(rule) {
  const selector =
    (hasOwnProperty.call(rule, "raws") &&
      hasOwnProperty.call(rule.raws, "selector") &&
      hasOwnProperty.call(rule.raws.selector, "raw") &&
      rule.raws.selector.raw) ||
    rule.selector;

  return selector[selector.length - 1] === ":";
};
