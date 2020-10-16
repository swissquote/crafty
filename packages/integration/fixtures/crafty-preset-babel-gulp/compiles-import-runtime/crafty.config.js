module.exports = {
  presets: ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-gulp"],
  environment: "development",
  js: {
    myBundle: {
      source: "js/**/*.js"
    }
  }
};
