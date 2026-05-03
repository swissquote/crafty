import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

import { getExternals } from "../../utils/externals.js";

const require = createRequire(import.meta.url);

const excludedUtils = new Set([
  "getFormatterOptionsText",
  "getFormatter",
  "normalizeFilePath",
  "resolveOptionValue",
  "checkAgainstRule",
  "getStylelintRule",
  "getFileIgnorer",
  "filterFilePaths",
  "isUnicodeSupported",
  "omitPrivateProperties",
  "pluralize",
  "addSemicolonForEditInfo",
  "appendRuleName",
  "cachedImport",
  "checkInvalidCLIOptions",
  "dynamicImport",
  "errors",
  "getModulePath",
  "FileCache",
  "getRelativePath",
  "suppressionsService",
  "hash",
  "isPathNotFoundError",
  "narrowFixRange",
  "normalizeFixMode",
  "pathExists",
  "putIfAbsent",
  "rangesOverlap",
  "reportCommentProblem",
  "resolveFilePath",
  "resolveSilent",
  "toPath"
]);
const stylelintDir = path.join(
  import.meta.dirname,
  "..",
  "..",
  "node_modules",
  "stylelint"
);
const utilNames = fs
  .readdirSync(`${stylelintDir}/lib/utils`)
  .filter(util => util.endsWith(".mjs"))
  .map(util => util.replace(".mjs", ""))
  .filter(util => !excludedUtils.has(util));
const referenceNames = fs
  .readdirSync(`${stylelintDir}/lib/reference`)
  .filter(util => util.endsWith(".mjs"))
  .map(util => util.replace(".mjs", ""));
const ruleNames = fs
  .readdirSync(`${stylelintDir}/lib/rules`)
  .filter(util => !util.endsWith(".mjs"));
console.log({ ruleNames });

const utilsRegex = new RegExp(
  String.raw`\/utils\/(${utilNames.join("|")}).mjs$`
);

const referenceRegex = new RegExp(
  String.raw`\/reference\/(${referenceNames.join("|")}).mjs$`
);

const externals = {
  // Provided by other Crafty packages
  ...getExternals(true),

  // Better to use the external version
  postcss: "commonjs postcss",
  "postcss/package.json": "postcss/package.json",
  "/postcss/lib(/.*)/": "postcss/lib$1",

  "@babel/code-frame": "commonjs @babel/code-frame",

  // Not used as we pass the configuration directly, can be excluded from the bundle
  "postcss-load-config": "../../shims/cosmiconfig.js",
  cosmiconfig: "../../shims/cosmiconfig.js",

  "postcss-selector-parser": "commonjs ../postcss-selector-parser/index.cjs",
  "postcss-value-parser": "../postcss-value-parser/index.js",
  "postcss-resolve-nested-selector":
    "../postcss-resolve-nested-selector/index.js",
  "css-tree": "../css-tree/index.js",
  "fastest-levenshtein": "../fastest-levenshtein/index.js",
  "known-css-properties": "../known-css-properties/index.js",

  "mathml-tag-names": "commonjs ../mathml-tag-names/index.cjs",
  "svg-tags": "commonjs ../svg-tags/index.cjs",
  "html-tags": "../html-tags/index.js",
  "@csstools/selector-specificity": "../csstools-selector-specificity/index.js",
  "@csstools/css-tokenizer": "../csstools-css-tokenizer/index.js",
  "@csstools/media-query-list-parser":
    "../csstools-media-query-list-parser/index.js",
  "@csstools/css-parser-algorithms":
    "../csstools-css-parser-algorithms/index.js",

  "mdn-data": "commonjs ../mdn-data/index.cjs",
  "mdn-data/css/syntaxes": "commonjs ../mdn-data/syntaxes.json",

  "is-plain-object": "../is-plain-object/index.cjs",

  // The exports of this package act weird, so we use our own export
  stylelint: "../../packages/stylelint.js"
};

const rebasedExternals = Object.fromEntries(
  Object.entries(externals).map(([key, value]) => {
    return [
      key,
      value.includes("..")
        ? value
            .replace("commonjs ..", "commonjs ../../..")
            .replace(/^\.\./, "../../..")
        : value
    ];
  })
);

function externalsForStylelint(currentModule, isSubfolder) {
  const prefix = isSubfolder ? "../.." : ".";

  return function({ context, request }, callback) {
    if (!request.endsWith(".mjs")) {
      return callback();
    }

    const fullPath = path.join(context, request);

    // Don't ignore the module itself
    if (fullPath.endsWith(currentModule)) {
      return callback();
    }

    if (fullPath.endsWith("lib/constants.mjs")) {
      return callback(null, `${prefix}/constants.mjs`);
    }

    const matchUtils = utilsRegex.exec(fullPath);
    if (matchUtils) {
      return callback(null, `${prefix}/utils/${matchUtils[1]}/index.js`);
    }

    const matchReference = referenceRegex.exec(fullPath);
    if (matchReference) {
      return callback(
        null,
        `${prefix}/reference/${matchReference[1]}/index.js`
      );
    }

    return callback();
  };
}

function externalsFor(pkg) {
  return Object.fromEntries(
    Object.entries(externals).filter(([key]) => {
      return !(key.startsWith(`${pkg}/`) || key === pkg);
    })
  );
}

console.log(rebasedExternals);

const FAKE_PRETTIER_PLUGIN = "../../shims/prettier-parser.js";

export default [
  builder =>
    builder("stylelint-prettier")
      .esm()
      .package()
      .externals({
        ...externalsFor("stylelint-prettier"),

        // We don't need most prettier parsers
        "./plugins/acorn.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/angular.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/babel.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/estree.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/flow.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/glimmer.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/graphql.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/html.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/markdown.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/meriyah.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/typescript.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/yaml.mjs": FAKE_PRETTIER_PLUGIN
      }),
  builder =>
    builder("postcss-selector-parser")
      .cjs()
      .package(),
  builder =>
    builder("is-plain-object")
      .cjs()
      .package(),
  builder =>
    builder("mathml-tag-names")
      .cjs()
      .package(),
  builder =>
    builder("svg-tags")
      .cjs()
      .package(),
  builder =>
    builder("html-tags")
      .esm()
      .package(),
  builder =>
    builder("@csstools/selector-specificity")
      .esm()
      .package({
        names: [
          "compare",
          "selectorSpecificity",
          "specificityOfMostSpecificListItem"
        ]
      })
      .externals(externalsFor("@csstools/selector-specificity")),
  builder =>
    builder("@csstools/css-tokenizer")
      .esm()
      .package({
        names: [
          "HashType",
          "NumberType",
          "ParseError",
          "ParseErrorMessage",
          "ParseErrorWithToken",
          "TokenType",
          "cloneTokens",
          "isToken",
          "isTokenAtKeyword",
          "isTokenBadString",
          "isTokenBadURL",
          "isTokenCDC",
          "isTokenCDO",
          "isTokenCloseCurly",
          "isTokenCloseParen",
          "isTokenCloseSquare",
          "isTokenColon",
          "isTokenComma",
          "isTokenComment",
          "isTokenDelim",
          "isTokenDimension",
          "isTokenEOF",
          "isTokenFunction",
          "isTokenHash",
          "isTokenIdent",
          "isTokenNumber",
          "isTokenNumeric",
          "isTokenOpenCurly",
          "isTokenOpenParen",
          "isTokenOpenSquare",
          "isTokenPercentage",
          "isTokenSemicolon",
          "isTokenString",
          "isTokenURL",
          "isTokenUnicodeRange",
          "isTokenWhiteSpaceOrComment",
          "isTokenWhitespace",
          "mirrorVariant",
          "mirrorVariantType",
          "mutateIdent",
          "mutateUnit",
          "stringify",
          "tokenize",
          "tokenizer"
        ]
      })
      .externals(externalsFor("@csstools/css-tokenizer")),
  builder =>
    builder("@csstools/media-query-list-parser")
      .esm()
      .package({
        names: [
          "CustomMedia",
          "GeneralEnclosed",
          "MediaAnd",
          "MediaCondition",
          "MediaConditionListWithAnd",
          "MediaConditionListWithOr",
          "MediaFeature",
          "MediaFeatureBoolean",
          "MediaFeatureEQ",
          "MediaFeatureGT",
          "MediaFeatureLT",
          "MediaFeatureName",
          "MediaFeaturePlain",
          "MediaFeatureRangeNameValue",
          "MediaFeatureRangeValueName",
          "MediaFeatureRangeValueNameValue",
          "MediaFeatureValue",
          "MediaInParens",
          "MediaNot",
          "MediaOr",
          "MediaQueryInvalid",
          "MediaQueryModifier",
          "MediaQueryWithType",
          "MediaQueryWithoutType",
          "MediaType",
          "NodeType",
          "cloneMediaQuery",
          "comparisonFromTokens",
          "invertComparison",
          "isCustomMedia",
          "isGeneralEnclosed",
          "isMediaAnd",
          "isMediaCondition",
          "isMediaConditionList",
          "isMediaConditionListWithAnd",
          "isMediaConditionListWithOr",
          "isMediaFeature",
          "isMediaFeatureBoolean",
          "isMediaFeatureName",
          "isMediaFeaturePlain",
          "isMediaFeatureRange",
          "isMediaFeatureRangeNameValue",
          "isMediaFeatureRangeValueName",
          "isMediaFeatureRangeValueNameValue",
          "isMediaFeatureValue",
          "isMediaInParens",
          "isMediaNot",
          "isMediaOr",
          "isMediaQuery",
          "isMediaQueryInvalid",
          "isMediaQueryWithType",
          "isMediaQueryWithoutType",
          "matchesComparison",
          "matchesRatio",
          "matchesRatioExactly",
          "modifierFromToken",
          "newMediaFeatureBoolean",
          "newMediaFeaturePlain",
          "parse",
          "parseCustomMedia",
          "parseCustomMediaFromTokens",
          "parseFromTokens",
          "typeFromToken"
        ]
      })
      .externals(externalsFor("@csstools/media-query-list-parser")),
  builder =>
    builder("@csstools/css-parser-algorithms")
      .esm()
      .package({
        names: [
          "CommentNode",
          "ComponentValueType",
          "ContainerNodeBaseClass",
          "FunctionNode",
          "SimpleBlockNode",
          "TokenNode",
          "WhitespaceNode",
          "forEach",
          "gatherNodeAncestry",
          "isCommentNode",
          "isFunctionNode",
          "isSimpleBlockNode",
          "isTokenNode",
          "isWhiteSpaceOrCommentNode",
          "isWhitespaceNode",
          "parseCommaSeparatedListOfComponentValues",
          "parseComponentValue",
          "parseListOfComponentValues",
          "replaceComponentValues",
          "sourceIndices",
          "stringify",
          "walk",
          "walkerIndexGenerator"
        ]
      })
      .externals(externalsFor("@csstools/css-parser-algorithms")),
  builder =>
    builder("postcss-resolve-nested-selector")
      .esm()
      .package(),
  builder =>
    builder("postcss-value-parser")
      .esm()
      .package(),

  builder =>
    builder("fastest-levenshtein")
      .esm()
      .package({ isEsmModule: true }),
  builder =>
    builder("known-css-properties")
      .esm()
      .package({ names: ["all"] }),
  builder =>
    builder("css-tree")
      .esm()
      .externals(externalsFor("css-tree"))
      .package({ isEsmModule: true }),
  builder =>
    builder("@csstools/css-tokenizer")
      .cjs()
      .externals(externalsFor("@csstools/css-tokenizer"))
      .package(),
  async (_, compilerUtils) => {
    const cssTreePkg = path.dirname(require.resolve("css-tree/package.json"));

    console.log("Copy css-tree's data/patch.json");
    compilerUtils.copyFile(
      path.join(cssTreePkg, "data/patch.json"),
      "dist/css-tree/patch.json"
    );

    const version = require("css-tree/package.json").version;

    console.log("Patch css-tree's index.js");
    await compilerUtils.replaceContent(
      path.join("dist", "css-tree", "index.js"),
      content =>
        content
          .replace("('../data/patch.json')", "('./patch.json')")
          .replace(
            "const version_require = createRequire(import.meta.url);",
            ""
          )
          .replace(
            "const { version: version } = version_require('../package.json');",
            `const version = "${version}";`
          )
          .replace(
            /data_require\('mdn-data\/css\//g,
            "data_require('../mdn-data/"
          )
    );
  },
  builder =>
    builder("stylelint-scss")
      .esm()
      .package()
      .externals(externalsFor("stylelint-scss")),
  async (_, compilerUtils) => {
    await compilerUtils.patchESMForCJS(
      path.join("dist", "stylelint-scss", "index.js"),
      ["postcss_selector_parser_index", "known_css_properties_index"]
    );
  },
  async (_, compilerUtils) => {
    console.log("Patch stylelint exports");
    await compilerUtils.replaceContent(
      path.join(stylelintDir, "package.json"),
      content => {
        const pkg = JSON.parse(content);
        pkg.exports["./lib/*"] = "./lib/*";

        return JSON.stringify(pkg, null, 2);
      }
    );

    console.log("Copy mdn-data files");
    for (const file of ["at-rules", "syntaxes", "properties"]) {
      // eslint-disable-next-line no-await-in-loop
      await compilerUtils.copyFile(
        require.resolve(`mdn-data/css/${file}.json`),
        path.join("dist", "mdn-data", `${file}.json`)
      );
    }

    fs.writeFileSync(
      path.join("dist", "mdn-data", `index.cjs`),
      `module.exports = { css: { syntaxes: require("./syntaxes.json") } }`
    );
  },
  builder =>
    builder("stylelint")
      .esm()
      .packages(pkgBuilder => {
        pkgBuilder.package(
          "stylelint/lib/index.mjs",
          "stylelint",
          `dist/stylelint/index.js`
        );
        pkgBuilder.package(
          "stylelint/lib/cli.mjs",
          "stylelintCli",
          `dist/stylelint/cli.js`
        );
      })
      .externals([externals, externalsForStylelint("stylelint", false)])
      .options({
        sourceMap: false
      }),
  ...utilNames.map(util => builder =>
    builder(`stylelint-util-${util}`)
      .esm()
      .source(require.resolve(`stylelint/lib/utils/${util}.mjs`))
      .destination(`dist/stylelint/utils/${util}/index.mjs`)
      .externals([
        rebasedExternals,
        externalsForStylelint(`lib/utils/${util}.mjs`, true)
      ])
  ),
  ...referenceNames.map(ref => builder =>
    builder(`stylelint-reference-${ref}`)
      .esm()
      .source(require.resolve(`stylelint/lib/reference/${ref}.mjs`))
      .destination(`dist/stylelint/reference/${ref}/index.mjs`)
      .externals([
        rebasedExternals,
        externalsForStylelint(`lib/reference/${ref}.mjs`, true)
      ])
  ),
  ...ruleNames.map(rule => builder =>
    builder(`stylelint-rule-${rule}`)
      .esm()
      .source(require.resolve(`stylelint/lib/rules/${rule}/index.mjs`))
      .destination(`dist/stylelint/rules/${rule}/index.mjs`)
      .externals([
        rebasedExternals,
        externalsForStylelint(`lib/rules/${rule}/index.mjs`, true)
      ])
  ),
  async (_, compilerUtils) => {
    await compilerUtils.copyFile(
      require.resolve("stylelint/lib/constants.mjs"),
      path.join("dist", "stylelint", "constants.mjs")
    );

    await compilerUtils.patchESMForCJS(
      path.join("dist", "stylelint", "bundled.js"),
      ["known_css_properties_index"]
    );

    const pkg = JSON.parse(
      fs.readFileSync(path.join(stylelintDir, "package.json"))
    );
    const version = pkg.version;

    await compilerUtils.replaceContent(
      path.join("dist", "stylelint", "918.js"),
      content =>
        content
          .replace(
            // eslint-disable-next-line no-template-curly-in-string
            "import(`./${ruleName}/index.mjs`)",
            // eslint-disable-next-line no-template-curly-in-string
            "import(`./rules/${ruleName}/index.js`)"
          )
          .replace(
            /const FileCache_pkg = .*\n/m,
            `const FileCache_pkg = ${JSON.stringify({ version })};\n`
          )
    );
  }
];
