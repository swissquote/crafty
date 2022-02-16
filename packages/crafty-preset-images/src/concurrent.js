// This is a clone of https://www.npmjs.com/package/concurrent-streams that uses raw streams
/* eslint-disable @swissquote/swissquote/sonarjs/cognitive-complexity */
/* eslint-disable no-param-reassign */

const { Transform } = require("stream");

module.exports = function concurrentStream(options, transform, flush) {
  var concurrent = 0,
    lastCallback = null,
    pendingFinish = null;

  if (typeof options === "function") {
    flush = transform;
    transform = options;
    options = {};
  }

  var maxConcurrency = options.maxConcurrency || 16;

  function _transform(message, enc, callback) {
    var self = this;
    var callbackCalled = false;
    concurrent++;
    if (concurrent < maxConcurrency) {
      // Ask for more right away
      callback();
    } else {
      // We're at the concurrency limit, save the callback for
      // when we're ready for more
      lastCallback = callback;
    }

    transform.call(this, message, enc, function(err) {
      // Ignore multiple calls of the callback (shouldn't ever
      // happen, but just in case)
      if (callbackCalled) return;
      callbackCalled = true;

      if (err) {
        self.emit("error", err);
      } else if (arguments.length > 1) {
        /* eslint-disable-next-line prefer-rest-params */
        self.push(arguments[1]);
      }

      concurrent--;
      if (lastCallback) {
        var cb = lastCallback;
        lastCallback = null;
        cb();
      }
      if (concurrent === 0 && pendingFinish) {
        pendingFinish();
        pendingFinish = null;
      }
    });
  }

  // Flush is always called only after Final has finished
  // to ensure that data from Final gets processed, so we only need one pending callback at a time
  function callOnFinish(original) {
    return function(callback) {
      if (concurrent === 0) {
        original.call(this, callback);
      } else {
        pendingFinish = original.bind(this, callback);
      }
    };
  }

  const t = new Transform(
    Object.assign({ objectMode: true, highWaterMark: 16 }, options)
  );

  t._transform = _transform;

  if (flush) {
    t._flush = callOnFinish(flush);
  }

  return t;
};
