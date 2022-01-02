const colors = require("../dist/compiled/common-packages.js").ansiColors();
const { createColorize } = require("../dist/compiled/common-packages.js").colorizeTemplate();

// Make it work with template functions
module.exports = createColorize(colors);

// Allow to instantiate new Chalk instances
module.exports.Instance = function() {
    return colors;
}

// Add color functions
Object.entries(colors).forEach(entry => {
    module.exports[entry[0]] = entry[1];
});
