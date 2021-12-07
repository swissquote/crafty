const plumber = require("@swissquote/gulp-plumber");
const pump = require("pump");

let crafty;
let gulp;

module.exports = class StreamHandler {
  constructor(source, destination, callback) {
    this.source = source;
    this.destination = destination;
    this.handlers = [];
    this.callback = callback;

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
    const sourceStream = gulp.src(this.source);
    const destStream = gulp.dest(this.destination);

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
