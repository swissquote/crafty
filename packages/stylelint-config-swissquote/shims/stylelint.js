// Stylelint is bundled with Crafty
// If this package is used within Crafty, we need to use it from "@swissquote/crafty-preset-stylelint"
// Otherwise we fallback in loading stylelint directly

let imported;

try {
    imported = await import("@swissquote/crafty-preset-stylelint/packages/stylelint.js");
} catch (e) {
    imported = await import("stylelint");
}

export const postcss= true;
export const lint = imported.default.lint;
export const rules = imported.default.rules;
export const formatters = imported.default.formatters;
export const createPlugin = imported.default.createPlugin;
export const resolveConfig = imported.default.resolveConfig;
export const utils = imported.default.utils;
export const reference = imported.default.reference;

export default imported.default;

