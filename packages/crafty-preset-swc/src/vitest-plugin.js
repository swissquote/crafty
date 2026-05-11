const swc = require("@swc/core");

function shouldTransform(filename) {
  return /\.(js|jsx|mjs|cjs)$/.test(filename);
}

module.exports = function createVitestPlugin(swcOptions) {
  return {
    name: "crafty-swc-vitest",
    enforce: "pre",
    async transform(code, id) {
      const [filename] = id.split("?");

      if (filename.includes("/node_modules/") || !shouldTransform(filename)) {
        return null;
      }

      const result = await swc.transform(code, {
        ...swcOptions,
        filename
      });

      return {
        code: result.code,
        map: result.map || null
      };
    }
  };
};