# Ownable CLI Hardening Plan

Production plan for making the TailNG ownable install path production-grade across:

- `tailng` CLI
- `@tailng-ui/registry`
- docs `Ownable Install` pages
- release / CI pipelines

## Goal

Make the ownable install flow reliable end to end:

1. Docs show only supported install targets.
2. Docs snippets match the actual generated files and exported symbols.
3. The published CLI can be installed and executed in a clean workspace.
4. CI fails immediately when docs, registry, and CLI drift.

## Current gaps

### Blockers

- Docs ownable-install pages reference unsupported registry slugs:
  - `datepicker`
  - `listbox`
  - `multi-autocomplete`
  - `selectbox`
- Docs ownable-install import snippets are route-authored and drift from the registry output.
- Docs generated-files list is hardcoded and already wrong for valid items such as `button`.
- CI does not run a packaged CLI install smoke test.

### Important but non-blocking

- CLI tests are strong on file writes, but weak on user-facing command behavior.
- Registry README is stale and does not reflect the actual registry surface.
- Release tooling uses inconsistent naming for the CLI package label (`@tailng/cli` vs actual package name `tailng`).

## Working model

The registry must become the single source of truth for ownable install metadata.

Docs and CLI should not maintain parallel copies of:

- supported component slugs
- generated file lists
- exported symbols
- install hints

## Workstreams

## 1. Establish the supported ownable surface

### Objective

Define which component docs pages are allowed to expose `Ownable Install` today.

### TODO

- [x] Audit every docs route using `registrySlug`.
- [x] Remove or hide `Ownable Install` for unsupported slugs until real registry items exist.
- [x] Decide whether these should be added to the registry now or deferred:
  - [x] `datepicker` deferred
  - [x] `listbox` deferred
  - [x] `multi-autocomplete` deferred
  - [x] `selectbox` deferred
- [x] Add a docs-to-registry contract test that fails when a docs `registrySlug` is not found in the registry.

### Exit criteria

- No docs route exposes an ownable-install page for a missing registry item.

## 2. Move ownable metadata into the registry contract

### Objective

Stop deriving docs snippets from route-local strings and generic filename assumptions.

### Recommended change

Extend `RegistryItem` with explicit install metadata. Suggested shape:

```ts
type RegistryInstallMetadata = Readonly<{
  componentSymbols: readonly string[];
  importPath: string;
  usageCode: string;
}>;
```

Then derive:

- generated file list from `item.files`
- import code from `item.install`
- supported slugs from `tailngRegistry`

### TODO

- [x] Add install metadata to `RegistryItem`.
- [x] Backfill install metadata for every existing registry item.
- [x] Update docs ownable-install section to resolve data from the registry item instead of route-local `componentSymbol` / `primitiveSymbol`.
- [x] Replace `buildGeneratedFiles(...)` with direct use of `item.files.map(file => file.path)`.
- [x] Remove duplicated route-level symbol metadata once registry metadata is in place.

### Exit criteria

- Docs ownable-install page can be rendered from `registrySlug` alone.

## 3. Fix the docs ownable-install pages

### Objective

Make docs truthful and mechanically validated.

### TODO

- [x] Update `Ownable Install` shared component to load registry data directly.
- [x] Ensure generated file list reflects actual registry paths.
- [x] Ensure import snippet reflects actual exported symbol names.
- [ ] Ensure usage snippet is either:
  - [ ] stored in registry metadata, or
  - [ ] intentionally overridden with a documented per-route escape hatch.
- [x] Add component tests for the docs ownable-install section:
  - [x] valid slug renders correct install commands
  - [x] generated files match registry item files
  - [x] import snippet matches registry metadata
  - [x] invalid slug fails clearly

### Exit criteria

- No ownable-install docs page uses hardcoded generated filenames or mismatched imports.

## 4. Harden CLI command behavior

### Objective

Cover the CLI as a user-facing tool, not only as a file emitter.

### TODO

- [x] Add tests for `tailng list`.
- [x] Add tests for `tailng --help` and `tailng help`.
- [x] Add tests for unknown command handling.
- [x] Add tests for missing component name on `add`.
- [x] Add tests for invalid `--cwd`.
- [x] Add tests for alias resolution output.
- [x] Add tests for dependency hint output.
- [x] Add tests for import hint output.
- [x] Add tests for path traversal rejection.
- [ ] Add tests for `--dry-run --force` overwrite preview messaging.
- [ ] Add tests for stderr/stdout contract where relevant.

### Nice-to-have

- [ ] Add snapshots for help and list output.
- [ ] Add explicit tests for canonical-name formatting and alias table ordering.

### Exit criteria

- CLI behavior coverage includes command parsing, user messaging, and failure modes.

## 5. Add packaged install smoke tests

### Objective

Validate the actual published artifact shape, not only source-level execution.

### Recommended test shape

In CI:

1. Build `registry` and `cli`.
2. Pack both packages from `dist`.
3. Install them into a clean temporary workspace.
4. Run `npx tailng add button`.
5. Assert generated files exist and contain expected symbols.

### TODO

- [x] Add a smoke script under `tools/` for packed CLI install validation.
- [x] Pack `dist/libs/tailng-ui/registry`.
- [x] Pack `dist/libs/tailng/cli`.
- [x] Install both tarballs into a temp workspace.
- [x] Execute `npx tailng list`.
- [x] Execute `npx tailng add button`.
- [x] Assert generated files exist.
- [ ] Optionally run `tsc --noEmit` in the temp workspace against generated output.

### Optional stronger variant

- [ ] Run the smoke test via local Verdaccio to simulate publish/install resolution.

### Exit criteria

- CI proves the packed CLI binary works after build, not only in source mode.

## 6. Wire the checks into CI/CD

### Objective

Make drift fail before release.

### TODO

- [x] Add a dedicated manual release workflow for registry + CLI.
- [x] Add docs-to-registry contract test to CI.
- [x] Add packed CLI smoke test to CI.
- [ ] Keep current unit test steps for:
  - [x] registry
  - [x] cli
- [x] Add a release-time gate so `prod-build-deploy` refuses to publish if ownable smoke fails.

### Recommended workflow split

- Manual ownable release workflow:
  - [x] registry tests
  - [x] cli tests
  - [x] docs-to-registry contract
  - [x] pack dry run
  - [x] packed CLI install smoke
  - [x] dist verification

### Exit criteria

- A broken ownable-install docs page or broken packaged CLI cannot reach release.

## 7. Refresh documentation

### Objective

Make public docs and package READMEs reflect the real supported surface.

### TODO

- [x] Update `libs/tailng/cli/README.md`:
  - [x] supported commands
  - [x] supported options
  - [x] alias table
  - [x] example usage from clean workspace
- [x] Update `libs/tailng-ui/registry/README.md` from the actual registry list.
- [x] Add a generated registry item list or script-backed README section.
- [ ] Update docs getting-started pages to explain:
  - [ ] what ownable install does
  - [ ] where files are written
  - [ ] overwrite behavior
  - [ ] dependency hints
  - [ ] unsupported components policy

### Exit criteria

- README and docs reflect the actual registry and CLI behavior.

## 8. Clean up release consistency

### Objective

Remove packaging and naming ambiguity before wider adoption.

### TODO

- [ ] Align release script labels with the actual CLI package identity (`tailng`).
- [ ] Verify `bin` resolution in packed `dist` output.
- [ ] Add a small assertion that the packed CLI contains:
  - [ ] executable entry file
  - [ ] `bin.tailng`
  - [ ] resolved non-workspace dependency ranges
- [ ] Confirm package naming strategy:
  - [ ] executable package name stays `tailng`
  - [ ] no stray references to `@tailng/cli` remain in release messaging unless intentional

### Exit criteria

- Release scripts, package manifests, and docs all describe the same CLI package.

## Suggested execution order

### Phase 1: Stop incorrect docs

- [x] Remove unsupported ownable-install tabs or add real registry items for missing slugs.
- [x] Add docs-to-registry slug validation.

### Phase 2: Single source of truth

- [x] Move install metadata into registry.
- [x] Refactor docs ownable-install section to use registry data.

### Phase 3: Harden tool behavior

- [ ] Expand CLI behavior tests.
- [ ] Expand docs ownable-install tests.

### Phase 4: Ship-safe packaging

- [x] Add packed CLI smoke test.
- [x] Gate release on smoke test.

### Phase 5: Documentation cleanup

- [x] Refresh READMEs and getting-started docs.
- [x] Remove stale examples and stale item lists.

## Definition of done

The ownable CLI can be considered production-ready when all of the following are true:

- [x] Every docs `Ownable Install` page maps to a real registry item.
- [x] Docs snippets are generated from registry metadata, not duplicated route strings.
- [ ] CLI unit tests cover parsing, UX, and failure paths.
- [ ] Packaged CLI smoke test passes in CI.
- [ ] Release workflow blocks publish on ownable smoke failures.
- [x] Dedicated manual workflow runs registry/CLI/docs contract checks before build and publish.
- [x] Registry and CLI READMEs are current.
- [ ] No known mismatch remains between docs routes, registry items, and generated output.

## Immediate next tasks

- [x] Expand CLI tests for missing component name, invalid `--cwd`, alias/dependency/import hints, and path traversal rejection.
- [x] Add docs ownable-install component tests for valid slug, invalid slug, generated files, and import snippet rendering.
- [x] Add a dedicated manual workflow for registry + CLI contract checks and publish flow.
