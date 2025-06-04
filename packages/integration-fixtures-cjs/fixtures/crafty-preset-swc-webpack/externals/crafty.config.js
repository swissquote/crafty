module.exports = {
  presets: ["@swissquote/crafty-preset-swc", "@swissquote/crafty-runner-webpack"],
  js: {
    myBundle: {
      externals: ["somelibrary/**"],
      source: "js/script.js"
    }
  }
};
