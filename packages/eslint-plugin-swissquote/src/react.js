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
    // Recommended rules override
    "@swissquote/swissquote/react/display-name": 0, // Disabled as it generates false positives
    "@swissquote/swissquote/react/jsx-no-duplicate-props": [
      "error",
      { ignoreCase: true }
    ],
    "@swissquote/swissquote/react/no-deprecated": "warn",
    "@swissquote/swissquote/react/prop-types": [
      "warn",
      { skipUndeclared: true }
    ],

    // Swissquote Rules
    // Disabled for now as it has false positives on inline handlers
    // TODO :: re-enable jsx-handler-names once https://github.com/yannickcr/eslint-plugin-react/issues/2832 is fixed
    "@swissquote/swissquote/react/jsx-handler-names": "off",
    "@swissquote/swissquote/react/jsx-pascal-case": "error",
    "@swissquote/swissquote/react/no-did-mount-set-state": "error",
    "@swissquote/swissquote/react/no-did-update-set-state": "error",
    "@swissquote/swissquote/react/no-redundant-should-component-update":
      "error",
    "@swissquote/swissquote/react/no-typos": "error",
    "@swissquote/swissquote/react/no-unused-state": "error",
    "@swissquote/swissquote/react/no-will-update-set-state": "error",
    "@swissquote/swissquote/react/prefer-es6-class": ["error", "always"],
    "@swissquote/swissquote/react/prefer-stateless-function": [
      "error",
      { ignorePureComponents: true }
    ],
    "@swissquote/swissquote/react/void-dom-elements-no-children": "error"
  }
};

// Add all recommended configurations from eslint-plugin-react
addMissingRules(
  require("../packages/eslint-plugin-react").configs.recommended.rules,
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
