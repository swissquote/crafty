module.exports = class {
  constructor() {
    this.store = new Map();
  }

  clear() {
    this.store.clear();
    return this;
  }

  delete(key) {
    this.store.delete(key);
    return this;
  }

  order() {
    const entries = [...this.store].reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
    const names = Object.keys(entries);
    const order = [...names];

    names.forEach((name) => {
      if (!entries[name]) {
        return;
      }

      const { __before, __after } = entries[name];

      if (__before && order.includes(__before)) {
        order.splice(order.indexOf(name), 1);
        order.splice(order.indexOf(__before), 0, name);
      } else if (__after && order.includes(__after)) {
        order.splice(order.indexOf(name), 1);
        order.splice(order.indexOf(__after) + 1, 0, name);
      }
    });

    return { entries, order };
  }

  entries() {
    const { entries, order } = this.order();

    if (order.length) {
      return entries;
    }

    return undefined;
  }

  values() {
    const { entries, order } = this.order();

    return order.map((name) => entries[name]);
  }

  get(key) {
    return this.store.get(key);
  }

  getOrCompute(key, fn) {
    if (!this.has(key)) {
      this.set(key, fn());
    }
    return this.get(key);
  }

  has(key) {
    return this.store.has(key);
  }

  set(key, value) {
    this.store.set(key, value);
    return this;
  }
};
