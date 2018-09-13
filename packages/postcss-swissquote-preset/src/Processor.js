module.exports = class Processor {
  constructor(name) {
    this.name = name;
    this.options = {};
  }

  module(moduleName) {
    const modulePath = require.resolve(moduleName);
    this.moduleInit = options => require(modulePath)(options);

    return this;
  }

  init(callback) {
    this.moduleInit = callback;

    return this;
  }

  isEnabled() {
    if (!this.enableCallback) {
      return true;
    }

    return this.enableCallback(this.options);
  }

  enableIf(callback) {
    this.enableCallback = callback;
  }

  setOptions(options) {
    this.options = options;

    return this;
  }

  instantiate() {
    if (!this.moduleInit) {
      this.module(this.name);
    }

    return this.moduleInit(this.options);
  }

  before(name) {
    if (this.__after) {
      throw new Error(
        `Unable to set .before(${JSON.stringify(
          name
        )}) with existing value for .after()`
      );
    }

    this.__before = name;
    return this;
  }

  after(name) {
    if (this.__before) {
      throw new Error(
        `Unable to set .after(${JSON.stringify(
          name
        )}) with existing value for .before()`
      );
    }

    this.__after = name;
    return this;
  }
};
