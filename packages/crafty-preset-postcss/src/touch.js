const { Transform } = require("node:stream");

module.exports = function() {
  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (file.isNull()) {
        return cb(null, file);
      }

      const now = new Date();
      file.stat.mtime = now;
      file.stat.ctime = now;

      return cb(null, file);
    }
  });
};
