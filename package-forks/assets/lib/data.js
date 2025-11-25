var encodeBuffer = require("./__utils__/encodeBuffer");
var urlParser = require("./__utils__/urlParser");
var fs = require("node:fs");
var { lookup } = require("mrmime");
var resolvePath = require("./path");

module.exports = async function data(to, options) {
  /* eslint-disable-next-line no-param-reassign */
  options = {
    basePath: ".",
    loadPaths: [],
    ...options
  };

  const toUrl = urlParser(to);

  const resolvedPath = await resolvePath(toUrl.pathname, options);

  var mediaType = lookup(resolvedPath);
  const buffer = await fs.promises.readFile(resolvedPath);

  var content = encodeBuffer(buffer, mediaType);
  return `data:${mediaType};${content}${toUrl.hash || ""}`;
};
