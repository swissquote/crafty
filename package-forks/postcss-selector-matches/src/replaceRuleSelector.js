/* eslint-disable no-use-before-define */
const balancedMatch = require("balanced-match");

const pseudoClass = ":matches";
const selectorElementRE = /^[a-zA-Z]/;

function isElementSelector(selector) {
  // console.log({selector, matches})
  return selectorElementRE.exec(selector);
}

function normalizeSelector(selector, preWhitespace, pre) {
  if (isElementSelector(selector) && !isElementSelector(pre)) {
    return `${preWhitespace}${selector}${pre}`;
  }

  return `${preWhitespace}${pre}${selector}`;
}

function findBodySelectors(matches, body, options, list) {
  return matches && matches.body
    ? list
        .comma(matches.body)
        .reduce((acc, s) => [...acc, ...explodeSelector(s, options, list)], [])
    : [body];
}

function findPostSelectors(matches, options, list) {
  return matches && matches.post
    ? explodeSelector(matches.post, options, list)
    : [];
}

function explodeSelector(selector, options, list) {
  if (selector && selector.indexOf(pseudoClass) > -1) {
    let newSelectors = [];
    const preWhitespaceMatches = selector.match(/^\s+/);
    const preWhitespace = preWhitespaceMatches ? preWhitespaceMatches[0] : "";
    const selectorPart = list.comma(selector);
    selectorPart.forEach(part => {
      const position = part.indexOf(pseudoClass);
      const pre = part.slice(0, position);
      const body = part.slice(position);
      const matches = balancedMatch("(", ")", body);

      const bodySelectors = findBodySelectors(matches, body, options, list);
      const postSelectors = findPostSelectors(matches, options, list);

      let newParts;
      if (postSelectors.length === 0) {
        // the test below is a poor way to try we are facing a piece of a
        // selector...
        if (position === -1 || pre.indexOf(" ") > -1) {
          newParts = bodySelectors.map(s => preWhitespace + pre + s);
        } else {
          newParts = bodySelectors.map(s =>
            normalizeSelector(s, preWhitespace, pre)
          );
        }
      } else {
        newParts = [];
        postSelectors.forEach(postS => {
          bodySelectors.forEach(s => {
            newParts.push(preWhitespace + pre + s + postS);
          });
        });
      }
      newSelectors = [...newSelectors, ...newParts];
    });

    return newSelectors;
  }
  return [selector];
}

module.exports = function replaceRuleSelector(rule, options, list) {
  const indentation =
    rule.raws && rule.raws.before ? rule.raws.before.split("\n").pop() : "";
  const separator = options.lineBreak ? `\n${indentation}` : " ";

  return explodeSelector(rule.selector, options, list).join(`,${separator}`);
};
