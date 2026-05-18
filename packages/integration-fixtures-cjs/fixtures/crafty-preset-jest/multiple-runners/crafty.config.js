const path = require("node:path");

module.exports = {
  presets: [
    "@swissquote/crafty-preset-jest",
    path.join(__dirname, "local-test-runner.js")
  ]
};
