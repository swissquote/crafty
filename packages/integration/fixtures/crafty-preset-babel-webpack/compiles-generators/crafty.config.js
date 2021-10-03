module.exports = {
  browsers: "ie 11",
  presets: ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-webpack"],
  js: {
    myBundle: {
      source: "js/script.js"
    }
  }
};
