const { Transform } = require("stream");

module.exports = function() {
  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (file.isNull()) {
        return cb(null, file);
      }

      file.stat.mtime = Date.now();
      file.stat.ctime = Date.now();

      return cb(null, file);
    }
  });
};
