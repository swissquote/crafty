module.exports = {
  presets: [
    "@swissquote/crafty-preset-swc",
    "@swissquote/crafty-preset-react",
    "@swissquote/crafty-runner-gulp"
  ],
  js: {
    myBundle: {
      source: "js/script.js",
      react: {
        reactCompiler: true
      }
    }
  }
};
