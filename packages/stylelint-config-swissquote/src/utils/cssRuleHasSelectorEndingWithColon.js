const _ = require("lodash");

/**
 * Check whether a rule has a selector ending in a colon
 *
 * @param {Rule} rule postcss rule node
 * @return {boolean} If `true`, the rule has a selector ending in a colon
 */
module.exports = function(rule) {
  const selector = _.get(rule, "raws.selector.raw", rule.selector);
  return selector[selector.length - 1] === ":";
};
