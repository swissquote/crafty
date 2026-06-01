/**
 * Global setup for benchmark tests.
 * Polyfills localStorage so tests can run in the Node.js environment
 * without requiring jsdom.
 */

let store = {};

globalThis.localStorage = {
  getItem(key) {
    return key in store ? store[key] : null;
  },
  setItem(key, value) {
    store[key] = String(value);
  },
  removeItem(key) {
    delete store[key];
  },
  clear() {
    store = {};
  },
  get length() {
    return Object.keys(store).length;
  },
};

// Reset localStorage before each test to avoid state leakage
beforeEach(() => {
  localStorage.clear();
});
