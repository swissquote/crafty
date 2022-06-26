const { getExternals } = require("../../utils/externals");

module.exports = [
  builder => builder("eslint-packages").externals({
    // Provided by other Crafty packages
    ...getExternals(),

    // Provided by this package
    "eslint": "eslint",
    "schema-utils": "schema-utils"
  })
];
