module.exports = class CraftyPreset {
  constructor(preset, name) {
    this.preset = preset;
    this.presetImpl = preset.default ? preset.default : preset;
    this.name = name;
  }

  /**
   * Legacy name, to keep compatiblity
   */
  get presetName() {
    return this.name;
  }

  implements(method) {
    return Object.prototype.hasOwnProperty.call(this.presetImpl, method);
  }

  run(method, ...args) {
    if (!this.implements(method)) {
      throw new Error(
        `The preset '${this.name}' does not implement '${method}()'`
      );
    }

    return this.presetImpl[method](...args);
  }

  get(property) {
    if (!this.implements(property)) {
      throw new Error(
        `The preset '${this.name}' does not contain the property '${property}'`
      );
    }

    return this.presetImpl[property];
  }
};
