module.exports = {
  presets: ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-gulp"],
  js: {
    myBundle: {
      source: "js/**/*.js",
      concat: true
    }
  }
};
