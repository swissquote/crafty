// Supported since Node 6
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#browser_compatibility

module.exports = function includes(array, searchElement, fromIndex) {
  return Reflect.apply(Array.prototype.includes, array, [
    searchElement,
    fromIndex
  ]);
};
