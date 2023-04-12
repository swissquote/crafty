// Stylelint is bundled with Crafty
// If this package is used within Crafty, we need to use it from "@swissquote/crafty-preset-stylelint"
// Otherwise we fallback in loading stylelint directly

try {
  module.exports = require("@swissquote/crafty-preset-stylelint/packages/stylelint.js");
} catch (e) {
  module.exports = require("stylelint");
}
