// We don't need the polyfill as the feature is Node 12 minimum and this is already the lowest version we support.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll#browser_compatibility

module.exports = function matchAll(str, regexp) {
  return Reflect.apply(String.prototype.matchAll, str, regexp);
};
