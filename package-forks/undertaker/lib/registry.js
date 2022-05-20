var validateRegistry = require("./helpers/validateRegistry");

function setTasks(inst, entry) {
  inst.set(entry[0], entry[1]);
  return inst;
}

// eslint-disable-next-line consistent-return
function registry(newRegistry) {
  if (!newRegistry) {
    return this._registry;
  }

  validateRegistry(newRegistry);

  var tasks = this._registry.tasks();

  this._registry = Object.entries(tasks).reduce(setTasks, newRegistry);
  this._registry.init(this);
}

module.exports = registry;
