# Code From
- https://github.com/csstools/postcss-color-mod-function

## Changes from the original version

- Replaced `@csstools/convert-colors` with embedded color conversion functions
  - Fixes an issue with conversion from HWB to RGB that should have result in gray (When W + B > 100 the color is some gray)
- Blending in hwb and hsl now uses the shortest path when changing the hue, caused surprising colors before.
- When stringifying, values are rounded to three decimals
- Fix luminance calculation, which causes all contrast calculations to behave differently (though correct compared to the specification)