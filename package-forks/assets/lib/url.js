import composeAbsolutePathname from "./__utils__/composeAbsolutePathname.js";
import composeQueryString from "./__utils__/composeQueryString.js";
import composeRelativePathname from "./__utils__/composeRelativePathname.js";
import defaultCachebuster from "./__utils__/defaultCachebuster.js";
import urlFormatter from "./__utils__/urlFormatter.js";
import urlParser from "./__utils__/urlParser.js";
import resolvePath from "./path.js";

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

export default async (to, options) => {
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
