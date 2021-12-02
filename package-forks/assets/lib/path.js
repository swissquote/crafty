var exists = require("./__utils__/exists");
var nodeify = require("./__utils__/nodeify");
var glob = require("glob");
var path = require("path");
const util = require("util");

var pglob = util.promisify(glob);

module.exports = nodeify(async (to, options) => {
  var loadPaths;

  /* eslint-disable-next-line no-param-reassign */
  options = {
    basePath: ".",
    loadPaths: [],
    ...options
  };

  loadPaths = [].concat(options.loadPaths);

  const filePaths = (
    await Promise.all(
      loadPaths.map(async loadPath => {
        const matchedPaths = await pglob(loadPath, {
          cwd: options.basePath
        });

        return matchedPaths.map(matchedPath => {
          return path.resolve(options.basePath, matchedPath, to);
        });
      })
    )
  ).flat();

  filePaths.unshift(path.resolve(options.basePath, to));

  for (const resolvedPath of filePaths) {
    /* eslint-disable-next-line no-await-in-loop */
    if (await exists(resolvedPath)) {
      return resolvedPath;
    }
  }

  throw new Error(`Asset not found or unreadable: ${to}`);
});
