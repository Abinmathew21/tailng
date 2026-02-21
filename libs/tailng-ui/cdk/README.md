<div align="center">
  <img
    src="https://raw.githubusercontent.com/tailng/tailng-ui/main/apps/tailng-ui/docs/src/assets/logo.svg"
    width="96"
    alt="TailNG logo"
  />
</div>

# @tailng-ui/cdk

Behavior and accessibility primitives for TailNG UI.

## Design Rules

- No styles and no design tokens.
- Signal-first APIs.
- SSR-safe DOM access.
- Public surface through `@tailng-ui/cdk/*` subpaths.

## Phase 1 Primitives

- Selection model
- Typeahead
- Roving focus
- Active descendant
- Dismissable layer
- Focus scope

## Angular CDK Migration

- Migration checklist: `cdk-angular-migration-plan.md` (repo root)
- Internal adapter scaffold: `libs/tailng-ui/cdk/src/adapters/angular-cdk`
- Current adapter behavior:
  - Fallback to existing TailNG implementations by default.
  - In `prefer-angular-cdk` mode, adapter delegates can be injected for overlay features
    (`portal`, `positioning`, `outside-interaction`, `backdrop`, `scroll-lock`).
  - Missing delegates automatically fall back to TailNG implementations.
