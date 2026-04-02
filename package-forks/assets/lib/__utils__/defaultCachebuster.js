const fs = require("node:fs");

module.exports = function defaultCachebuster(resolvedPath) {
  const mtime = fs.statSync(resolvedPath).mtime;
  return mtime.getTime().toString(16);
};
