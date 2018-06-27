// Due to the fact crafty is linked, we need to get webpack like this,
// in any other project you can still "require('webpack')"
const webpack = require('webpack');

module.exports = {
  externals: [
    "react",
    "react-dom",
    "prop-types"
  ],
  presets: [
    "@swissquote/crafty-runner-rollup",
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-preset-typescript",
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
  gulp(crafty, gulp, StreamHandler) {
    gulp.watch(["js/*.js"]).on('change', function (path) {
      console.log("Change happened to", path);
    })
  },
  webpack(crafty, bundle, chain) {

    // Code Splitting needs this to work correctly
    chain
      .output
      .publicPath('dist/js/');

    // Only keep some locales in moment
    chain
      .plugin('contextReplacement')
      .use(webpack.ContextReplacementPlugin, [/moment[\/\\]locale$/, /(?:de|fr|en-gb)\.js/]);
  }
};
