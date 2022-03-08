/**
 * Module dependencies.
 */
const parser = require("postcss-value-parser");
const units = require("units-css");
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

function legacyAlpha(alphaRaw) {
  let alpha = alphaRaw;
  if (alpha.includes("%")) {
    alpha = `${alpha.slice(0, -1) / 100}`;
  }
  return alpha.replace(/^0\./, ".");
}

function legacyHue(hue) {
  if (/.*(?:deg|grad|rad|turn)/.test(hue)) {
    return Math.round(units.convert("deg", hue) * 1000) / 1000;
  }
  return hue;
}

function getColorData(colorFn) {
  const hslSyntaxPlusAltRegex = /(hwb)\s*\(\s*(\d*\.?\d+(?:deg|grad|rad|turn)?)(?:\s+|(?:\s*,\s*))(\d*\.?\d+%)(?:\s+|(?:\s*,\s*))(\d*\.?\d+%)(?:\s*[,/]\s*(\d*\.?\d+%?))?\s*\)/g;

  const match = hslSyntaxPlusAltRegex.exec(colorFn);
  if (match === null) return false;
  return {
    fn: match[1],
    hue: legacyHue(match[2]),
    whiteness: match[3],
    blackness: match[4],
    alpha: match[5] ? legacyAlpha(match[5]) : false
  };
}

function legacy(args) {
  const { hue, whiteness, blackness, alpha } = getColorData(args);

  const h = ((parseFloat(hue) % 360) + 360) % 360;
  const w = clamp(parseFloat(whiteness), 0, 100);
  const b = clamp(parseFloat(blackness), 0, 100);

  const parsedAlpha = parseFloat(alpha);
  const a = clamp(isNaN(parsedAlpha) ? 1 : parsedAlpha, 0, 1);

  return color2rgbLegacyString(hwb2rgb(h, w, b), a);
}

function transformHwb(value) {
  return parser(value)
    .walk(node => {
      /* istanbul ignore if */
      if (node.type !== "function" || node.value !== "hwb") {
        return;
      }
      node.value = legacy(parser.stringify(node));
      node.type = "word";
    })
    .toString();
}

/**
 * PostCSS plugin to transform hwb() to rgb()
 */
module.exports = () => ({
  postcssPlugin: "postcss-color-hwb",
  Declaration(decl) {
    /* istanbul ignore if */
    if (!decl.value || decl.value.indexOf("hwb(") === -1) {
      return;
    }
    decl.value = transformHwb(decl.value);
  }
});

module.exports.postcss = true;
