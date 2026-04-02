const convertPathToUrl = require("./convertPathToUrl");
const urlParser = require("./urlParser");
const path = require("node:path");

module.exports = function ensureTrailingSlash(urlStr) {
  const urlObj = urlParser(urlStr);
  urlObj.pathname = convertPathToUrl(path.join(urlObj.pathname, path.sep));
  return urlObj.toString();
};
