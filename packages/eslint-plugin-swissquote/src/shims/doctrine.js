/**
 * This is a tiny implementation that provides the same feature as
 * what's used from https://www.npmjs.com/package/doctrine
 * but using https://www.npmjs.com/package/comment-parser
 */

const parser = require("../../dist/comment-parser/index.js");

const instance = parser.default();

module.exports = {
  parse(content, options) {
    const parsed = instance(`/**\n${content}\n*/`);

    return parsed[0];
  }
};
