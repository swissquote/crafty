
module.exports = {
  externals: [
    "react",
    "react-dom",
    "prop-types"
  ],
  mavenType: "webapp",
  presets: [
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-preset-typescript",
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-preset-jest",
    "@swissquote/crafty-preset-react",
    "@swissquote/crafty-preset-maven",
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
  gulp(crafty, gulp, StreamHandler) {
    // Copy index file
    gulp.task("index", () => {
      return gulp
        .src(["index.html"])
        .pipe(gulp.dest(crafty.config.destination));
    });

    // Register the watcher for the index file
    crafty.watcher.add(["index.html"], "index");

    crafty.addDefaultTask("index");
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
