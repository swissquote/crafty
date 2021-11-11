
function postcssResolveNestedSelector() {
    return require("postcss-resolve-nested-selector");
}

function postcssSelectorParser() {
    return require("postcss-selector-parser");
}

function postcssValueParser() {
    return require("postcss-value-parser");
}

function stylelintNoUnsupportedBrowserFeatures() {
    return require("stylelint-no-unsupported-browser-features");
}

function stylelintPrettier() {
    return require("stylelint-prettier");
}

function stylelintScss() {
    return require("stylelint-scss");
}

module.exports = {
    postcssResolveNestedSelector,
    postcssSelectorParser,
    postcssValueParser,
    stylelintNoUnsupportedBrowserFeatures,
    stylelintPrettier,
    stylelintScss
}