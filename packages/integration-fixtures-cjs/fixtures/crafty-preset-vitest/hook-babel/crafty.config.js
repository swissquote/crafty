const path = require("node:path");

module.exports = {
  presets: [
    "@swissquote/crafty-preset-vitest",
    "@swissquote/crafty-preset-babel",
    path.join(__dirname, "local-babel-preset.js")
  ]
};