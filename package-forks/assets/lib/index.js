const data = require("./data");
const path = require("./path");
const size = require("./size");
const url = require("./url");

function Assets(options) {
  if (!(this instanceof Assets)) {
    return new Assets(options);
  }

  this.options = { ...options };
  Object.freeze(this);
}

Assets.data = data;
Assets.path = path;
Assets.size = size;
Assets.url = url;

["data", "path", "size", "url"].forEach(resolver => {
  Assets.prototype[resolver] = function(path, callback) {
    return Assets[resolver](path, this.options, callback);
  };
});

module.exports = Assets;
