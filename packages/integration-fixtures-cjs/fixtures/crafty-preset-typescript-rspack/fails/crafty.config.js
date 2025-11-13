module.exports = {
  presets: ["@swissquote/crafty-preset-babel", "@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-rspack"],
  js: {
    myTSBundle: {
      source: "js/typescript.ts"
    }
  }
};
