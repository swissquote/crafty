// React specific configuration
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
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    }
  },
  rules: {
    // Add all recommended configurations from eslint-plugin-react-hooks
    ...require("../packages/eslint-plugin-react-hooks").configs.recommended
      .rules,

    // Add all recommended configurations from eslint-plugin-react
    ...require("../packages/eslint-plugin-react").configs.recommended.rules,

    // Disable all the rules from eslint-plugin-react that are handled by Prettier
    ...require("../packages/eslint-config-prettier").rules,

    // Recommended rules override
    "react/display-name": 0, // Disabled as it generates false positives
    "react/jsx-no-duplicate-props": ["error", { ignoreCase: true }],
    "react/no-deprecated": "warn",
    "react/prop-types": ["warn", { skipUndeclared: true }],

    // Swissquote Rules
    // Disabled for now as it has false positives on inline handlers
    // TODO :: re-enable jsx-handler-names once https://github.com/yannickcr/eslint-plugin-react/issues/2832 is fixed
    "react/jsx-handler-names": "off",
    "react/jsx-pascal-case": "error",
    "react/no-did-mount-set-state": "error",
    "react/no-did-update-set-state": "error",
    "react/no-redundant-should-component-update": "error",
    "react/no-typos": "error",
    "react/no-unused-state": "error",
    "react/no-will-update-set-state": "error",
    "react/prefer-es6-class": ["error", "always"],
    "react/prefer-stateless-function": [
      "error",
      { ignorePureComponents: true }
    ],
    "react/void-dom-elements-no-children": "error"
  },
  plugins: {
    react: require("../packages/eslint-plugin-react"),
    "react-hooks": require("../packages/eslint-plugin-react-hooks")
  }
};
