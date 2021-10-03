module.exports = {
  browsers: "ie 11",
  presets: ["@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-gulp"],
  js: {
    myBundle: {
      source: "js/**/*.ts"
    }
  }
};
