const { Transform } = require("stream");
var EE = require("events").EventEmitter;
var fancyLog = require("fancy-log");
const colors = require("ansi-colors");
var PluginError = require("plugin-error");

function removeDefaultHandler(stream, event) {
  var found = false;
  stream.listeners(event).forEach(function(item) {
    if (item.name === `on${event}`) {
      found = item;
      this.removeListener(event, item);
    }
  }, stream);
  return found;
}

function wrapPanicOnErrorHandler(stream) {
  var oldHandler = removeDefaultHandler(stream, "error");
  if (oldHandler) {
    stream.on("error", function onerror2(er) {
      if (EE.listenerCount(stream, "error") === 1) {
        this.removeListener("error", onerror2);
        oldHandler.call(stream, er);
      }
    });
  }
}

function defaultErrorHandler(error) {
  // onerror2 and this handler
  if (EE.listenerCount(this, "error") < 3) {
    fancyLog(
      colors.cyan("Plumber") + colors.red(" found unhandled error:\n"),
      error.toString()
    );
  }
}

function plumber(opts) {
  /* eslint-disable-next-line no-param-reassign */
  opts = opts || {};

  if (typeof opts === "function") {
    /* eslint-disable-next-line no-param-reassign */
    opts = { errorHandler: opts };
  }

  var through = new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      cb(null, file);
    }
  });
  through._plumber = true;

  if (opts.errorHandler !== false) {
    through.errorHandler =
      typeof opts.errorHandler === "function"
        ? opts.errorHandler
        : defaultErrorHandler;
  }

  function patchPipe(stream) {
    if (stream.pipe2) {
      wrapPanicOnErrorHandler(stream);
      stream._pipe = stream._pipe || stream.pipe;
      stream.pipe = stream.pipe2;
      stream._plumbed = true;
    }
  }

  through.pipe2 = function pipe2(dest, ...rest) {
    if (!dest) {
      throw new PluginError("plumber", "Can't pipe to undefined");
    }

    this._pipe(dest, ...rest);

    if (dest._unplumbed) {
      return dest;
    }

    removeDefaultHandler(this, "error");

    if (dest._plumber) {
      return dest;
    }

    dest.pipe2 = pipe2;

    // Patching pipe method
    if (opts.inherit !== false) {
      patchPipe(dest);
    }

    // Placing custom on error handler
    if (this.errorHandler) {
      dest.errorHandler = this.errorHandler;
      dest.on("error", this.errorHandler.bind(dest));
    }

    dest._plumbed = true;

    return dest;
  };

  patchPipe(through);

  return through;
}

module.exports = plumber;

module.exports.stop = function() {
  var through = new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      cb(null, file);
    }
  });
  through._unplumbed = true;
  return through;
};
