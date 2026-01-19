module.exports = {
  presets: ["@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-rspack"],
  js: {
    myBundle: {
      source: "js/index.ts"
    }
  }
};
