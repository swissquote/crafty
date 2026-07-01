module.exports = {
  presets: [
    "@swissquote/crafty-preset-swc",
    "@swissquote/crafty-preset-react",
    "@swissquote/crafty-runner-rspack"
  ],
  js: {
    myBundle: {
      // Keep React (and the injected `react/compiler-runtime`) external so the
      // compiler output stays visible in the bundle instead of being inlined.
      externals: ["react/**"],
      source: "js/script.js",
      react: {
        reactCompiler: true
      }
    }
  }
};
