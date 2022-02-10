module.exports = {
  parsers: new Proxy(
    {},
    {
      get: function (target, prop, receiver) {
        return {};
      },
    }
  )
};
