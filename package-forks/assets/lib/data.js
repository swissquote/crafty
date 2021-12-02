var encodeBuffer = require("./__utils__/encodeBuffer");
var fs = require("fs");
var { lookup } = require("mrmime");
var resolvePath = require("./path");
var url = require("url");
var nodeify = require("./__utils__/nodeify");

module.exports = nodeify(async (to, options) => {
  var toUrl;

  /* eslint-disable-next-line no-param-reassign */
  options = {
    basePath: ".",
    loadPaths: [],
    ...options
  };

  toUrl = url.parse(to);

  const resolvedPath = await resolvePath(toUrl.pathname, options);

  var mediaType = lookup(resolvedPath);
  const buffer = await fs.promises.readFile(resolvedPath);

  var content = encodeBuffer(buffer, mediaType);
  return `data:${mediaType};${content}${toUrl.hash || ""}`;
});
