module.exports = {
  presets: ["@swissquote/crafty-preset-swc", "@swissquote/crafty-runner-gulp"],
  environment: "development",
  js: {
    myBundle: {
      source: "js/script.js"
    }
  }
};
