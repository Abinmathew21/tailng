# Empty

Headless empty-state primitive for no-data and no-results experiences.

## Overview

Empty state communicates that a collection has no items yet, or a query/filter returned nothing.
It should guide users with clear text and optional actions (create, retry, clear filter).

TailNG Empty provides:

- A headless primitive slot contract (`tngEmpty*`) for fully custom markup.
- A styled wrapper component family (`tng-empty*`) for ready defaults.
- Stable data-slot hooks for theme-level customization.

## Supported states

- `align`: `'center' | 'start'` (wrapper input, default `center`)
- Optional icon, title, description, and actions regions
- Headless and wrapper composition

## Common use cases

- Empty table/list state
- No search results state
- First-run onboarding state
- Empty dashboard cards

## Headless component goals

- Provide semantic structure for empty-state content
- Expose slot hooks for all parts
- Keep behavior non-interactive and layout-only
- Compose cleanly with consumer-owned buttons/actions

## Required headless features

### Core behavior

- Root empty container
- Optional icon/title/description/actions parts
- No internal interaction side effects
- Works with arbitrary projected content

### Accessibility

- Encourage readable title and supporting description
- Keep logical reading order (icon → title → description → actions)
- Let consumers provide meaningful action labels

### State exposure

- `data-slot="empty"`
- `data-slot="empty-icon"`
- `data-slot="empty-title"`
- `data-slot="empty-description"`
- `data-slot="empty-actions"`
- Wrapper root also exposes `data-align="center|start"`

## Suggested primitives / parts

- `TngEmpty` via `[tngEmpty]`
- `TngEmptyIcon` via `[tngEmptyIcon]`
- `TngEmptyTitle` via `[tngEmptyTitle]`
- `TngEmptyDescription` via `[tngEmptyDescription]`
- `TngEmptyActions` via `[tngEmptyActions]`

## Suggested APIs

### Primitive directives

- Structural only; no inputs required for state
- Export handles: `tngEmpty`, `tngEmptyIcon`, `tngEmptyTitle`, `tngEmptyDescription`, `tngEmptyActions`

### Wrapper components

- `<tng-empty [align]="'center' | 'start'">`
- `<tng-empty-icon>`
- `<tng-empty-title>`
- `<tng-empty-description>`
- `<tng-empty-actions>`

## Test checklist

### Primitive tests

- [x] Exports all empty directives
- [x] Supports `exportAs` handles
- [x] Applies expected `data-slot` hooks for all parts

### Component tests

- [x] Exports all wrapper components
- [x] Renders wrapper root with default `data-align="center"`
- [x] Updates `data-align` when `align` input changes
- [x] Preserves slot hooks for projected icon/title/description/actions
- [x] Keeps projected interactive actions in output

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless (`__tests__`)
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-empty>` component created in `components`
6. [x] Test cases created for `<tng-empty>` (`__tests__`)
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add empty`)
14. [x] `tailng-cli` command generation added for empty artifacts
15. [x] CLI integration tests added for `tailng add empty`

## Links

- Playground: `/empty`
