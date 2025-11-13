module.exports = {
  presets: ["@swissquote/crafty-runner-rspack"],
  destination_js: "dist/js",
  js: {
    myBundle: {
      source: "js/script.js"
    }
  }
};
