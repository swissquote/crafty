module.exports = {
  parsers: new Proxy(
    {},
    {
      get(target, prop, receiver) {
        return {};
      }
    }
  )
};
