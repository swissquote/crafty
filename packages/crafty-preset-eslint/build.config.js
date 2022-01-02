const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "eslint-packages",
    externals: {
      // Provided by other Crafty packages
      ...getExternals(),

      // Provided by this package
      "eslint": "eslint",
      "ajv": "ajv"
    }
  },
];
