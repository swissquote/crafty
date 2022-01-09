module.exports = require("../dist/compiled/common-packages.js").sourceMapJs();

// we add this no-op function to source-map-js
// to make it a drop-in replacement of source-map 0.7.*
module.exports.SourceMapConsumer.prototype.destroy = function() {};
