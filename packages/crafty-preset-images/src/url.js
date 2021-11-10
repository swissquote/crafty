const urlOrig = require("url");

/**
 * For some reason it seems that resolved URL inside of webpack makes the "url" module unhappy
 * This is a dumb workaround
 */
class URL {
  constructor(url) {
    this.url = url;
  }

  get href() {
    return `file://${this.url}`;
  }
}

module.exports = {
  ...urlOrig,
  URL
};
