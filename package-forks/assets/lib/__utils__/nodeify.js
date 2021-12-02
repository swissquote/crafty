/* eslint-disable no-param-reassign,consistent-return */
module.exports = function nodeify(original) {
  return async function(to, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }

    try {
      const result = await original(to, options);

      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (err) {
      if (callback) {
        callback(err);
      } else {
        throw err;
      }
    }
  };
};
