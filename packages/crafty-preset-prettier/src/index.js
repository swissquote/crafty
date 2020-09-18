module.exports = {
  defaultConfig() {
    return {
      prettier: {}
    };
  },
  ide(crafty) {
    return {
      "prettier.config.js": {
        content: crafty.config.prettier,
        serializer: content => `// This configuration was generated by Crafty
  // This file is generated to improve IDE Integration
  // You don't need to commit this file

  module.exports = ${JSON.stringify(content, null, 4)};
  `
      }
    };
  }
};
