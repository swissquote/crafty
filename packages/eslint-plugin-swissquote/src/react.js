// React specific configuration

module.exports = {
  extends: [
    // @eslint-react/eslint-plugin
    require("../packages/eslint-react-eslint-plugin.js").configs.recommended,
    // Add all recommended configurations from eslint-plugin-react-hooks
    require("../packages/eslint-plugin-react-hooks.js").configs[
      "recommended-latest"
    ]
  ],
  settings: {
    "import-x/resolver": {
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
    // Disable all the rules from eslint-plugin-react that are handled by Prettier
    ...require("../packages/eslint-config-prettier.js").rules,

    // Swissquote Rules
    "@eslint-react/naming-convention/component-name": "error",
    "@eslint-react/no-set-state-in-component-did-mount": "error",
    "@eslint-react/no-set-state-in-component-did-update": "error",
    "@eslint-react/no-redundant-should-component-update": "error",
    "@eslint-react/dom/no-void-elements-with-children": "error",

    // Disable the rule as it would attempt to autofix
    "@eslint-react/dom/no-render": "off"
  }
};
