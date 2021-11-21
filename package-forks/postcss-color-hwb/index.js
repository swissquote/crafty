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
      hwb(hue, whiteness, blackness, alpha) {
        const h = ((parseFloat(hue) % 360) + 360) % 360;
        const w = clamp(parseFloat(whiteness), 0, 100);
        const b = clamp(parseFloat(blackness), 0, 100);

        const parsedAlpha = parseFloat(alpha);
        const a = clamp(isNaN(parsedAlpha) ? 1 : parsedAlpha, 0, 1);

        return colord({ h, w, b, a }).toRgbString();
      }
    }
  }),
  postcssPlugin: "postcss-color-hwb"
});

module.exports.postcss = true;
