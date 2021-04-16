module.exports = {
  presets: ["@swissquote/crafty-preset-swc", "@swissquote/crafty-runner-rollup"],
  js: {
    myBundle: {
      source: "js/script.js"
    }
  }
};
