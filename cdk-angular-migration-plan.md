# TailNG CDK Angular CDK Migration Plan

Use this checklist to migrate `@tailng-ui/cdk` internals to Angular CDK while keeping
TailNG public APIs stable (`@tailng-ui/cdk/*`).

## Principles

- [x] Keep public contracts stable for consumers.
- [x] Migrate internals where Angular CDK is mature and battle-tested.
- [x] Keep TailNG-owned policy/state where CDK does not provide a direct equivalent.
- [ ] Do not add direct `@angular/cdk/*` imports in `components` or `primitives`.

## Dependency Gate

- [ ] Add `@angular/cdk` as a dependency in the workspace.
- [ ] Add `@angular/cdk` as a peer dependency in `libs/tailng-ui/cdk/package.json`.
- [ ] Verify Angular/CDK version alignment with Angular 21.

## A11y Features

- [ ] `a11y/active-descendant/active-descendant.ts`
      Decision: migrate internals to Angular CDK `ActiveDescendantKeyManager`; keep TailNG API.

- [ ] `a11y/roving-focus/roving-focus.ts`
      Decision: migrate internals to Angular CDK `FocusKeyManager`; keep TailNG API.

- [ ] `a11y/list-navigation/list-navigation.ts`
      Decision: keep action-policy surface; wire actions from Angular CDK key manager behavior.

- [ ] `a11y/focus-scope/focus-scope.ts`
      Decision: partial migration to Angular CDK focus trap primitives (`FocusTrapFactory` or `cdkTrapFocus`);
      keep TailNG nested-scope policy and restore-focus contract.

- [ ] `a11y/grid-navigation/grid-navigation.ts`
      Decision: keep TailNG-owned (domain action mapping and grid movement policy).

- [ ] `a11y/disclosure/disclosure.ts`
      Decision: keep TailNG-owned (small deterministic state machine).

## Collection Features

- [ ] `collections/selection-model/selection-model.ts`
      Decision: migrate internals to Angular CDK `SelectionModel<T>`; keep TailNG contract.

- [ ] `collections/typeahead/typeahead.ts`
      Decision: migrate internals to Angular CDK `ListKeyManager.withTypeAhead`; keep TailNG contract.

- [ ] `collections/tree-model/tree-model.ts`
      Decision: keep TailNG-owned (tree data/state model independent of rendering library).

## Overlay Features

- [ ] `overlay/positioning/positioning.ts`
      Decision: migrate to Angular CDK `Overlay` positioning strategies.

- [ ] `overlay/portal/portal.ts`
      Decision: migrate to Angular CDK `Portal` (`TemplatePortal`/`ComponentPortal`) internals.

- [ ] `overlay/backdrop/backdrop.ts`
      Decision: migrate to Angular CDK overlay backdrop APIs (`hasBackdrop`, `backdropClick()`).

- [ ] `overlay/outside-interaction/outside-interaction.ts`
      Decision: migrate to Angular CDK overlay interaction/keyboard dispatch behavior.

- [ ] `overlay/scroll-lock/scroll-lock.ts`
      Decision: migrate to Angular CDK `ScrollStrategyOptions.block()`.

- [ ] `overlay/focus-handoff/focus-handoff.ts`
      Decision: partial keep; retain TailNG layer focus policy, use CDK focus trap internals.

- [ ] `overlay/modal-isolation/modal-isolation.ts`
      Decision: partial keep; retain TailNG policy contract, align implementation with CDK overlay container.

- [ ] `overlay/layer-stack/layer-stack.ts`
      Decision: keep TailNG-owned (stack priority/dismiss policy).

- [ ] `overlay/dismissable-layer/dismissable-layer.ts`
      Decision: deprecate/remove after `layer-stack` is canonical to avoid duplicate stack contracts.

## Core Utilities

- [ ] `core/id/id.ts`
      Decision: keep TailNG-owned utility.

- [ ] `core/platform/is-browser.ts`
      Decision: keep TailNG-owned utility.

## Implementation Phases

## Phase 1: Adapter Scaffold

- [x] Create internal adapter folder: `libs/tailng-ui/cdk/src/adapters/angular-cdk`.
- [x] Add adapter policy/config file for migration mode and per-feature enablement.
- [x] Add selection adapter scaffold (fallback to current TailNG implementation).
- [x] Add key manager adapter scaffold (fallback to current TailNG implementation).
- [x] Add overlay adapter scaffold (fallback to current TailNG implementation).
- [x] Keep adapter internals non-exported from `@tailng-ui/cdk` public entrypoints.

## Phase 2: Overlay First Migration

- [x] Add overlay adapter delegate wiring for `portal`, `positioning`, `backdrop`,
      `outside-interaction`, and `scroll-lock` (feature-flagged, fallback-safe).
- [x] Migrate internals to concrete Angular CDK delegate implementations
      (`libs/tailng-ui/cdk/src/adapters/angular-cdk/overlay.angular-cdk.ts`).
- [x] Update dialog/popover internals to use migrated overlay adapters
      (`createOverlayRuntime` + `createOverlayScrollLockManager`).
- [x] Add regression tests for escape/outside click/stacked overlays
      (`libs/tailng-ui/cdk/src/runtime/overlay-runtime.spec.ts`).

## Phase 3: A11y And Selection Migration

- [x] Migrate `active-descendant`, `roving-focus`, `typeahead`, `selection-model`
      behind adapter delegates.
- [x] Keep API compatibility tests at current TailNG contract level.
- [x] Add parity tests for arrow/home/end/typeahead behavior.

## Phase 4: Consolidation

- [x] Remove duplicate `dismissable-layer` contract
      (legacy API now delegates to `layer-stack`).
- [x] Confirm all components only consume `@tailng-ui/cdk/*`, never `@angular/cdk/*`.
- [x] Document final migration outcomes in `libs/tailng-ui/cdk/README.md`.

## Validation Checklist

- [ ] `pnpm nx run cdk:lint`
- [x] `pnpm test:cdk`
- [ ] `pnpm nx run components:lint`
- [x] `pnpm test:components`
- [ ] Dialog + popover demos pass keyboard and dismissal checks.
