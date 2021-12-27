// Supported since node 11
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#browser_compatibility

module.exports = function flat(array, depth) {
  return Reflect.apply(Array.prototype.flat, array, [depth]);
};
