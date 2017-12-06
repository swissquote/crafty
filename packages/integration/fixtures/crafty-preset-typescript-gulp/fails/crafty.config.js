module.exports = {
  presets: ["@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-gulp"],
  js: {
    myBundle: {
      source: "js/**/*.ts"
    }
  }
};
