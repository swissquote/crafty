// @ts-check
const fs = require("fs");
const path = require("path");

const test = require("ava");
const postcss = require("postcss");
const postcssScss = require("postcss-scss");
const postcssPreset = require("../index.js");

const FIXTURES = path.join(__dirname, "fixtures");

/** @type {{
  [spec: string]: {
    link: string;
    description?: string;
    examples: {
        link: string;
        description: string;
        implementation?: string;
        name: string;
        files: string;
    }[]
  }
}} */
const plugins = {
  "CSS Color Module Level 4": {
    link: "https://www.w3.org/TR/css-color-4/",
    examples: [
      {
        name: "Hexadecimal Alpha Notation",
        description:
          "A 4 & 8 character hex color notation for specifying the opacity level",
        link: "https://www.w3.org/TR/css-color-4/#hex-notation",
        implementation: "https://github.com/parcel-bundler/parcel-css",
        files: "colors-4/color-hex-alpha",
      },
      {
        name: "hsl() Function",
        description:
          "A function for specifying colors by hue, saturation and lightness to mix into it",
        link: "",
        implementation: "https://github.com/parcel-bundler/parcel-css",
        files: "colors-4/color-hsl",
      },
      {
        // Level 4 colors could be handled by @parcel/css
        name: "HWB Color",
        description:
          "A function for specifying colors by hue and then a degree of whiteness and blackness to mix into it",
        link: "https://www.w3.org/TR/css-color-4/#funcdef-hwb",
        implementation:
          "https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-hwb-function",
        files: "colors-4/color-hwb",
      },
      {
        name: "Color Functional Notation",
        description:
          "A space and slash separated notation for specifying colors",
        link: "https://www.w3.org/TR/css-color-4/#funcdef-rgb",
        implementation: "https://github.com/parcel-bundler/parcel-css",
        files: "colors-4/color-rgb",
      },
      {
        name: "rebeccapurple Color",
        description:
          "A particularly lovely shade of purple in memory of Rebecca Alison Meyer",
        link: "https://www.w3.org/TR/css-color-4/#valdef-color-rebeccapurple",
        implementation: "https://github.com/parcel-bundler/parcel-css",
        files: "colors-4/color-rebeccapurple",
      },
      // TODO :: https://preset-env.netlify.app/features/#oklab-function
      // TODO :: https://preset-env.netlify.app/features/#lab-function
    ],
  },
  "CSS Cascading and Inheritance Level 3": {
    link: "https://www.w3.org/TR/css-cascade-3/",
    examples: [
      {
        name: "`all` Property",
        description:
          "A property for defining the reset of all properties of an element.",
        link: "https://www.w3.org/TR/css-cascade-3/#all-shorthand",
        implementation: "https://github.com/maximkoretskiy/postcss-initial",
        files: "cascading-3/all-property",
      },
      {
        name: "`initial` Value",
        description: "Reset a property to its initial value.",
        link: "https://www.w3.org/TR/css-cascade-3/#initial",
        implementation: "https://github.com/maximkoretskiy/postcss-initial",
        files: "cascading-3/initial-value",
      },
    ],
  },
  "CSS Logical Properties and Values Level 1": {
    link: "https://www.w3.org/TR/css-logical-1/",
    examples: [
      {
        // TODO :: the old fallback uses css properties
        // which are not supported by the target browsers
        name: "Logical Properties and Values",
        description:
          "Flow-relative (left-to-right or right-to-left) properties and values",
        link: "https://www.w3.org/TR/css-logical-1/",
        implementation: "https://github.com/parcel-bundler/parcel-css",
        files: "logical-1/properties-and-values",
      },
    ],
  },
  "Selectors Level 4": {
    link: "https://www.w3.org/TR/selectors-4/",
    examples: [
      {
        name: ":any-link Hyperlink Pseudo-Class",
        description:
          "A pseudo-class for matching anchor elements independent of whether they have been visited",
        link: "https://www.w3.org/TR/selectors-4/#any-link-pseudo",
        implementation:
          "https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-pseudo-class-any-link",
        files: "selectors-4/any-link-pseudo-class",
      },
      {
        name: "Case-Insensitive Attributes",
        description:
          "An attribute selector matching attribute values case-insensitively",
        link: "https://www.w3.org/TR/selectors-4/#attribute-case",
        implementation:
          "https://github.com/Semigradsky/postcss-attribute-case-insensitive",
        files: "selectors-4/case-insensitive-attributes",
      },
      {
        name: "`:not()` Negation List Pseudo-Class",
        description: "A pseudo-class for ignoring elements in a selector list",
        link: "https://www.w3.org/TR/selectors-4/#negation-pseudo",
        implementation: "https://github.com/postcss/postcss-selector-not",
        files: "selectors-4/not-pseudo-class",
      },
      {
        name: ":dir Directionality Pseudo-Class",
        description:
          "A pseudo-class for matching elements based on their directionality",
        link: "https://www.w3.org/TR/selectors-4/#dir-pseudo",
        implementation:
          "https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-dir-pseudo-class",
        files: "selectors-4/dir-pseudo-class",
      },
    ],
  },
  "CSS Custom Properties for Cascading Variables Module Level 1": {
    link: "https://www.w3.org/TR/css-variables-1/",
    examples: [
      {
        name: "Custom Properties",
        description:
          "A syntax for defining custom values accepted by all CSS properties",
        link: "https://www.w3.org/TR/css-variables-1/",
        implementation:
          "https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-properties",
        files: "custom-properties-1/custom-properties",
      },
    ],
  },
  "CSS Image Values and Replaced Content Module Level 4": {
    link: "https://www.w3.org/TR/css-images-4/",
    examples: [
      {
        name: "image-set() Function",
        description:
          "A function for specifying image sources based on the user’s resolution",
        link: "https://www.w3.org/TR/css-images-4/#image-set-notation",
        implementation:
          "https://github.com/swissquote/crafty/tree/master/package-forks/postcss-image-set-polyfill",
        files: "images-4/image-set",
      },
    ],
  },
  "CSS Fonts Module Level 3": {
    link: "https://www.w3.org/TR/css-fonts-3/",
    examples: [
      {
        name: "font-variant Property",
        description:
          "A property for defining the usage of alternate glyphs in a font",
        link: "https://www.w3.org/TR/css-fonts-3/#propdef-font-variant",
        implementation: "https://github.com/postcss/postcss-font-variant",
        files: "fonts-3/font-variant",
      },
    ],
  },
  "CSS Fonts Module Level 4": {
    link: "https://drafts.csswg.org/css-fonts-4/",
    examples: [
      {
        name: "system-ui value for font-family",
        description: "A generic font used to match the user’s interface",
        link: "https://drafts.csswg.org/css-fonts-4/#system-ui-def",
        implementation: "",
        files: "fonts-4/system-ui-value",
      },
    ],
  },
  "CSS Text Module Level 3": {
    link: "https://drafts.csswg.org/css-text-3/",
    examples: [
      {
        name: "`overflow-wrap` Property",
        description:
          "A property for defining whether to insert line breaks within words to prevent overflowing",
        link: "https://drafts.csswg.org/css-text-3/#propdef-overflow-wrap",
        implementation:
          "https://github.com/mattdimu/postcss-replace-overflow-wrap",
        files: "text-3/overflow-wrap",
      },
    ],
  },
  "Media Queries Level 4": {
    link: "https://www.w3.org/TR/mediaqueries-4/",
    examples: [
      {
        name: "Media Query Ranges",
        description:
          "A syntax for defining media query ranges using ordinary comparison operators",
        link: "https://www.w3.org/TR/mediaqueries-4/#range-context",
        implementation: "https://github.com/parcel-bundler/parcel-css",
        files: "media-queries-4/media-query-ranges",
      },
    ],
  },
  "Media Queries Level 5": {
    link: "https://www.w3.org/TR/mediaqueries-5/",
    examples: [
      {
        name: "Custom Media Queries",
        description:
          "An at-rule for defining aliases that represent media queries",
        link: "https://www.w3.org/TR/mediaqueries-5/#at-ruledef-custom-media",
        implementation: "https://github.com/parcel-bundler/parcel-css",
        files: "media-queries-5/custom-media-queries",
      },
    ],
  },
  "CSS Extensions": {
    link: "https://drafts.csswg.org/css-extensions/",
    examples: [
      {
        name: "Custom Selectors",
        description: "An at-rule for defining aliases that represent selectors",
        link: "https://drafts.csswg.org/css-extensions/#custom-selectors",
        implementation: "https://github.com/postcss/postcss-custom-selectors",
        files: "css-extensions/custom-selectors",
      },
    ],
  },
  "Superseded specifications": {
    link: "",
    description:
      "Examples in this categories are Syntaxes for specifications that were abandoned",
    examples: [
      {
        name: "`:matches()` Matches-Any Pseudo-Class",
        description:
          "A pseudo-class for matching elements in a selector list. Syntax is now `:is()`",
        link: "http://dev.w3.org/csswg/selectors-4/#matches",
        implementation:
          "https://www.npmjs.com/package/postcss-selector-matches",
        files: "abandoned/matches-pseudo-class",
      },
      {
        name: "color() and color-mod() Color manipulation",
        description:
          "Modify colors using the `color-mod()` function in CSS. Might come back as `color-mix()` in the future",
        link: "https://www.w3.org/TR/css-color-4/#changes-from-20160705",
        implementation:
          "https://github.com/swissquote/crafty/tree/master/package-forks/postcss-color-mod-function",
        files: "abandoned/color-manipulation",
      },
      {
        name: "gray() Color function",
        description: "Create shades of gray",
        link: "https://drafts.csswg.org/css-color/#changes-from-20191105",
        implementation: "https://github.com/postcss/postcss-color-gray",
        files: "abandoned/color-gray",
      },
    ],
  },
  Scss: {
    link: "",
    examples: [
      {
        name: "@at-root Rule",
        description:
          "The @at-root causes one or more rules to be emitted at the root of the document, rather than being nested beneath their parent selectors",
        link: "https://sass-lang.com/documentation/at-rules/at-root",
        implementation:
          "https://github.com/swissquote/crafty/tree/master/package-forks/postcss-atroot",

        files: "scss/at-root",
      },
      {
        name: "Nesting Rules",
        description:
          "A syntax for nesting relative rules within rules. This is NOT the official CSS syntax as `&` is implicit in this syntax.",
        link: "https://sass-lang.com/documentation/style-rules#nesting",
        implementation: "https://www.npmjs.com/package/postcss-nested",
        files: "scss/nesting",
      },
      {
        name: "Mixins",
        description: "Create reusable mixins",
        link: "https://sass-lang.com/documentation/at-rules/mixin",
        implementation:
          "https://www.npmjs.com/package/@knagis/postcss-advanced-variables",
        files: "scss/mixins",
      },
      {
        name: "Variables",
        description:
          "Prefer using Custom Properties, kept only for backwards compatibilty",
        link: "https://sass-lang.com/documentation/variables",
        implementation:
          "https://www.npmjs.com/package/@knagis/postcss-advanced-variables",
        files: "scss/variables",
      },
      {
        name: "Loops",
        description: "Iterate on variables",
        link: "https://sass-lang.com/documentation/at-rules/control/each",
        implementation:
          "https://www.npmjs.com/package/@knagis/postcss-advanced-variables",
        files: "scss/loops",
      },
      {
        name: "Conditionals",
        description: "Conditions to use with your",
        link: "https://sass-lang.com/documentation/at-rules/control/if",
        implementation:
          "https://www.npmjs.com/package/@knagis/postcss-advanced-variables",
        files: "scss/conditionals",
      },
      {
        name: "Single line comments",
        description: "A shorter syntax for comments",
        link: "https://sass-lang.com/documentation/syntax/comments#in-scss",
        implementation: null,
        files: "scss/single-line-comments",
      },
    ],
  },
  Misc: {
    link: "",
    examples: [
      {
        name: "Automatic Vendor Prefixes",
        description:
          "Depending on the list of target browsers, automatically adds (and removes) vendor prefixes.",
        link: null,
        implementation: "https://github.com/parcel-bundler/parcel-css",
        files: "misc/prefixes",
      },
      {
        name: "Assets",
        description: "Get image sizes and inlines files",
        link: null,
        implementation:
          "https://github.com/swissquote/crafty/tree/master/package-forks/postcss-assets",
        files: "misc/assets",
      },
      {
        name: "Imports",
        description:
          "With `@import`, you can import your CSS files to create a single CSS output file. All relative links are updated when they are imported.",
        link: "",
        implementation: "https://github.com/postcss/postcss-import",
        files: "misc/imports",
      },
      {
        name: "Property lookup",
        description: "Reference property values without a variable.",
        link: null,
        implementation: "https://github.com/simonsmith/postcss-property-lookup",
        files: "misc/property-lookup",
      },
    ],
  },
};

const variants = [
  {
    name: "current",
    outputKey: "output-current",
    options: {
      config: {
        browsers: "chrome 95, safari 15",
        environment: "development",
      },
    },
  },
  {
    name: "old",
    outputKey: "output-old",
    options: {
      config: {
        browsers: "ie 10, safari 4, firefox 4",
        environment: "development",
      },
    },
  },
];

for (const variant of variants) {
  for (const [spec, data] of Object.entries(plugins)) {
    for (const example of data.examples) {
      const before = fs.readFileSync(
        path.join(FIXTURES, example.files, "input.css"),
        "utf-8"
      );
      const after = fs.readFileSync(
        path.join(FIXTURES, example.files, `${variant.outputKey}.css`),
        "utf-8"
      );

      test(`${spec}: ${example.name}: ${variant.name}`, async (t) => {
        const plugin = postcssPreset(variant.options);
        const result = await postcss()
          .use(plugin)
          .process(before, {
            from: path.join(FIXTURES, example.files, "input.css"),
            parser: postcssScss,
          });

        t.is(result.css, after);
      });
    }
  }
}

// Markdown documentation
let content = `**PostCSS** is a CSS Parser that supports plugins.
We made a selection of plugins useful for Swissquote, and here are some features made possible by them.

[TOC]

`;
for (const spec of Object.keys(plugins).sort()) {
  const data = plugins[spec];

  content += `# ${spec}\n\n`;

  if (data.description) {
    content += `\n${data.description}\n`;
  }

  for (const example of data.examples) {
    content += `## ${example.name}\n\n`;

    if (example.description) {
      content += `${example.description}\n\n`;
    }

    const before = fs.readFileSync(
      path.join(FIXTURES, example.files, "input.css"),
      "utf-8"
    );
    const after = fs.readFileSync(
      path.join(FIXTURES, example.files, "output-old.css"),
      "utf-8"
    );

    content += `\`\`\`css\n/* Before */\n${before}\n\n/* After */\n${after}\n\`\`\`\n\n`;
  }
}

fs.writeFileSync(
  path.join(
    __dirname,
    "..",
    "..",
    "..",
    "docs",
    "05_Packages",
    "05_crafty-preset-postcss",
    "CSS_Features.md"
  ),
  content
);
