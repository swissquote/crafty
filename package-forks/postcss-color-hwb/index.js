/**
 * Module dependencies.
 */
const functions = require("postcss-functions");
const { hwb2rgb } = require("@swissquote/color-fns");

function clamp(num, min, max) {
  return Math.min(Math.max(min, num), max);
}

function round(number, digits = 3, base = Math.pow(10, digits)) {
  return Math.round(base * number) / base + 0;
}

function color2rgbLegacyString(rgb, a) {
  const isOpaque = a === 1;
  const name = isOpaque ? "rgb" : "rgba";
  const red = Math.round((rgb[0] * 255) / 100);
  const green = Math.round((rgb[1] * 255) / 100);
  const blue = Math.round((rgb[2] * 255) / 100);
  const alpha = round(a);

  const optionalAlpha = isOpaque ? "" : `, ${alpha}`;

  return `${name}(${red}, ${green}, ${blue}${optionalAlpha})`;
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

        return color2rgbLegacyString(hwb2rgb(h,w,b), a);
      }
    }
  }),
  postcssPlugin: "postcss-color-hwb"
});

module.exports.postcss = true;
