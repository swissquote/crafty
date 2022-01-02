// ansi-colors provides a function equivalent to strip-ansi.
// we can subsitute it and remove that size
module.exports = require("../dist/compiled/common-packages.js").ansiColors().unstyle;
