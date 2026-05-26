import exists from "./__utils__/exists.js";
import path from "node:path";
import fs from "node:fs/promises";

export default async function pathResolver(to, options) {
  /* eslint-disable-next-line no-param-reassign */
  options = {
    basePath: ".",
    loadPaths: [],
    ...options
  };

  const loadPaths = [].concat(options.loadPaths);

  const filePaths = [];
  const globOptions = { cwd: options.basePath };
  for await (const matchedPath of fs.glob(loadPaths, globOptions)) {
    filePaths.push(path.resolve(options.basePath, matchedPath, to));
  }

  filePaths.unshift(path.resolve(options.basePath, to));

  for (const resolvedPath of filePaths) {
    /* eslint-disable-next-line no-await-in-loop */
    if (await exists(resolvedPath)) {
      return resolvedPath;
    }
  }

  throw new Error(`Asset not found or unreadable: ${to}`);
}
