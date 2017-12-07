module.exports = {
  presets: ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-webpack"],
  js: {
    myBundle: {
      externals: ["somelibrary/**"],
      source: "js/script.js"
    }
  }
};
