const { getExternals } = require("../../utils/externals");

module.exports = [
  (builder) =>
    builder("index").externals({
      ...getExternals(),
    }),
];
