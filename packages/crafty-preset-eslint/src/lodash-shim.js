module.exports = {
  get(obj, key, defaultValue) {
    return obj?.[key] ?? defaultValue;
  },
};
