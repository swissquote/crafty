module.exports = {
  presets: ["@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-webpack"],
  js: {
    myBundle: {
      source: "js/index.ts"
    }
  }
};
