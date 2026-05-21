const minimatchModule = require("../dist/minimatch/index.js");

const minimatch =
	typeof minimatchModule === "function"
		? minimatchModule
		: minimatchModule.minimatch;

if (typeof minimatch !== "function") {
	throw new TypeError("Expected minimatch to export a function");
}

Object.assign(minimatch, minimatchModule, {
	default: minimatch,
	minimatch
});

module.exports = minimatch;
