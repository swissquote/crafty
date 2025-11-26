var convertPathToUrl = require("./convertPathToUrl");
var ensureTrailingSlash = require("./ensureTrailingSlash");
var path = require("path");
var url = require("url");

module.exports = function(baseUrl, basePath, resolvedPath) {
  var from = ensureTrailingSlash(baseUrl);
  var to = path.relative(basePath, resolvedPath);
  const withTrailingSlash = url.resolve(from, convertPathToUrl(to));

  if (
    !withTrailingSlash.startsWith("/") &&
    !withTrailingSlash.startsWith("http")
  ) {
    return `/${withTrailingSlash}`;
  }

  return withTrailingSlash;
};
