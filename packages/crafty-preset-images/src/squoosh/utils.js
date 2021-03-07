/**
 * Utils
 */
function execOnce(fn) {
  let used = false;
  let result;

  return (...args) => {
    if (!used) {
      used = true;
      result = fn(...args);
    }
    return result;
  };
}

module.exports = {
  execOnce
};
