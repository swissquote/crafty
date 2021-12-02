var composeAbsolutePathname = require("./__utils__/composeAbsolutePathname");
var composeQueryString = require("./__utils__/composeQueryString");
var composeRelativePathname = require("./__utils__/composeRelativePathname");
var defaultCachebuster = require("./__utils__/defaultCachebuster");
var nodeify = require("./__utils__/nodeify");
var resolvePath = require("./path");
var url = require("url");

function applyCacheBuster(toUrl, resolvedPath, options) {
  const cachebusterOutput = options.cachebuster(resolvedPath, toUrl.pathname);
  if (cachebusterOutput) {
    if (typeof cachebusterOutput !== "object") {
      toUrl.search = composeQueryString(
        toUrl.search,
        String(cachebusterOutput)
      );
    } else {
      if (cachebusterOutput.pathname) {
        toUrl.pathname = cachebusterOutput.pathname;
      }
      if (cachebusterOutput.query) {
        toUrl.search = composeQueryString(
          toUrl.search,
          cachebusterOutput.query
        );
      }
    }
  }
}

module.exports = nodeify(async (to, options) => {
  var toUrl;

  /* eslint-disable-next-line no-param-reassign */
  options = {
    basePath: ".",
    baseUrl: "/",
    cachebuster: false,
    relativeTo: false,
    ...options
  };

  if (options.cachebuster === true) {
    options.cachebuster = defaultCachebuster;
  }

  /* eslint-enable */

  toUrl = url.parse(to);

  const resolvedPath = await resolvePath(decodeURI(toUrl.pathname), options);

  if (options.relativeTo) {
    toUrl.pathname = composeRelativePathname(
      options.basePath,
      options.relativeTo,
      resolvedPath
    );
  } else {
    toUrl.pathname = composeAbsolutePathname(
      options.baseUrl,
      options.basePath,
      resolvedPath
    );
  }
  if (options.cachebuster) {
    applyCacheBuster(toUrl, resolvedPath, options);
  }

  return url.format(toUrl);
});
