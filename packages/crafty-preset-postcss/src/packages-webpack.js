
function cssLoader() {
    return require("css-loader");
}

function postcssLoader() {
    return require("postcss-loader");
}

function styleLoader() {
    return require("style-loader");
}

module.exports = {
    cssLoader,
    postcssLoader,
    styleLoader
}