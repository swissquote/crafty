# ESM Migration Plan

Gradual migration of Crafty and all its packages to ES Modules.

## Context

- All packages require Node `>=22.12`, which supports `require(esm)` unflagged (as long as the module has no top-level `await`). CommonJS consumers can therefore load ESM packages.
- Crafty already loads presets and `crafty.config.js` through `import()` (`packages/crafty/src/configuration.js`).
- Already ESM: `crafty-preset-images`, `crafty-preset-images-simple`, `crafty-preset-maven`, `crafty-preset-stylelint` (partially), `stylelint-config-swissquote`, `integration`, most `package-forks/postcss-*`, `assets`, `color-fns`.
- The real ordering constraint is in the build: `utils/externals.js` ignores externals provided by ESM packages when the consumer is compiled with ncc ("Ignoring ESM external"). Migrating a provider (e.g. `crafty-commons`) before its ncc-compiled consumers would silently duplicate bundled dependencies.

## Decisions

- **Target:** publish ESM only. No dual CJS/ESM packages.
- **Stays CommonJS on purpose:** `integration-fixtures-cjs`, `package-forks/random-cjs`, `examples/simple`.
- **Order:** top layer first (consumers before providers), `crafty-commons` last.
- **Versioning:** not a breaking change (users only use the CLI, presets are loaded independently). Every PR can ship in a minor release.
- **`exports` maps:** not added.
- **PR size:** a PR migrates at least one whole package (a package is never split across PRs). If the diff stays under 1000 lines, more packages are added to it. Mechanical renames (e.g. `.js` → `.cjs`) do not count.
- **ncc → rslib:** the goal is to drop ncc eventually, but this is tracked separately and does not block the migration. A bundle that rslib cannot produce yet stays as `dist/*.cjs` inside the ESM package and is logged below.
- **Tool-loaded files** (Jest resolvers/transformers, Babel/ESLint/PostCSS/Stylelint presets and plugins): converted to ESM, relying on `require(esm)`. A file stays `.cjs` only if its tool demonstrably cannot load it, with a comment and an entry in this document. Every such file must be covered by an integration test that runs the actual tool.
- **Forked `gulp-*` packages:** migrated at the end, with everything else.

## Definition of done (per package)

1. `"type": "module"`, all source and tests use `import`/`export`, relative imports have explicit extensions.
2. No `__dirname`, `__filename` or bare `require`. Use `import.meta.dirname` / `import.meta.filename`. If `require` is genuinely needed, use `createRequire` with a comment explaining why.
3. `require.resolve` is replaced with `import.meta.resolve` or `createRequire(import.meta.url).resolve`, choosing the one that keeps the resolved path identical. `import.meta.resolve` uses the `import` condition and can resolve a different file than before. Prefer `createRequire` when the path is handed to a tool.
4. Any file that must remain CommonJS is a `.cjs` file and is justified in this document.
5. `build.config.js` is ESM. Any bundle still on ncc is logged in the status table below.
6. Lint, the package's unit tests and the `integration` tests (including `integration-fixtures-cjs`) pass.

## Dependency layers

Runtime dependencies only. ✅ = already ESM.

| Layer | Packages |
|---|---|
| L4 | preset-babel, preset-swc, preset-typescript, preset-postcss, preset-lightningcss, preset-images ✅, preset-stylelint ✅ (partial) |
| L3 | commons-swc, runner-gulp, preset-eslint |
| L2 | commons-gulp, preset-jest, preset-vitest, runner-webpack, runner-rspack, stylelint-config ✅ |
| L1 | crafty, commons-webpack, babel-preset-swissquote, eslint-plugin-swissquote, postcss-swissquote-preset, preset-maven ✅ |
| L0 | crafty-commons, preset-prettier, preset-react, preset-terser, gulp-babel, gulp-concat, gulp-newer |

## Plan

The sizes are upper bounds: the total lines of the files that contain a `require(`. Real diffs will be smaller, so neighbouring batches may be merged when the PRs are made.

### Phase 0: groundwork

- [x] **0.1** Run the experiment on `utils/externals.js`: let ncc-compiled consumers keep using externals provided by ESM packages, through a plain `require()` that Node resolves to ESM. Prove it on one package first. Add the status script (see "Status") and record the outcome here:
  - If it succeeds, the order below becomes a recommendation.
  - If it fails, the order below becomes a hard rule.
  - **Outcome: succeeded**, so the order below is a recommendation. See "Blockers and notes".
- [x] **0.2** Migrate `utils/` (~500 lines). `benchmarks/` is postponed to 1.1, see "Blockers and notes".

### Phase 1: L4 presets

- [ ] **1.1** preset-stylelint (leftover CommonJS), preset-babel, preset-swc (~600). Also make Babel + Jest work in `"type": "module"` projects, then migrate `benchmarks/` (~400).
- [ ] **1.2** preset-typescript (~700)
- [ ] **1.3** preset-postcss, preset-lightningcss (~700)

### Phase 2: L3 and L2

- [ ] **2.1** preset-eslint, runner-gulp (~830)
- [ ] **2.2** commons-swc, commons-gulp, preset-jest (~860). Jest is the riskiest tool because it loads resolvers and transformers synchronously.
- [ ] **2.3** preset-vitest (~830)
- [ ] **2.4** runner-rspack (~865)
- [ ] **2.5** runner-webpack (~1160 lines of files, expected diff under 1000)
- [ ] stylelint-config-swissquote: already ESM, check only

### Phase 3: L1

- [ ] **3.1** crafty (~1560 lines of files, changes mostly at the top of each file)
- [ ] **3.2** eslint-plugin-swissquote (~1390 lines of files)
- [ ] **3.3** babel-preset-swissquote, postcss-swissquote-preset (~920)

### Phase 4: L0

- [ ] **4.1** crafty-commons, commons-webpack, preset-react, preset-terser, preset-prettier (~440)

### Phase 5: finishing

- [ ] **5.1** Forks `gulp-babel`, `gulp-concat` (~840)
- [ ] **5.2** Fork `gulp-newer` (~1480 lines of files)
- [ ] **5.3** Migrate the examples except `examples/simple`, which stays CommonJS.

### Separate track: ncc → rslib

- [ ] Move bundles from ncc to rslib one by one, as the status table shows rslib can handle each.
- [ ] Once no ncc bundle is left, remove ncc, `patchESMForCJS` and the "Ignoring ESM external" branch in `utils/externals.js`.

## Status

The table between the markers is generated by `yarn migration:status` (`utils/migration-status.js`) from the `build.config.js` files. Do not edit it by hand.

<!-- status:start -->
| Package | Type | Bundles on ncc | rslib bundles |
|---|---|---|---|
| @swissquote/babel-preset-swissquote | CJS | `babel-packages` | 0 |
| @swissquote/crafty | CJS | `source-map-support`, `crafty-packages` | 1 |
| @swissquote/crafty-commons | CJS | `ansi-colors`, `braces`, `browserslist`, `colorize-template`, `debug`, `end-of-stream`, `fancy-log`, `fill-range`, `find-up`, `tinyglobby`, `micromatch`, `minimatch`, `once`, `source-map-js`, `tmp`, `to-regex-range`, `wrappy`, `picomatch`, `semver` | 0 |
| @swissquote/crafty-commons-gulp | CJS | `vinyl-sourcemaps-apply`, `vinyl`, `common-packages` | 0 |
| @swissquote/crafty-commons-swc | CJS | `swc-packages` | 0 |
| @swissquote/crafty-commons-webpack | CJS | `json5`, `uri-js`, `big.js`, `loader-utils` | 0 |
| @swissquote/crafty-preset-babel | CJS | `babel-packages` | 0 |
| @swissquote/crafty-preset-eslint | CJS | `eslint-packages`, `@microsoft/eslint-formatter-sarif` | 1 |
| @swissquote/crafty-preset-lightningcss | CJS | `webpack-packages` | 0 |
| @swissquote/crafty-preset-maven | ESM | – | 1 |
| @swissquote/crafty-preset-postcss | CJS | `gulp-postcss`, `gulp-rename`, `resolve-from`, `loaders` | 0 |
| @swissquote/crafty-preset-stylelint | ESM | – | 3 |
| @swissquote/crafty-preset-terser | CJS | `terser` | 0 |
| @swissquote/crafty-preset-typescript | CJS | `fs-extra`, `fast-deep-equal`, `fast-json-stable-stringify`, `memfs`, `typescript-packages`, `fork-ts-checker-webpack-plugin`, `ts-checker-rspack-plugin` | 0 |
| @swissquote/crafty-runner-gulp | CJS | `gulp-packages` | 0 |
| @swissquote/crafty-runner-rspack | CJS | `packages-rspack` | 1 |
| @swissquote/crafty-runner-webpack | CJS | `speed-measure-webpack-plugin`, `packages-webpack` | 0 |
| @swissquote/eslint-plugin-swissquote | CJS | `merge2`, `is-extglob`, `is-glob`, `fast-glob`, `globals`, `get-tsconfig`, `confusing-browser-globals`, `stable-hash-x`, `eslint-import-resolver-typescript`, `eslint-config-prettier`, `eslint-import-context`, `eslint-plugin-import-x`, `ts-api-utils`, `typescript-eslint`, `prettier2`, `prettier1`, `prettier-linter-helpers` | 1 |
| @swissquote/postcss-swissquote-preset | CJS | `postcss-selector-parser`, `postcss-value-parser`, `color-name`, `postcss-values-parser`, `@knagis/postcss-advanced-variables`, `postcss-custom-selectors`, `postcss-font-variant`, `postcss-import`, `postcss-initial`, `postcss-nested`, `postcss-lightningcss`, `postcss-property-lookup`, `postcss-reporter`, `postcss-url` | 9 |
| @swissquote/stylelint-config-swissquote | ESM | `postcss-selector-parser`, `is-plain-object`, `mathml-tag-names`, `svg-tags`, `@csstools/css-tokenizer` | 299 |
<!-- status:end -->

## Blockers and notes

Written by hand: bundles rslib cannot produce yet, files kept as `.cjs` with the reason, and the experiment results.

### Experiment 0.1: ESM externals for ncc consumers

**Result: it works.** `utils/externals.js` no longer drops externals provided by ESM packages when the consumer is compiled with ncc. ncc emits a plain `require("<provider>/packages/<file>.js")`, which Node loads through `require(esm)`.

- **Problem found:** `require(esm)` returns the module namespace (`{ __esModule, default }`), not the value. Plain CommonJS code in a bundle then breaks. For example, `postcss-modules-*` in `crafty-preset-postcss` failed with `TypeError: selectorParser is not a function`.
- **Fix:** every `packages/*.js` file of an ESM package also exports its value as `"module.exports"` (`export { mod as "module.exports" };`). `require()` then returns the value itself. Node supports this from v22.12.0, the same version as our `engines` floor. `import` consumers are not affected.
- **Guard:** `getExternals()` throws when an ncc consumer would use an ESM `packages/*.js` file that has a default export but no `"module.exports"` export. A missing export fails the build instead of the runtime.
- **Proven on:** `crafty-preset-postcss` (`loaders` bundle: 339K → 164K) and `crafty-preset-lightningcss` (`webpack-packages` bundle: 464K → 286K). Both now use `postcss-selector-parser` and `postcss-value-parser` from `stylelint-config-swissquote` instead of bundling their own copies. The integration tests pass.
- **Consequence for the migration:** when a provider becomes ESM, add the `"module.exports"` export to its `packages/*.js` files. Named-export-only files (like `crafty-runner-rspack/packages/common-ancestor-path.mjs`) don't need it.
- **Not covered:** `.mjs` files in `packages/` of CommonJS packages (`camelcase-keys.mjs`, `eslint-react-eslint-plugin.mjs`, `prettier3.mjs`). Unbundled sources read them through `.default`, so adding `"module.exports"` would break those callers. They are handled when their package is migrated.

### Babel + Jest in `"type": "module"` projects (blocks `benchmarks/`)

In a `"type": "module"` project, `crafty-preset-jest` runs Jest with `--experimental-vm-modules`, but the Jest transformer of `crafty-preset-babel` still outputs CommonJS. Tests then fail with `ReferenceError: require is not defined`. No test covers this: the `crafty-preset-jest/esm-babel` fixture in `integration-fixtures-cjs` is a CommonJS project.

`benchmarks/` stays CommonJS until this is fixed in 1.1, because its jest benchmark uses `crafty-preset-babel`. A trial migration showed the vitest benchmark and all 4 build benchmarks work as ESM. It needs explicit extensions on the 12 relative imports in `benchmarks/src`, since webpack requires fully specified imports in `"type": "module"` packages.

### Tooling

- `utils/` keeps its `.mjs` file names (`build.mjs`, `compile.mjs`, `publish.mjs`, `package-sizes.mjs`) to avoid touching every package's `build` script. It can be renamed in a later mechanical PR.
- CommonJS `build.config.js` files still `require("../../utils/externals")` and `require("../../utils/functions.js")`. This works through `require(esm)` and keeps working until each package is migrated.
