const { PassThrough } = require("stream");
const fancyLog = require("fancy-log");
const colors = require("ansi-colors");
const PluginError = require("plugin-error");

function removeDefaultHandler(stream, event) {
  let found = false;
  stream.listeners(event).forEach(function(item) {
    if (item.name === `on${event}`) {
      found = item;
      this.removeListener(event, item);
    }
  }, stream);
  return found;
}

function wrapPanicOnErrorHandler(stream) {
  const oldHandler = removeDefaultHandler(stream, "error");
  if (oldHandler) {
    stream.on("error", function onerror2(er) {
      if (stream.listenerCount("error") === 1) {
        this.removeListener("error", onerror2);
        oldHandler.call(stream, er);
      }
    });
  }
}

function defaultErrorHandler(error) {
  // onerror2 and this handler
  if (this.listenerCount("error") < 3) {
    fancyLog(
      colors.cyan("Plumber") + colors.red(" found unhandled error:\n"),
      error.toString()
    );
  }
}

const PLUMBER_IS_PLUMBER = "plumber:isPlumber";
const PLUMBER_IS_PATCHED = "plumber:isPatched";
const PLUMBER_SKIP = "plumber:stop";

const PIPE_FN_PATCHED = Symbol.for("plumber:patched");
const PIPE_FN_ORIGINAL = Symbol.for("plumber:original");

function patchPipe(stream, alternatePipe) {
  wrapPanicOnErrorHandler(stream);

  //stream._pipe = stream._pipe || stream.pipe;
  stream[PIPE_FN_PATCHED] = alternatePipe;
  stream[PIPE_FN_ORIGINAL] = stream.pipe;
  stream.pipe = stream[PIPE_FN_PATCHED];
  stream[PLUMBER_IS_PATCHED] = true;
}

function plumber(opts = {}) {
  if (typeof opts === "function") {
    /* eslint-disable-next-line no-param-reassign */
    opts = { errorHandler: opts };
  }

  const through = new PassThrough({ objectMode: true });
  through[PLUMBER_IS_PLUMBER] = true;

  if (opts.errorHandler !== false) {
    through.errorHandler =
      typeof opts.errorHandler === "function"
        ? opts.errorHandler
        : defaultErrorHandler;
  }

  function alternatePipe(dest, ...rest) {
    if (!dest) {
      throw new PluginError("plumber", "Can't pipe to undefined");
    }

    // send to the real pipe()
    this[PIPE_FN_ORIGINAL](dest, ...rest);

    // If we called plumber.stop, dont go further
    if (dest[PLUMBER_SKIP]) {
      return dest;
    }

    removeDefaultHandler(this, "error");

    // if it is a new plumber, don't patch it
    if (dest[PLUMBER_IS_PLUMBER]) {
      return dest;
    }

    // Patching pipe method
    if (opts.inherit !== false) {
      patchPipe(dest, alternatePipe);
    }

    // Placing custom on error handler
    if (this.errorHandler) {
      dest.errorHandler = this.errorHandler;
      dest.on("error", this.errorHandler.bind(dest));
    }

    dest[PLUMBER_IS_PATCHED] = true;

    return dest;
  }

  patchPipe(through, alternatePipe);

  return through;
}

module.exports = plumber;

module.exports.stop = function() {
  const through = new PassThrough({ objectMode: true });
  through[PLUMBER_SKIP] = true;
  return through;
};

module.exports.isPlumbed = function(stream) {
  return !!stream[PLUMBER_IS_PATCHED];
};
