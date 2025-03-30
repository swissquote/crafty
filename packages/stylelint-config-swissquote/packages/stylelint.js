import { stylelint } from "../dist/stylelint/bundled.js";

// Rslib does a weird job at importing the stylelint package
// as it is a postcss plugin.
// Here we export exactly the same as the stylelint package

export const postcss = stylelint.postcss;
export const lint = stylelint.lint;
export const rules = stylelint.rules;
export const formatters = stylelint.formatters;
export const createPlugin = stylelint.createPlugin; 
export const resolveConfig = stylelint.resolveConfig;
export const _createLinter = stylelint._createLinter;
export const utils = stylelint.utils;
export const reference = stylelint.reference;
export default stylelint;
