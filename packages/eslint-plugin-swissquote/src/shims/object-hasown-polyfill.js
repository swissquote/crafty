// This feature isn't supported everywhere yet but we can provide a smaller polyfill

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn#browser_compatibility
module.exports = () =>
  function hasOwn(obj, property) {
    return Object.prototype.hasOwnProperty.call(obj, property);
  };
