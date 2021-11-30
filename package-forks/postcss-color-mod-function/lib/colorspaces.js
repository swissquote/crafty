/*
 * https://drafts.csswg.org/css-color-4/#hsl-to-rgb
 * https://drafts.csswg.org/css-color-4/#hwb-to-rgb
 * https://github.com/LeaVerou/color.js/blob/master/src/spaces/hsv.js
 * https://github.com/LeaVerou/color.js/blob/master/src/spaces/hsl.js
 * https://github.com/LeaVerou/color.js/blob/master/src/spaces/hwb.js
 */

function hsl2hsv(h, s, l) {
  s /= 100;
  l /= 100;

  let v = l + s * Math.min(l, 1 - l);

  return [
    h, // h is the same
    v === 0 ? 0 : 200 * (1 - l / v), // s
    100 * v,
  ];
}

function hsl2hwb(h, saturation, l) {
  let [, s, v] = hsl2hsv(h, saturation, l);

  return [h, (v * (100 - s)) / 100, 100 - v];
}

function hwb2hsv(h, w, b) {
  // Now convert percentages to [0..1]
  w /= 100;
  b /= 100;

  // Achromatic check (white plus black >= 1)
  let sum = w + b;
  if (sum >= 1) {
    let gray = w / sum;
    return [h, 0, gray * 100];
  }

  let v = 1 - b;
  let s = v === 0 ? 0 : 1 - w / v;
  return [h, s * 100, v * 100];
}

function hsv2hsl(h, s, v) {
  s /= 100;
  v /= 100;

  let l = v * (1 - s / 2);

  return [
    h, // h is the same
    l === 0 || l === 1 ? 0 : ((v - l) / Math.min(l, 1 - l)) * 100,
    l * 100,
  ];
}

function hwb2hsl(h, w, b) {
  return hsv2hsl(...hwb2hsv(h, w, b));
}

function rgb2hsl(r, g, b, fallbackhue) {
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let [h, s, l] = [NaN, 0, (min + max) / 2];
  let d = max - min;

  if (d !== 0) {
    s = l === 0 || l === 1 ? 0 : (max - l) / Math.min(l, 1 - l);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
    }

    h = h * 60;
  }

  return [h || fallbackhue, s * 100, l * 100];
}

function rgb2hwb(r, g, b, fallbackhue) {
  var hsl = rgb2hsl(r, g, b, fallbackhue);
  let h = hsl[0];
  // calculate white and black
  let whiteness = Math.min(r, g, b);
  let blackness = 1 - Math.max(r, g, b);
  return [h, whiteness * 100, blackness * 100];
}

function hsl2rgb(h, s, l) {
  h = h % 360;

  if (h < 0) {
    h += 360;
  }

  s /= 100;
  l /= 100;

  function f(n) {
    let k = (n + h / 30) % 12;
    let a = s * Math.min(l, 1 - l);
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  }

  return [f(0), f(8), f(4)].map((v) => v * 100);
}

function hwb2rgb(h, w, b) {
  // Now convert percentages to [0..1]
  w /= 100;
  b /= 100;

  // Achromatic check (white plus black >= 1)
  const sum = w + b;
  if (sum >= 1) {
    const gray = w / sum;
    return [gray * 100, gray * 100, gray * 100];
  }

  // From https://drafts.csswg.org/css-color-4/#hwb-to-rgb
  return hsl2rgb(h, 100, 50)
    .map((v) => v / 100)
    .map((v) => {
      return (v * (1 - w - b) + w) * 100;
    });
}

module.exports = {
  rgb2hsl,
  rgb2hwb,
  hsl2rgb,
  hsl2hwb,
  hwb2rgb,
  hwb2hsl,
};
