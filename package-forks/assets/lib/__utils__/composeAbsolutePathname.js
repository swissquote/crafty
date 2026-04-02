const convertPathToUrl = require("./convertPathToUrl");
const ensureTrailingSlash = require("./ensureTrailingSlash");
const path = require("node:path");
const url = require("node:url");

module.exports = function composeAbsolutePathname(
  baseUrl,
  basePath,
  resolvedPath
) {
  const from = ensureTrailingSlash(baseUrl);
  const to = path.relative(basePath, resolvedPath);
  const withTrailingSlash = url.resolve(from, convertPathToUrl(to));

  if (
    !withTrailingSlash.startsWith("/") &&
    !withTrailingSlash.startsWith("http")
  ) {
    return `/${withTrailingSlash}`;
  }

  return withTrailingSlash;
};
