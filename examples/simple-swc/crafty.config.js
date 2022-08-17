
module.exports = {
  externals: [
    "react",
    "react-dom",
    "prop-types"
  ],
  presets: [
    "@swissquote/crafty-runner-rollup",
    "@swissquote/crafty-preset-swc",
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-preset-jest",
    "@swissquote/crafty-preset-react",
    "@swissquote/crafty-runner-webpack",
    "@swissquote/crafty-runner-gulp"
  ],
  js: {
    app: {
      runner: "webpack",
      //libraryTarget: "umd",
      source: "js/app.js",
      hot: true,
      react: true
    }
  },
  css: {
    app: {
      source: "css/app.scss",
      watch: ["css/**"]
    }
  },
  jest(crafty, options) {
    options.testEnvironment = "jsdom";
  },
  webpack(crafty, bundle, chain) {

    // Do the requires when they're actually needed
    // Doing them at the top of the files will slow down all 
    // commands that don't actually need this dependency
    const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");

    // Code Splitting needs this to work correctly
    if (crafty.getEnvironment() === "production") {
      chain.output.publicPath('dist/js/');
    }

    // Enable serving with https
    //chain.devServer.https(true);

    // Only keep some locales in moment
    chain
      .plugin('contextReplacement')
      .use(ContextReplacementPlugin, [/moment[\/\\]locale$/, /(?:de|fr|en-gb)\.js/]);
  }
};
