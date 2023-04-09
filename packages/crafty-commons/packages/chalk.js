const colors = require("../dist/ansi-colors");
const { createColorize } = require("../dist/colorize-template/index.js");

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
