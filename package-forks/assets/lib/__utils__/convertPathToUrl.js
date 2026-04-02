const sep = require("node:path").sep;

module.exports = function convertPathToUrl(path) {
  return path.split(sep).join("/");
};
