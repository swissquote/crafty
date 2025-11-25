var convertPathToUrl = require("./convertPathToUrl");
var urlParser = require("./urlParser");
var path = require("path");

module.exports = function(urlStr) {
  var urlObj = urlParser(urlStr);
  urlObj.pathname = convertPathToUrl(path.join(urlObj.pathname, path.sep));
  return urlObj.toString();
};
