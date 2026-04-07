# @tailng-ui/cdk

Headless behavior and accessibility primitives for TailNG UI, including focus/navigation, selection/typeahead, and overlay runtime orchestration for Angular 21+.

<div align="center">
  <img
    src="https://raw.githubusercontent.com/tailng/tailng-ui/main/apps/tailng-ui/docs/src/assets/logo.svg"
    width="120"
    alt="TailNG logo"
  />

  <h1>@tailng-ui/cdk</h1>

  <p>
    <strong>Accessible Angular UI, built to be owned.</strong>
  </p>

  <p>
    Headless behavior and accessibility primitives for TailNG UI.
    Designed for Angular 21+ apps, design systems, and reusable component architecture.
  </p>

  <p>
    <a href="https://github.com/tailng/tailng-ui">GitHub</a>
    ·
    <a href="https://tailng.dev">Documentation</a>
  </p>
</div>

[![PROD - Release & Deploy (Tailng)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml/badge.svg)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml)
[![NPM Version](https://img.shields.io/npm/v/@tailng-ui/cdk.svg)](https://www.npmjs.com/package/@tailng-ui/cdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`@tailng-ui/cdk` provides headless behavior primitives used by TailNG UI components.  
It focuses on accessibility, interaction logic, and runtime orchestration with no visual styling.

## Why this package

`@tailng-ui/cdk` provides reusable building blocks for:

- Accessible keyboard and focus behavior.
- Selection and typeahead state management.
- Overlay stacking, outside interaction, portal, and scroll-lock orchestration.
- SSR-friendly runtime utilities and platform-safe event handling.

The package is framework-friendly and intentionally style-agnostic.

## Installation

### pnpm

```bash
pnpm add @tailng-ui/cdk tslib
```

### yarn

```bash
yarn add @tailng-ui/cdk tslib
```

### npm

```bash
npm install @tailng-ui/cdk tslib
```

`tslib` is a peer dependency.

## Package design principles

- **Headless first**: no CSS classes, tokens, or visual opinions.
- **Composable APIs**: small primitives that can be combined.
- **A11y-oriented**: keyboard/focus/selection contracts are first-class.
- **Runtime-safe**: browser-dependent behavior is isolated behind explicit runtime hooks.

## Public entry points

### Root

```ts
import { createOverlayRuntime } from '@tailng-ui/cdk';
```

The root export re-exports:

- `@tailng-ui/cdk/a11y`
- `@tailng-ui/cdk/collections`
- `@tailng-ui/cdk/core`
- `@tailng-ui/cdk/overlay`
- `@tailng-ui/cdk/overlay/runtime`

### Subpath exports

Use subpaths for better bundle boundaries and API clarity:

- `@tailng-ui/cdk/a11y`
- `@tailng-ui/cdk/collections`
- `@tailng-ui/cdk/core`
- `@tailng-ui/cdk/overlay`
- `@tailng-ui/cdk/runtime` (package export alias)

## Module overview

### `a11y`

Behavior primitives for accessible interactions, including:

- Active descendant
- Disclosure
- Focus scope and focusable utilities
- Grid/list navigation
- Roving focus
- Listbox helpers

### `collections`

State and data interaction primitives, including:

- Selection model
- Tree model
- Typeahead

### `core`

Low-level utilities, including:

- ID generation helpers
- Keyed timer
- Platform/browser utilities

### `overlay`

Overlay primitives and contracts, including:

- Backdrop
- Focus handoff
- Layer stack
- Modal isolation
- Open/close delay
- Outside interaction
- Portal
- Positioning
- Scroll lock

### `overlay/runtime`

Runtime composition APIs that wire overlay interaction and stack behavior together.

- `createOverlayRuntime(...)`
- `createOverlayScrollLockManager(...)`
- Overlay instance helpers/types

## Quick example

```ts
import { createOverlayRuntime } from '@tailng-ui/cdk/overlay/runtime';

const runtime = createOverlayRuntime({
  documentRef: typeof document !== 'undefined' ? document : null,
});

runtime.registerLayer({
  id: 'dialog-1',
  dismiss: () => {
    // close dialog
  },
});
```

## Angular CDK adapter notes

The repository includes internal adapter scaffolding for Angular CDK-backed behavior where applicable.  
When adapter delegates are not provided, implementations fall back to TailNG defaults.

Primary internal adapter area:

- `libs/tailng-ui/cdk/src/adapters/angular-cdk`

## Contributing

When contributing to this package:

- Keep APIs headless and framework-agnostic.
- Prefer readonly contracts for state and action types.
- Preserve SSR safety (avoid direct global DOM access in core logic).
- Add/adjust tests with behavior changes.

## License

See the repository license at the root of the monorepo.
