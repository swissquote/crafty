module.exports = {
  mavenType: "webjar",
  presets: ["@swissquote/crafty-preset-maven", "@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-gulp"],
  js: {
    myBundle: {
      source: "js/file.js",
      concat: true
    }
  }
};
