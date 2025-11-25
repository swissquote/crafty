const sizeOf = require("image-size");
var resolvePath = require("./path");

module.exports = async function size(to, options) {
  const resolvedPath = await resolvePath(to, options);

  try {
    const { width, height } = sizeOf(resolvedPath);
    return { width, height };
  } catch (errInternal) {
    throw new Error(`${errInternal.message}: ${resolvedPath}`);
  }
};
