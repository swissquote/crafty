/* Array.prototype.toSorted isn't a standard yet */

function copy(array) {
  var index = 0;
  var length = array.length;
  var result = new Array(length);
  while (length > index) result[index] = array[index++];
  return result;
}

module.exports = function toSorted(array, compareFn) {
  return copy(array).sort(compareFn);
};
