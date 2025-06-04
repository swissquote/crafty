module.exports = {
  presets: [
    "@swissquote/crafty-preset-jest",
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-preset-react"
  ],
  jest(crafty, options) {
    options.testEnvironment = "jsdom";
  }
};
