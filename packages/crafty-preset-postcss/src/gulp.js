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

    getProcessors(crafty.config, crafty, bundle)
      .then(processors => {
        new StreamHandler(
          bundle.source,
          destination,
          cb,
          { sourcemaps: true },
          { sourcemaps: "." }
        )
          .add(postcss(processors, { parser: scssParser }))
          .add(rename(bundle.destination))
          .add(touch())
          .generate();
      })
      .catch(cb);
  };
}

module.exports.createTask = cssTask;
