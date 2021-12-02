/* eslint-disable consistent-return */
const sizeOf = require("image-size");
var nodeify = require("./__utils__/nodeify");
var resolvePath = require("./path");

module.exports = nodeify(async (to, options) => {
  const resolvedPath = await resolvePath(to, options);

  try {
    const { width, height } = sizeOf(resolvedPath);
    return { width, height };
  } catch (errInternal) {
    throw new Error(`${errInternal.message}: ${resolvedPath}`);
  }
});
