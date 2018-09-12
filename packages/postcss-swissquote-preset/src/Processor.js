module.exports = class Processor {
  constructor(name) {
    this.name = name;
  }

  module(callback, options) {
    this.callback = callback;

    if (options) {
      return this.setOptions(options);
    }

    return this;
  }

  setOptions(options) {
    this.options = options;

    return this;
  }

  instantiate() {
    return this.callback(this.options);
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
}
