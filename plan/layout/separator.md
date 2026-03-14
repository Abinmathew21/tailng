# Separator

Headless separator primitive for horizontal and vertical visual dividers between content.

## Overview

Separator is a headless layout primitive that renders a visual divider between content areas (e.g. between list items, menu groups, toolbar sections, or layout splits). It can be horizontal or vertical and can be decorative (presentational only) or semantic (exposed to assistive technology with `role="separator"` and `aria-orientation`).

This component exposes orientation and decorative state for styling; it has no interactive behavior.

## Supported states

- `orientation`: horizontal | vertical
- `decorative`: true (presentational, aria-hidden) | false (semantic separator)

## Common use cases

- Dividing menu items or list groups
- Splitting toolbar sections
- Visual separation in cards or panels
- Layout splits (e.g. resizable panels with a divider)
- Between headings and content

## Headless component goals

- Provide correct semantics: decorative vs. semantic separator
- Support horizontal and vertical orientation
- Expose state for styling (e.g. themed border or line)
- No interactive behavior; purely structural/presentational

## Required headless features

### Core behavior

- Horizontal and vertical orientation support
- Decorative mode: `aria-hidden="true"`, no role (presentational)
- Semantic mode: `role="separator"`, `aria-orientation` when not decorative
- No keyboard or pointer interaction

### Accessibility

- When decorative: `aria-hidden="true"`, no role (screen readers ignore)
- When not decorative: `role="separator"`, `aria-orientation="horizontal" | "vertical"`
- Orientation must match visual layout so AT can describe structure when semantic

### Composition

- Single primitive (root only); no child parts required
- Composes in menus, toolbars, cards, or custom layout

### State exposure

- `data-orientation="horizontal" | "vertical"`
- `data-slot="separator"` for styling hooks

## Suggested primitives / parts

- `SeparatorRoot` (single directive, e.g. `tngSeparator`)

## Suggested APIs

### Separator root

- `orientation?: 'horizontal' | 'vertical'` (default: `'horizontal'`)
- `decorative?: boolean` (default: `true` — presentational only)

### Angular API contract (required)

- `tngSeparator` should expose Angular-style bindings:
  - Inputs: `orientation`, `decorative`

## Keyboard interaction

- None; separator is not focusable and has no interaction.

## Accessibility notes

- Use `decorative={true}` for purely visual dividers (menus, cards) so AT does not announce them
- Use `decorative={false}` when the divider has structural meaning (e.g. between major regions)
- Ensure orientation matches visual layout for semantic separators

## Open design decisions

- Whether to support optional `id` for aria references
- Naming: `decorative` vs. `ariaHidden` as the primary input

## Test checklist

### Rendering

- [x] Renders with horizontal orientation by default
- [x] Renders with vertical orientation when `orientation='vertical'`
- [x] Applies `data-orientation` correctly
- [x] Renders as decorative (no role) when `decorative=true`
- [x] Renders as semantic separator (role, aria-orientation) when `decorative=false`

### Accessibility

- [x] Sets `aria-hidden="true"` when decorative
- [x] Sets `role="separator"` when not decorative
- [x] Sets `aria-orientation` when not decorative and matches orientation

### Data attributes

- [x] Applies `data-orientation` for styling
- [x] Applies `data-slot="separator"` where used

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-separator>` component created in `components`
6. [x] Test cases created for `<tng-separator>`
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add separator`)
14. [x] `tailng-cli` command generation added for separator artifacts
15. [x] CLI integration tests added for `tailng add separator`

## Links

- Playground: `/separator`
