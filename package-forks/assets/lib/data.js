const encodeBuffer = require("./__utils__/encodeBuffer");
const urlParser = require("./__utils__/urlParser");
const fs = require("node:fs");
const { lookup } = require("mrmime");
const resolvePath = require("./path");

module.exports = async function data(to, options) {
  /* eslint-disable-next-line no-param-reassign */
  options = {
    basePath: ".",
    loadPaths: [],
    ...options
  };

  const toUrl = urlParser(to);

  const resolvedPath = await resolvePath(toUrl.pathname, options);

  const mediaType = lookup(resolvedPath);
  const buffer = await fs.promises.readFile(resolvedPath);

  const content = encodeBuffer(buffer, mediaType);
  return `data:${mediaType};${content}${toUrl.hash || ""}`;
};
