module.exports = {
  presets: ["@swissquote/crafty-preset-babel", "@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-webpack"],
  js: {
    myTSBundle: {
      source: "js/typescript.ts"
    }
  }
};
