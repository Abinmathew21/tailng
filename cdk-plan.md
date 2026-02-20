# TailNG CDK Plan Checklist

Use this as the execution checklist for `@tailng-ui/cdk`.

## 1. Scope And Contracts

- [ ] Confirm CDK scope: behavior + accessibility only (no styles, no themes).
- [ ] Confirm CDK is signal-first.
- [ ] Confirm CDK is SSR-safe for DOM access.
- [ ] Confirm components import from `@tailng-ui/cdk/*` only (no direct `@angular/cdk/*` in components).
- [ ] Confirm icons/flags stay outside CDK (flags via external provider flow).

## 2. Package Creation

- [x] Generate library `libs/tailng-ui/cdk`.
- [x] Set publishable package name to `@tailng-ui/cdk`.
- [x] Add tags in `project.json` (`scope:tailng`, `type:cdk`).
- [x] Add lint target.
- [x] Add test target (`vite:test`).
- [x] Add build target (`@nx/js:tsc`).
- [x] Add README for CDK usage and boundaries.

## 3. Public Import Paths

- [x] Export root entry `@tailng-ui/cdk`.
- [x] Export `@tailng-ui/cdk/a11y`.
- [x] Export `@tailng-ui/cdk/collections`.
- [x] Export `@tailng-ui/cdk/overlay`.
- [x] Export `@tailng-ui/cdk/core`.
- [x] Add/update `tsconfig.base.json` paths.
- [ ] Validate subpath exports in `libs/tailng-ui/cdk/package.json`.

## 4. Folder Scaffold

- [x] Create `src/index.ts`.
- [x] Create `src/a11y/index.ts`.
- [x] Create `src/collections/index.ts`.
- [x] Create `src/overlay/index.ts`.
- [x] Create `src/core/index.ts`.
- [x] Create `src/core/id/id.ts`.
- [x] Create `src/core/id/id.spec.ts`.
- [x] Create `src/core/platform/is-browser.ts`.

## 5. Primitive 1: Selection Model

- [x] Create `src/collections/selection-model/selection-model.types.ts`.
- [x] Create `src/collections/selection-model/selection-model.ts`.
- [x] Create `src/collections/selection-model/selection-model.spec.ts`.
- [x] Export from `src/collections/index.ts`.
- [ ] Add keyboard + behavior tests for single and multi select.

## 6. Primitive 2: Typeahead

- [x] Create `src/collections/typeahead/typeahead.types.ts`.
- [x] Create `src/collections/typeahead/typeahead.ts`.
- [x] Create `src/collections/typeahead/typeahead.spec.ts`.
- [x] Export from `src/collections/index.ts`.
- [ ] Add tests for buffering, timeout, wrap behavior, disabled items.

## 7. Primitive 3: Roving Focus

- [x] Create `src/a11y/roving-focus/roving-focus.types.ts`.
- [x] Create `src/a11y/roving-focus/roving-focus.ts`.
- [x] Create `src/a11y/roving-focus/roving-focus.spec.ts`.
- [x] Export from `src/a11y/index.ts`.
- [ ] Add tests for horizontal/vertical orientation and wrapping.

## 8. Primitive 4: Active Descendant

- [x] Create `src/a11y/active-descendant/active-descendant.types.ts`.
- [x] Create `src/a11y/active-descendant/active-descendant.ts`.
- [x] Create `src/a11y/active-descendant/active-descendant.spec.ts`.
- [x] Export from `src/a11y/index.ts`.
- [ ] Add tests for id binding, next/prev navigation, reset.

## 9. Primitive 5: Dismissable Layer

- [x] Create `src/overlay/dismissable-layer/dismissable-layer.types.ts`.
- [x] Create `src/overlay/dismissable-layer/dismissable-layer.ts`.
- [x] Create `src/overlay/dismissable-layer/dismissable-layer.spec.ts`.
- [x] Export from `src/overlay/index.ts`.
- [ ] Add tests for escape, outside click, and layer stack priority.

## 10. Primitive 6: Focus Scope

- [x] Create `src/a11y/focus-scope/focus-scope.types.ts`.
- [x] Create `src/a11y/focus-scope/focus-scope.ts`.
- [x] Create `src/a11y/focus-scope/focus-scope.spec.ts`.
- [x] Export from `src/a11y/index.ts`.
- [ ] Add tests for trap, restore focus, nested scopes.

## 11. Cross-Cutting Quality Gates

- [x] Add barrel exports for all primitives in root `src/index.ts`.
- [ ] Ensure no `any` and no lint warnings.
- [ ] Ensure all tests pass (`pnpm test` / scoped targets).
- [ ] Ensure build passes for `@tailng-ui/cdk`.
- [ ] Add usage examples in README for each primitive.

## 12. First Integrations

- [ ] Integrate `selection-model` in list/select primitives.
- [ ] Integrate `roving-focus` in tabs/toolbar/toggle-group.
- [ ] Integrate `active-descendant` in combobox/listbox.
- [ ] Integrate `dismissable-layer` + `focus-scope` in dialog/popover.
- [ ] Add integration tests in playground for keyboard and ARIA behavior.
