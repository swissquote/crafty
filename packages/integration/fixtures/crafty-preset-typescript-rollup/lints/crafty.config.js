module.exports = {
  presets: ["@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-rollup"],
  js: {
    myBundle: {
      source: "js/script.ts"
    }
  }
};
