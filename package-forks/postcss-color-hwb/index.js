/**
 * Module dependencies.
 */
const functions = require("postcss-functions");
const { colord, extend } = require("colord");
const hwbPlugin = require("colord/plugins/hwb");

extend([hwbPlugin]);

function clamp(num, min, max) {
  return Math.min(Math.max(min, num), max);
}

/**
 * PostCSS plugin to transform hwb() to rgb()
 */
module.exports = () => ({
  ...functions({
    functions: {
      hwb(h, w, b, a) {
        h = ((parseFloat(h) % 360) + 360) % 360;
        w = clamp(parseFloat(w), 0, 100);
        b = clamp(parseFloat(b), 0, 100);

        const alpha = parseFloat(a);
        a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

        return colord({ h, w, b, a }).toRgbString();
      },
    },
  }),
  postcssPlugin: "postcss-color-hwb",
});

module.exports.postcss = true;
