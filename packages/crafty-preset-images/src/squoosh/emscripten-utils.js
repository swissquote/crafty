/* eslint-disable no-param-reassign */
const { fileURLToPath } = require("url");

function pathify(path) {
  if (path.startsWith("file://")) {
    path = fileURLToPath(path);
  }
  return path;
}

function instantiateEmscriptenWasm(factory, path) {
  return factory({
    locateFile() {
      return pathify(path);
    }
  });
}

module.exports = {
  pathify,
  instantiateEmscriptenWasm
};
