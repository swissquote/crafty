module.exports = {
  presets: ["@swissquote/crafty-preset-swc", "@swissquote/crafty-runner-rspack"],
  js: {
    myBundle: {
      externals: ["somelibrary/**"],
      source: "js/script.js"
    }
  }
};
