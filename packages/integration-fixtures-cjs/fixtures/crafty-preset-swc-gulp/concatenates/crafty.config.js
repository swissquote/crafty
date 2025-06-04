module.exports = {
  presets: ["@swissquote/crafty-preset-swc", "@swissquote/crafty-runner-gulp"],
  js: {
    myBundle: {
      source: "js/**/*.js",
      concat: true
    }
  }
};
