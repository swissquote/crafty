const plumber = require("gulp-plumber");

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
    let stream = gulp.src(this.source);

    this.handlers.forEach(handler => {
      stream = stream.pipe(handler);
    });

    return stream.pipe(gulp.dest(this.destination));
  }
};

module.exports.init = function(outerCrafty, outerGulp) {
  crafty = outerCrafty;
  gulp = outerGulp;
};
