/* eslint-disable no-use-before-define,no-nested-ternary */
const {
  rgb2hsl,
  rgb2hwb,
  hsl2rgb,
  hsl2hwb,
  hwb2rgb,
  hwb2hsl
} = require("@swissquote/color-fns");

module.exports = class Color {
  constructor(color) {
    this.color = Object(Object(color).color || color);

    this.color.colorspace = this.color.colorspace
      ? this.color.colorspace
      : "red" in color && "green" in color && "blue" in color
      ? "rgb"
      : "hue" in color && "saturation" in color && "lightness" in color
      ? "hsl"
      : "hue" in color && "whiteness" in color && "blackness" in color
      ? "hwb"
      : "unknown";

    if (color.colorspace === "rgb") {
      this.color.hue = rgb2hsl(
        color.red / 100,
        color.green / 100,
        color.blue / 100,
        color.hue || 0
      )[0];
    }
  }

  alpha(alpha) {
    const color = this.color;

    return alpha === undefined
      ? color.alpha
      : new Color(assign(color, { alpha }));
  }

  blackness(blackness) {
    const hwb = color2hwb(this.color);

    return blackness === undefined
      ? hwb.blackness
      : new Color(assign(hwb, { blackness }));
  }

  blend(color, percentage, colorspace = "rgb") {
    const base = this.color;

    return new Color(blend(base, color, percentage, colorspace));
  }

  blenda(color, percentage, colorspace = "rgb") {
    const base = this.color;

    return new Color(blend(base, color, percentage, colorspace, true));
  }

  blue(blue) {
    const rgb = color2rgb(this.color);

    return blue === undefined ? rgb.blue : new Color(assign(rgb, { blue }));
  }

  contrast(percentage) {
    const base = this.color;

    return new Color(contrast(base, percentage));
  }

  green(green) {
    const rgb = color2rgb(this.color);

    return green === undefined ? rgb.green : new Color(assign(rgb, { green }));
  }

  hue(hue) {
    const hsl = color2hsl(this.color);

    return hue === undefined ? hsl.hue : new Color(assign(hsl, { hue }));
  }

  lightness(lightness) {
    const hsl = color2hsl(this.color);

    return lightness === undefined
      ? hsl.lightness
      : new Color(assign(hsl, { lightness }));
  }

  red(red) {
    const rgb = color2rgb(this.color);

    return red === undefined ? rgb.red : new Color(assign(rgb, { red }));
  }

  rgb(red, green, blue) {
    const rgb = color2rgb(this.color);

    return new Color(assign(rgb, { red, green, blue }));
  }

  saturation(saturation) {
    const hsl = color2hsl(this.color);

    return saturation === undefined
      ? hsl.saturation
      : new Color(assign(hsl, { saturation }));
  }

  shade(percentage) {
    const hwb = color2hwb(this.color);
    const shade = { hue: 0, whiteness: 0, blackness: 100, colorspace: "hwb" };
    const colorspace = "rgb";

    return percentage === undefined
      ? hwb.blackness
      : new Color(blend(hwb, shade, percentage, colorspace));
  }

  tint(percentage) {
    const hwb = color2hwb(this.color);
    const tint = { hue: 0, whiteness: 100, blackness: 0, colorspace: "hwb" };
    const colorspace = "rgb";

    return percentage === undefined
      ? hwb.blackness
      : new Color(blend(hwb, tint, percentage, colorspace));
  }

  whiteness(whiteness) {
    const hwb = color2hwb(this.color);

    return whiteness === undefined
      ? hwb.whiteness
      : new Color(assign(hwb, { whiteness }));
  }

  toLegacy() {
    return color2legacyString(this.color);
  }

  toString() {
    return color2string(this.color);
  }
};

/* Blending
/* ========================================================================== */

function constrain(angle) {
  return ((angle % 360) + 360) % 360;
}

/**
 * Adjust angles to use the shortest path
 */
function adjustAngles(angles) {
  let [a1, a2] = angles.map(constrain);
  const angleDiff = a2 - a1;

  if (angleDiff > 180) {
    a1 += 360;
  } else if (angleDiff < -180) {
    a2 += 360;
  }

  return [a1, a2];
}

function blend(base, color, percentage, colorspace, isBlendingAlpha) {
  const addition = percentage / 100;
  const subtraction = 1 - addition;

  if (colorspace === "hsl") {
    const { hue: h1, saturation: s1, lightness: l1, alpha: a1 } = color2hsl(
      base
    );
    const { hue: h2, saturation: s2, lightness: l2, alpha: a2 } = color2hsl(
      color
    );

    const [h1bis, h2bis] = adjustAngles([h1, h2]);

    const [hue, saturation, lightness, alpha] = [
      constrain(h1bis * subtraction + h2bis * addition),
      s1 * subtraction + s2 * addition,
      l1 * subtraction + l2 * addition,
      isBlendingAlpha ? a1 * subtraction + a2 * addition : a1
    ];

    return { hue, saturation, lightness, alpha, colorspace: "hsl" };
  } else if (colorspace === "hwb") {
    const { hue: h1, whiteness: w1, blackness: b1, alpha: a1 } = color2hwb(
      base
    );
    const { hue: h2, whiteness: w2, blackness: b2, alpha: a2 } = color2hwb(
      color
    );

    const [h1bis, h2bis] = adjustAngles([h1, h2]);

    const [hue, whiteness, blackness, alpha] = [
      constrain(h1bis * subtraction + h2bis * addition),
      w1 * subtraction + w2 * addition,
      b1 * subtraction + b2 * addition,
      isBlendingAlpha ? a1 * subtraction + a2 * addition : a1
    ];

    return { hue, whiteness, blackness, alpha, colorspace: "hwb" };
  } else {
    const { red: r1, green: g1, blue: b1, alpha: a1 } = color2rgb(base);
    const { red: r2, green: g2, blue: b2, alpha: a2 } = color2rgb(color);

    const [red, green, blue, alpha] = [
      r1 * subtraction + r2 * addition,
      g1 * subtraction + g2 * addition,
      b1 * subtraction + b2 * addition,
      isBlendingAlpha ? a1 * subtraction + a2 * addition : a1
    ];

    return { red, green, blue, alpha, colorspace: "rgb" };
  }
}

/* Assign channels to a new instance of a base color
/* ========================================================================== */

function assign(base, channels) {
  const color = Object.assign({}, base);

  Object.keys(channels).forEach(channel => {
    // detect channel
    const isHue = channel === "hue";
    const isRGB = !isHue && blueGreenRedMatch.test(channel);

    // normalized value of the channel
    const value = normalize(channels[channel], channel);

    // assign channel to new object
    color[channel] = value;

    if (isRGB) {
      // conditionally preserve the hue
      color.hue = rgb2hsl(
        color.red / 100,
        color.green / 100,
        color.blue / 100,
        base.hue || 0
      )[0];
    }
  });

  return color;
}

function normalize(value, channel) {
  // detect channel
  const isHue = channel === "hue";

  // value limitations
  const min = 0;
  const max = isHue ? 360 : 100;

  return Math.min(Math.max(isHue ? value % 360 : value, min), max);
}

/* Convert colors
/* ========================================================================== */

function color2rgb(color) {
  const [red, green, blue] =
    color.colorspace === "hsl"
      ? hsl2rgb(color.hue, color.saturation, color.lightness)
      : color.colorspace === "hwb"
      ? hwb2rgb(color.hue, color.whiteness, color.blackness)
      : [color.red, color.green, color.blue];

  return {
    red,
    green,
    blue,
    hue: color.hue,
    alpha: color.alpha,
    colorspace: "rgb"
  };
}

function color2hsl(color) {
  const [hue, saturation, lightness] =
    color.colorspace === "rgb"
      ? rgb2hsl(
          color.red / 100,
          color.green / 100,
          color.blue / 100,
          color.hue || 0
        )
      : color.colorspace === "hwb"
      ? hwb2hsl(color.hue, color.whiteness, color.blackness)
      : [color.hue, color.saturation, color.lightness];

  return { hue, saturation, lightness, alpha: color.alpha, colorspace: "hsl" };
}

function color2hwb(color) {
  const [hue, whiteness, blackness] =
    color.colorspace === "rgb"
      ? rgb2hwb(
          color.red / 100,
          color.green / 100,
          color.blue / 100,
          color.hue || 0
        )
      : color.colorspace === "hsl"
      ? hsl2hwb(color.hue, color.saturation, color.lightness)
      : [color.hue, color.whiteness, color.blackness];

  return { hue, whiteness, blackness, alpha: color.alpha, colorspace: "hwb" };
}

/* Contrast functions
/* ========================================================================== */

function contrast(color, percentage) {
  // https://drafts.csswg.org/css-color/#contrast-adjuster
  const hwb = color2hwb(color);
  const rgb = color2rgb(color);

  // compute the luminance of the color.
  const luminance = rgb2luminance(rgb.red, rgb.green, rgb.blue);

  // the maximum-contrast color, if it is less than .5
  const maxContrastColor =
    luminance < 0.5
      ? // hwb(X, 100%, 0%), where X is the hue angle of the color
        {
          hue: hwb.hue,
          whiteness: 100,
          blackness: 0,
          alpha: hwb.alpha,
          colorspace: "hwb"
        }
      : // otherwise, hwb(X, 0%, 100%), where X is the hue angle of the color
        {
          hue: hwb.hue,
          whiteness: 0,
          blackness: 100,
          alpha: hwb.alpha,
          colorspace: "hwb"
        };

  // contrast ratio
  const contrastRatio = colors2contrast(color, maxContrastColor);

  const minContrastColor =
    contrastRatio > 4.5
      ? // the color with the smallest contrast ratio with the base color that is greater than 4.5
        colors2contrastRatioColor(hwb, maxContrastColor)
      : // otherwise, the maximum-contrast color
        maxContrastColor;

  // color(maximum-contrast blend(minimum-contrast <percentage> hwb)));
  return blend(maxContrastColor, minContrastColor, percentage, "hwb", false);
}

function colors2contrast(color1, color2) {
  // https://drafts.csswg.org/css-color/#contrast-ratio
  const rgb1 = color2rgb(color1);
  const rgb2 = color2rgb(color2);
  const l1 = rgb2luminance(rgb1.red, rgb1.green, rgb1.blue);
  const l2 = rgb2luminance(rgb2.red, rgb2.green, rgb2.blue);

  return l1 > l2
    ? // if l1 is the relative luminance of the lighter of the colors
      (l1 + 0.05) / (l2 + 0.05)
    : // otherwise, if l2 is the relative luminance of the lighter of the colors
      (l2 + 0.05) / (l1 + 0.05);
}

function rgb2luminance(red, green, blue) {
  const [redLuminance, greenLuminance, blueLuminance] = [
    channel2luminance(red),
    channel2luminance(green),
    channel2luminance(blue)
  ];

  // https://drafts.csswg.org/css-color/#luminance
  return (
    0.2126 * redLuminance + 0.7152 * greenLuminance + 0.0722 * blueLuminance
  );
}

function channel2luminance(value) {
  // https://drafts.csswg.org/css-color/#luminance
  const ratio = (value * 2.55) / 255;
  return ratio < 0.04045
    ? ratio / 12.92
    : Math.pow((ratio + 0.055) / 1.055, 2.4);
}

// return the smallest contrast ratio from a color and a maximum contrast (credit: @thetalecrafter)
function colors2contrastRatioColor(hwb, maxHWB) {
  const modifiedHWB = Object.assign({}, hwb);

  // values to be used for linear interpolations in HWB space
  let minW = hwb.whiteness;
  let minB = hwb.blackness;
  let maxW = maxHWB.whiteness;
  let maxB = maxHWB.blackness;

  // find the color with the smallest contrast ratio with the base color that is greater than 4.5
  while (Math.abs(minW - maxW) > 100 || Math.abs(minB - maxB) > 100) {
    const midW = Math.round((maxW + minW) / 2);
    const midB = Math.round((maxB + minB) / 2);

    modifiedHWB.whiteness = midW;
    modifiedHWB.blackness = midB;

    if (colors2contrast(modifiedHWB, hwb) > 4.5) {
      maxW = midW;
      maxB = midB;
    } else {
      minW = midW;
      minB = midB;
    }
  }

  return modifiedHWB;
}

/* Match
/* ========================================================================== */

const blueGreenRedMatch = /^(blue|green|red)$/i;

/* Stringifiers
/* ========================================================================== */

function round(number, digits = 3, base = Math.pow(10, digits)) {
  return Math.round(base * number) / base + 0;
}

function color2string(color) {
  return color.colorspace === "hsl"
    ? color2hslString(color)
    : color.colorspace === "hwb"
    ? color2hwbString(color)
    : color2rgbString(color);
}

function color2hslString(color) {
  const hsl = color2hsl(color);
  const isOpaque = hsl.alpha === 100;
  const hue = round(hsl.hue);
  const saturation = round(hsl.saturation);
  const lightness = round(hsl.lightness);
  const alpha = round(hsl.alpha);

  const optionalAlpha = isOpaque ? "" : ` / ${alpha}%`;

  return `hsl(${hue} ${saturation}% ${lightness}%${optionalAlpha})`;
}

function color2hwbString(color) {
  const hwb = color2hwb(color);
  const isOpaque = hwb.alpha === 100;
  const hue = round(hwb.hue);
  const whiteness = round(hwb.whiteness);
  const blackness = round(hwb.blackness);
  const alpha = round(hwb.alpha);

  const optionalAlpha = isOpaque ? "" : ` / ${alpha}%`;

  return `hwb(${hue} ${whiteness}% ${blackness}%${optionalAlpha})`;
}

function color2rgbString(color) {
  const rgb = color2rgb(color);
  const isOpaque = rgb.alpha === 100;
  const red = round(rgb.red);
  const green = round(rgb.green);
  const blue = round(rgb.blue);
  const alpha = round(rgb.alpha);

  const optionalAlpha = isOpaque ? "" : ` / ${alpha}%`;

  return `rgb(${red}% ${green}% ${blue}%${optionalAlpha})`;
}

function color2legacyString(color) {
  return color.colorspace === "hsl"
    ? color2hslLegacyString(color)
    : color2rgbLegacyString(color);
}

function color2rgbLegacyString(color) {
  const rgb = color2rgb(color);
  const isOpaque = rgb.alpha === 100;
  const name = isOpaque ? "rgb" : "rgba";
  const red = Math.round((rgb.red * 255) / 100);
  const green = Math.round((rgb.green * 255) / 100);
  const blue = Math.round((rgb.blue * 255) / 100);
  const alpha = round(rgb.alpha / 100);

  const optionalAlpha = isOpaque ? "" : `, ${alpha}`;

  return `${name}(${red}, ${green}, ${blue}${optionalAlpha})`;
}

function color2hslLegacyString(color) {
  const hsl = color2hsl(color);
  const isOpaque = hsl.alpha === 100;
  const name = isOpaque ? "hsl" : "hsla";
  const hue = round(hsl.hue);
  const saturation = round(hsl.saturation);
  const lightness = round(hsl.lightness);
  const alpha = round(hsl.alpha / 100);

  const optionalAlpha = isOpaque ? "" : `, ${alpha}`;

  return `${name}(${hue}, ${saturation}%, ${lightness}%${optionalAlpha})`;
}
