'use strict';

var through = require('through2');

module.exports = function(options) {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) { return cb(null, file); }

    file.stat.mtime = Date.now();
    file.stat.ctime = Date.now();

    return cb(null, file);

  });
}
