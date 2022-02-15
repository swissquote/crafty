const plumber = require("../packages/gulp-plumber.js");
const pump = require("../packages/pump.js");

let crafty;
let gulp;

module.exports = class StreamHandler {
  constructor(source, destination, callback, srcOptions, destOptions) {
    this.source = source;
    this.destination = destination;
    this.handlers = [];
    this.callback = callback;
    this.srcOptions = srcOptions;
    this.destOptions = destOptions;

    // Prevent the build from stopping
    // if we are in watch mode
    if (crafty.isWatching()) {
      this.add(
        plumber(error => {
          crafty.error(error);

          if (callback) {
            callback(error);
          }
        })
      );
    }
  }

  add(handler) {
    this.handlers.push(handler);

    return this;
  }

  generate() {
    const sourceStream = gulp.src(this.source, this.srcOptions);
    const destStream = gulp.dest(this.destination, this.destOptions);

    return pump(sourceStream, ...this.handlers, destStream, err => {
      // Display the error if there is any
      if (err) {
        crafty.error(err);
      }

      // Signal completion
      if (this.callback) {
        this.callback(err);
      }
    });
  }
};

module.exports.init = function(outerCrafty, outerGulp) {
  crafty = outerCrafty;
  gulp = outerGulp;
};
