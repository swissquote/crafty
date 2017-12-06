module.exports = {
  environment: "development",
  presets: ["@swissquote/crafty-preset-postcss", "@swissquote/crafty-runner-gulp"],
  css: {
    myBundle: {
      source: "css/style.scss"
    }
  }
};
