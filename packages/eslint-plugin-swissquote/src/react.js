const { addMissingRules } = require("./utils");

// EcmaScript 6 specific configuration
module.exports = {
  settings: {
    "import/resolver": {
      [require.resolve("../packages/eslint-import-resolver-node.js")]: {
        extensions: [".js", ".jsx", ".json"]
      }
    },
    react: {
      version: "detect"
    }
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    // Swissquote Rules
    "@swissquote/swissquote/@eslint-react/naming-convention/component-name": "error",
    "@swissquote/swissquote/@eslint-react/no-set-state-in-component-did-mount": "error",
    "@swissquote/swissquote/@eslint-react/no-set-state-in-component-did-update": "error",
    "@swissquote/swissquote/@eslint-react/no-redundant-should-component-update":
      "error",
    "@swissquote/swissquote/@eslint-react/dom/no-void-elements-with-children": "error"
  }
};

// Add all recommended configurations from eslint-plugin-react
addMissingRules(
  require("../packages/eslint-react-eslint-plugin").configs.recommended.rules,
  module.exports.rules
);

// Add all recommended configurations from eslint-plugin-react-hooks
addMissingRules(
  require("../packages/eslint-plugin-react-hooks").configs.recommended.rules,
  module.exports.rules
);

// Disable all the rules from eslint-plugin-react that are handled by Prettier
addMissingRules(
  require("../packages/eslint-config-prettier").rules,
  module.exports.rules
);
