const { isSupported } = require("caniuse-api");

function isAllSupported(items, browsers) {
  const allItems = Array.isArray(items) ? items : [ items ];

  return allItems.every(item => isSupported(item, browsers));
}

module.exports = class Processor {
  constructor(name) {
    this.name = name;
    this.options = {};

    this.enableCallback = null;
    this.caniuseFeature = null;
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
    if (!this.enableCallback && !this.caniuseFeature) {
      return true;
    }

    if (this.caniuseFeature && isAllSupported(this.caniuseFeature, this.browserslist)) {
      return false;
    }

    if (this.enableCallback) {
      return this.enableCallback(this.options);
    }

    return true;
  }

  enableIf(callback) {
    this.enableCallback = callback;

    return this;
  }

  enableIfUnsupported(caniuseFeature, browsers) {
    this.caniuseFeature = caniuseFeature;
    this.browserslist = browsers;

    return this;
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
