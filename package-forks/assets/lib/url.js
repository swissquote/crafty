const composeAbsolutePathname = require("./__utils__/composeAbsolutePathname");
const composeQueryString = require("./__utils__/composeQueryString");
const composeRelativePathname = require("./__utils__/composeRelativePathname");
const defaultCachebuster = require("./__utils__/defaultCachebuster");
const urlFormatter = require("./__utils__/urlFormatter");
const urlParser = require("./__utils__/urlParser");
const resolvePath = require("./path");

function applyCacheBuster(toUrl, resolvedPath, options) {
  const cachebusterOutput = options.cachebuster(resolvedPath, toUrl.pathname);
  if (cachebusterOutput) {
    if (typeof cachebusterOutput !== "object") {
      composeQueryString(toUrl.searchParams, String(cachebusterOutput));
    } else {
      if (cachebusterOutput.pathname) {
        toUrl.pathname = cachebusterOutput.pathname;
      }
      if (cachebusterOutput.query) {
        composeQueryString(toUrl.searchParams, cachebusterOutput.query);
      }
    }
  }
}

module.exports = async (to, options) => {
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

  const toUrl = urlParser(to);

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

  return urlFormatter(toUrl);
};
