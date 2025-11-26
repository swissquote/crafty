const { URLSearchParams } = require("node:url");

module.exports = function composeQueryString(current, addon) {
  const newSearchParams = new URLSearchParams(addon);
  newSearchParams.forEach((value, name) => current.set(name, value));
};
