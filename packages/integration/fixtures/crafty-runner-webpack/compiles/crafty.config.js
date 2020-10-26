module.exports = {
  presets: ["@swissquote/crafty-runner-webpack"],
  destination_js: "dist/js",
  js: {
    myBundle: {
      source: "js/script.js"
    }
  }
};
