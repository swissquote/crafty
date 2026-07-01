module.exports = {
  presets: [
    "@swissquote/crafty-preset-swc",
    "@swissquote/crafty-preset-react",
    "@swissquote/crafty-runner-webpack"
  ],
  js: {
    myBundle: {
      externals: ["react/**"],
      source: "js/script.js",
      // React preset enabled, but the React Compiler is left off (the default).
      react: true
    }
  }
};
