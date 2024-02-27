
module.exports = {
  externals: [
    "react",
    "react-dom",
    "prop-types"
  ],
  presets: [
    "@swissquote/crafty-preset-typescript",
    "@swissquote/crafty-preset-jest",
    "@swissquote/crafty-preset-react",
    "@swissquote/crafty-runner-gulp"
  ],
  js: {
    app: {
      runner: "gulp/typescript",
      source: ["js/**/*.ts", "js/**/*.tsx", "!**/__tests__/**"],
    }
  },
  jest(crafty, options) {
    options.testEnvironment = "jsdom";
  },
  webpack(crafty, bundle, chain) {
    // Code Splitting needs this to work correctly
    if (crafty.getEnvironment() === "production") {
      chain.output.publicPath('dist/js/');
    }
  }
};
