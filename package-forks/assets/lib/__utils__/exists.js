const fs = require("node:fs");

module.exports = async function exists(filePath) {
  return fs.promises.stat(filePath).then(
    () => true,
    () => false
  );
};
