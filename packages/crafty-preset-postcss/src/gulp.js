function cssTask(crafty, StreamHandler, bundle) {
  return function(cb) {
    // Init
    const destination =
      crafty.config.destination_css +
      (bundle.directory ? `/${bundle.directory}` : "");

    const getProcessors = require("@swissquote/postcss-swissquote-preset/processors");
    const postcss = require("../packages/gulp-postcss.js");
    const rename = require("../packages/gulp-rename.js");
    const scssParser = require("postcss-scss");
    const touch = require("./touch.js");

    return new StreamHandler(
      bundle.source,
      destination,
      cb,
      { sourcemaps: true },
      { sourcemaps: "." }
    )
      .add(
        postcss(getProcessors(crafty.config, crafty, bundle), {
          parser: scssParser
        })
      )
      .add(rename(bundle.destination))
      .add(touch())
      .generate();
  };
}

module.exports.createTask = cssTask;
