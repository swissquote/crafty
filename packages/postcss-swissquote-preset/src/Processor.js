// Lazy load caniuse's API
let isSupported;

function isAllSupported(items, browsers) {

  // Load only when it's needed for the first time
  if (!isSupported) {
    const caniuse = require("caniuse-api");
    isSupported = caniuse.isSupported;
  }

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

  /**
   * Same as the constructor parameter, allows you to change
   * which module will be loaded for this processor.
   *
   * @param {string} moduleName The name of the module to load
   * @returns {this}
   */
  module(moduleName) {
    const modulePath = require.resolve(moduleName);
    this.moduleInit = options => require(modulePath)(options);

    return this;
  }

  /**
   * Provide a custom init callback, needed if your plugin
   * is just a function or needs more than one parameter.
   * This is an alternative to `.module(name)`.
   *
   * .init(options => require("my-postcss-plugin")(options))
   *
   * @param {Function} fun The function that will return the instance of the plugin
   * @returns {this}
   */
  init(fun) {
    this.moduleInit = fun;

    return this;
  }

  /**
   * Does all the checks to know if this Processor is enabled or not
   * @returns {boolean}
   */
  isEnabled() {
    if (this.caniuseFeature && isAllSupported(this.caniuseFeature, this.browserslist)) {
      return false;
    }

    if (this.enableCallback) {
      return this.enableCallback(this.options);
    }

    return true;
  }

  /**
   * Returns a boolean to tell if the processor is enabled or not.
   *
   * @param {Function} fun A function that returns a boolean.
   * @returns {this}
   */
  enableIf(fun) {
    this.enableCallback = fun;

    return this;
  }

  /**
   * Enables the plugin only if the spec it implements isn't
   * supported by all browsers that are targeted
   *
   * @param {string|string[]} caniuseFeature The name of the CSS spec that it implements
   * @param {string} browsers the list of browsers that we currently target
   * @returns {this}
   */
  enableIfUnsupported(caniuseFeature, browsers) {
    this.caniuseFeature = caniuseFeature;
    this.browserslist = browsers;

    return this;
  }

  /**
   * Change all the options at once.
   *
   * @param {Object} options The new options object
   * @returns {this}
   */
  setOptions(options) {
    this.options = options;

    return this;
  }

  /**
   * Create the plugin. Doesn't check if the plugin is enabled or not.
   *
   * @returns {PostcssPlugin} An instance of the plugin with the defined options.
   */
  instantiate() {
    if (!this.moduleInit) {
      this.module(this.name);
    }

    return this.moduleInit(this.options);
  }

  /**
   * Specify before which plugin this plugin has to run.
   * Must not be set at the same time as ".after()"
   *
   * @param {string} name The name of the plugin before which we must run
   * @returns {this}
   */
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

  /**
   * Specify after which plugin this plugin has to run.
   * Must not be set at the same time as ".before()"
   *
   * @param {string} name The name of the plugin before which we must run
   * @returns {this}
   */
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
