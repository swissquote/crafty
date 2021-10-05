module.exports = {
  // Make sure that the version supports custom-properties
  // This will leave the variable, but still convert the color function
  browsers: "chrome 80",
  presets: [
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-runner-gulp",
  ],
  css: {
    myBundle: {
      source: "css/style.scss",
    },
  },
};
