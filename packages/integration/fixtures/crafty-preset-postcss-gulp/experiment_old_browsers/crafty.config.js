module.exports = {
  browsers: "ie 9, safari 10",
  environment: "development",
  presets: ["@swissquote/crafty-preset-postcss", "@swissquote/crafty-runner-gulp"],
  css: {
    myBundle: {
      source: "css/style.scss"
    }
  }
};
