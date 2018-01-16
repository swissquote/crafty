// EcmaScript 6 specific configuration
module.exports = {
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".json"]
      }
    },
    react: {
      version: "15" //Overlaid when loading this file
    }
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    // Recommended rules override
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
    "@swissquote/swissquote/react/jsx-handler-names": "error",
    "@swissquote/swissquote/react/jsx-indent": ["error", 2],
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

// Eslint can't load plugins transitively (from a shared config)
// So we have to include the file ourselves and include the rules as if they were ours.
// Solution proposed by @nzakas himself : https://github.com/eslint/eslint/issues/3458#issuecomment-257161846
// replaces `extends: "plugin:react/recommended",`
const reactRules = require("eslint-plugin-react").configs.recommended.rules;
Object.keys(reactRules).forEach(ruleName => {
  // Only define the rules we don't have configured yet
  const key = `@swissquote/swissquote/${ruleName}`;
  if (!module.exports.rules.hasOwnProperty(key)) {
    module.exports.rules[key] = reactRules[ruleName];
  }
});
