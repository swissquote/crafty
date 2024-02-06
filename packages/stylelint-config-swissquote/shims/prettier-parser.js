export default {
  parsers: new Proxy(
    {},
    {
      get: function (target, prop, receiver) {
        return {};
      },
    }
  ),
};
