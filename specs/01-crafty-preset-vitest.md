This document defines the current scope for Vitest support in Crafty.

It replaces the earlier broad investigation framing with a narrower target
based on the decisions already made.

[TOC]

## Summary

Crafty should support Vitest as a fully supported alternative to Jest.

The goal is not to redesign Crafty's test architecture. The goal is to add a
`crafty-preset-vitest` that gives Vitest the same kind of Crafty integration
that Jest has today:

- `crafty test` integration.
- Runtime configuration generation from Crafty state.
- A Vitest-specific extension hook for other presets and `crafty.config.js`.
- IDE integration through `crafty ide`.
- A small set of Crafty-owned defaults where they still add value.

## Key Decisions

- Vitest is an alternative to Jest, not a replacement.
- `crafty test` remains the main user-facing test command.
- Crafty supports exactly one active test runner per project for now.
- If both Jest and Vitest runners are configured, Crafty should fail with a
	clear error.
- Multi-runner support is explicitly out of scope for this work.
- Vitest gets its own runner-specific hook, expected to be
	`vitest(crafty, config, context)`.
- For `crafty test`, Crafty-owned Vitest config should be computed in the
	parent process and handed off to the child runner as serialized state rather
	than by reinitializing Crafty inside the runtime test config.
- The configuration model stays runner-specific rather than introducing a shared
	test abstraction.
- Native `vitest.config.*` files should be loaded through Vite and merged with
	Crafty-generated config.

## Why Multi-Runner Support Is Deferred

The original `crafty test` implementation ran every loaded `test()`
implementation, but that behavior was implicit and ambiguous rather than a real
product model.

Supporting both Jest and Vitest in one project in a useful way would require
additional design that we are not taking on now, including:

- Suite ownership or runner-specific include patterns.
- CLI flag routing.
- Clear reporting and failure semantics.
- A migration story for mixed Jest and Vitest projects.

That remains a valid future use case, especially for gradual migrations, but it
should be handled by a separate follow-up spec rather than folded into the
first Vitest rollout.

## In Scope

- Add `@swissquote/crafty-preset-vitest` as a first-class Crafty preset.
- Run Vitest through `crafty test` when Vitest is the only configured test
	runner.
- Generate Vitest configuration at runtime from Crafty state.
- Expose a `vitest(...)` hook so other presets and `crafty.config.js` can
	extend the Vitest configuration.
- Support native `vitest.config.*` files with a defined coexistence contract.
- Add IDE-facing Vitest configuration through `crafty ide`.
- Investigate and implement the minimum Crafty-owned defaults needed for:
	asset and style handling, resolver behavior, environment defaults, and ESM
	compatibility.
- Define how Babel, TypeScript, SWC, and React should participate in Vitest.
- Add integration coverage and fixtures for the supported Vitest scenarios.
- Document Vitest as a supported option and provide a migration guide from Jest.

## Out of Scope

- Running Jest and Vitest together in one project.
- Mapping old suites to Jest and new suites to Vitest within the same
	invocation.
- A generalized runner abstraction.
- Separate `crafty jest` or `crafty vitest` commands unless a later need is
	proven.
- Replacing or deprecating Jest.

## Command Model

The command model for this work is intentionally simple.

- `crafty test` runs the single configured test runner.
- If no test runner is configured, Crafty reports that no runner was found.
- If more than one test runner is configured, Crafty reports a clear error and
	does not guess.
- Runner-specific CLI arguments are only expected to work when there is exactly
	one active runner.

## Config Contract

The config model for Vitest should follow the same broad ownership pattern as
Jest, while still allowing Vitest-native configuration where it fits.

- For `crafty test`, Crafty computes its own Vitest config in the parent
	process.
- The generated runtime config used by the child runner should only load native
	`vitest.config.*` through Vite, materialize serialized Crafty state, and merge
	the two.
- Merge order is native config first, then Crafty-generated config, so Crafty
	defaults and preset hook contributions still apply on the supported Crafty
	runtime path.
- IDE-facing config generation may remain a separate live path if editor
	integration still needs to initialize Crafty directly.

## Hook Contract

The `vitest(crafty, options, context)` hook is the extension point for other
presets and `crafty.config.js`.

- `options` is for serializable Vitest config mutations that must survive the
	parent-to-child handoff used by `crafty test`.
- `context.moduleDirectories` and `context.moduleFileExtensions` extend test
	discovery and module resolution.
- `context.runtimePlugins` is the supported way to register runtime Vite
	plugins for `crafty test`. Presets should contribute serializable plugin
	descriptors there rather than attaching function-valued Vite plugin objects
	directly to `options.plugins`.
- Babel and SWC runtime transform participation should be provided through that
	runtime plugin path.
- React and TypeScript should continue to participate through runner-specific
	configuration that stays within their existing concerns.

## Parity Target

The target is Jest-like Crafty integration parity, not blind feature parity
with every Jest implementation detail.

The Vitest preset should cover the same broad Crafty surfaces as the Jest
preset where that remains useful:

- Runtime config generation.
- Extension hooks.
- IDE integration.
- Test discovery conventions.
- Asset and style defaults.
- Resolver and module behavior where needed.
- Environment and `NODE_ENV` behavior.
- Reporting and CI integration where Crafty currently adds value.

The implementation should prefer Vitest-native behavior whenever it already
solves the problem cleanly.

## Remaining Questions

The following questions still need answers, but they are now scoped to the
single-runner Vitest model.

- Which Jest-era compatibility behavior is still needed under Vitest, if any?
- What should the default environment and `NODE_ENV` behavior be?
- What Sonar, IDE, and CI support should be included in the first supported
	release?
- Which parity gaps, if any, are acceptable in the first rollout?

## Implementation Priorities

The work should proceed in this order.

1. Keep the single-runner contract explicit in `crafty test`.
2. Deliver the base Vitest preset with plain JS support and IDE integration.
3. Add preset interoperability for Babel, TypeScript, SWC, and React.
4. Close parity gaps around config merging, resolution, assets, ESM, and
	environment behavior.
5. Finish reporting, docs, migration guidance, and validation coverage.

## Done Criteria

This work should be considered complete only when all of the following are
true.

- Vitest works as the sole active test runner through `crafty test`.
- Crafty rejects multiple active test runners with a clear message.
- Vitest configuration can be built from Crafty state and extended through a
	`vitest(...)` hook without requiring a second Crafty initialization in the
	runtime test config.
- The supported native `vitest.config.*` coexistence model is defined and
	tested.
- The supported integration matrix is covered by fixtures and integration tests.
- Vitest is documented as a supported alternative to Jest, with a migration
	guide from Jest.

If later we want mixed Jest and Vitest projects in one Crafty configuration,
that should be handled as a separate spec.
