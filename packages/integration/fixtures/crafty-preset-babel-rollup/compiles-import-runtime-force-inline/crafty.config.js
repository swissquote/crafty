module.exports = {
  presets: ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-rollup"],
  js: {
    myBundle: {
      source: "js/script.js",
      inlineRuntime: true
    }
  }
};
