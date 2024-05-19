"use strict";

const { Transform, PassThrough } = require("node:stream");

module.exports.noop = function () {
  return new PassThrough({ objectMode: true });
};

module.exports.peek = function (peekCallback) {
  return new Transform({
    objectMode: true,
    transform(data, enc, cb) {
      peekCallback(data);
      cb(null, data);
    },
  });
};
