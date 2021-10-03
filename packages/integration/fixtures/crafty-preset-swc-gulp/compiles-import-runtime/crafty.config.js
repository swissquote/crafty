module.exports = {
  browsers: "ie 11",
  presets: ["@swissquote/crafty-preset-swc", "@swissquote/crafty-runner-gulp"],
  environment: "development",
  js: {
    myBundle: {
      source: "js/**/*.js"
    }
  }
};
