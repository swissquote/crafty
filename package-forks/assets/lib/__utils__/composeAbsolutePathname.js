import convertPathToUrl from "./convertPathToUrl.js";
import ensureTrailingSlash from "./ensureTrailingSlash.js";
import path from "node:path";
import url from "node:url";

export default function composeAbsolutePathname(
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
}
