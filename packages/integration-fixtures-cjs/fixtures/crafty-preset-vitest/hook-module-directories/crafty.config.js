const path = require("node:path");

module.exports = {
  presets: [
    "@swissquote/crafty-preset-vitest",
    path.join(__dirname, "local-vitest-preset.js")
  ]
};