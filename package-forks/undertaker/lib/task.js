//eslint-disable-next-line consistent-return
function task(name, fn) {
  if (typeof name === "function") {
    // eslint-disable-next-line no-param-reassign
    fn = name;
    // eslint-disable-next-line no-param-reassign
    name = fn.displayName || fn.name;
  }

  if (!fn) {
    return this._getTask(name);
  }

  this._setTask(name, fn);
}

module.exports = task;
