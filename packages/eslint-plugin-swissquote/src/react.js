const {
  createNodeResolver
} = require("../dist/eslint-plugin-import-x/index.js");
// React specific configuration

module.exports = {
  extends: [
    // @eslint-react/eslint-plugin
    require("../packages/eslint-react-eslint-plugin.mjs").default.configs.recommended,
  ],
  settings: {
    "import-x/resolver-next": [
      createNodeResolver({
        extensions: [".js", ".jsx", ".json"]
      })
    ],
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
    "@eslint-react/no-set-state-in-component-did-mount": "error",
    "@eslint-react/no-set-state-in-component-did-update": "error",
    "@eslint-react/no-redundant-should-component-update": "error",
    "@eslint-react/dom-no-void-elements-with-children": "error",

    // Disable the rule as it would attempt to autofix
    "@eslint-react/dom/no-render": "off"
  }
};
