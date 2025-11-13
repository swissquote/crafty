module.exports = {
  presets: ["@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-rspack"],
  js: {
    myBundle: {
      source: "js/script.ts",
      tsconfigFile: "tsconfig-alt.json"
    }
  }
};
