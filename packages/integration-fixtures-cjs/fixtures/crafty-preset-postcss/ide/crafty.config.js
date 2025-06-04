module.exports = {
  presets: [
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-runner-gulp"
  ],
  stylelint: {
    rules: {
      "swissquote/no-type-outside-scope": null
    }
  }
};
