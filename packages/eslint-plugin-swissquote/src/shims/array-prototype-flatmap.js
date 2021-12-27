// Supported since node 11
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap#browser_compatibility

module.exports = function flatMap(array, mapper, thisArg) {
  return Reflect.apply(Array.prototype.flatMap, array, [mapper, thisArg]);
};
