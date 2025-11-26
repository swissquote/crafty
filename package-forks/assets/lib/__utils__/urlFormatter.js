const url = require("node:url");
const { URL } = require("node:url");

module.exports = function urlFormatter(obj) {
  if (obj instanceof URL) {
    return obj.toString();
  }

  if (obj.searchParams) {
    const params = [];
    for (const [key, value] of obj.searchParams.entries()) {
      params.push(value ? `${key}=${value}` : key);
    }
    obj.search = params.join("&");
  }

  return url.format(obj);
};
