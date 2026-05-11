const babel = require("@babel/core");

module.exports = function createVitestPlugin(babelOptions) {
  return {
    name: "crafty-babel-vitest",
    enforce: "pre",
    async transform(code, id) {
      const [filename] = id.split("?");

      if (filename.includes("/node_modules/")) {
        return null;
      }

      if (babel.util && !babel.util.canCompile(filename)) {
        return null;
      }

      const result = await babel.transformAsync(code, {
        ...babelOptions,
        filename,
        sourceMaps: true
      });

      if (!result || !result.code) {
        return null;
      }

      return {
        code: result.code,
        map: result.map || null
      };
    }
  };
};