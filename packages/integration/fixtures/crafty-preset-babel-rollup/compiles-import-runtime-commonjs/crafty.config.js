module.exports = {
  browsers: "ie 11",
  presets: ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-rollup"],
  js: {
    myBundle: {
      source: "js/script.js",
      format: "cjs"
    }
  }
};
