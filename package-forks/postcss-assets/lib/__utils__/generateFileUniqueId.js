const fs = require("node:fs");

module.exports = function generateFileUniqueId(resolvedPath) {
  const { mtime } = fs.statSync(resolvedPath);
  return mtime.getTime().toString(16);
};
