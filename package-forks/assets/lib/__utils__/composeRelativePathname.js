const convertPathToUrl = require("./convertPathToUrl");
const path = require("node:path");

module.exports = function composeRelativePathname(
  basePath,
  relativeTo,
  resolvedPath
) {
  const from = path.resolve(basePath, relativeTo);
  const relativePath = path.relative(from, resolvedPath);
  return convertPathToUrl(relativePath);
};
