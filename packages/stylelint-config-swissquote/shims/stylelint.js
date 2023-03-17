// Stylelint is bundled with Crafty
// If this package is used within Crafty, we need to use it from "@swissquote/crafty-preset-postcss"
// Otherwise we fallback in loading stylelint directly

try {
  module.exports = require("@swissquote/crafty-preset-postcss/packages/stylelint.js");
} catch (e) {
  module.exports = require("stylelint");
}
