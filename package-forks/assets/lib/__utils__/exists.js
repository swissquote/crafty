var fs = require("fs");

module.exports = async function(filePath) {
  return fs.promises.stat(filePath).then(
    () => true,
    () => false
  );
};
