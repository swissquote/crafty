import convertPathToUrl from "./convertPathToUrl.js";
import path from "node:path";

export default function composeRelativePathname(
  basePath,
  relativeTo,
  resolvedPath
) {
  const from = path.resolve(basePath, relativeTo);
  const relativePath = path.relative(from, resolvedPath);
  return convertPathToUrl(relativePath);
}
