module.exports = {
  presets: ["@swissquote/crafty-preset-swc", "@swissquote/crafty-runner-rspack"],
  js: {
    myBundle: {
      source: "js/index.js"
    }
  }
};
