import convertPathToUrl from "./convertPathToUrl.js";
import urlParser from "./urlParser.js";
import path from "node:path";

export default function ensureTrailingSlash(urlStr) {
  const urlObj = urlParser(urlStr);
  urlObj.pathname = convertPathToUrl(path.join(urlObj.pathname, path.sep));
  return urlObj.toString();
}
