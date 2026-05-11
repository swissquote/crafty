const path = require("node:path");

module.exports = {
  presets: [
    "@swissquote/crafty-preset-vitest",
    "@swissquote/crafty-preset-swc",
    path.join(__dirname, "local-swc-preset.js")
  ]
};