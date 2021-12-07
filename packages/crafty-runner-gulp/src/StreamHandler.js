const plumber = require("@swissquote/gulp-plumber");

let crafty;
let gulp;

module.exports = class StreamHandler {
  constructor(source, destination, errorCallback) {
    this.source = source;
    this.destination = destination;
    this.handlers = [];

    // Prevent the build from stopping
    // if we are in watch mode
    if (crafty.isWatching()) {
      this.add(
        plumber(error => {
          crafty.error(error);

          if (errorCallback) {
            errorCallback();
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

    const mergedStream = this.handlers.reduce(
      (stream, handler) => stream.pipe(handler),
      sourceStream
    );

    return mergedStream.pipe(gulp.dest(this.destination));
  }
};

module.exports.init = function(outerCrafty, outerGulp) {
  crafty = outerCrafty;
  gulp = outerGulp;
};
