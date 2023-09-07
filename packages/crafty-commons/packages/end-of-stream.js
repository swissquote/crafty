// Since Node 15.0.0 'end-of-stream' is a standard Node.JS API
//const { finished } = require('node:stream/promises');
//module.exports = finished;

module.exports = require("../dist/end-of-stream/index.js");
