/*
 ** Taken from https://github.com/rollup/rollup/blob/b949eb08169115ff66648838cbc4833379bf9440/src/utils/relativeId.js
 ** We might need to keep this up-to-date with new updates of Rollup
 */

const relative = require("path").relative;

const absolutePath = /^(?:\/|(?:[A-Za-z]:)?[\\|/])/;

function isAbsolute(path) {
  return absolutePath.test(path);
}

module.exports = function relativeId(id) {
  if (typeof process === "undefined" || !isAbsolute(id)) {
    return id;
  }
  return relative(process.cwd(), id);
};
