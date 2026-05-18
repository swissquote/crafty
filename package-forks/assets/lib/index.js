import data from "./data.js";
import path from "./path.js";
import size from "./size.js";
import url from "./url.js";

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
  Assets.prototype[resolver] = function(filePath, callback) {
    return Assets[resolver](filePath, this.options, callback);
  };
});

export default Assets;
