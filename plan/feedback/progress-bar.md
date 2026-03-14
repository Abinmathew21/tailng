# Progress Bar

Headless linear progress primitive for determinate and indeterminate loading states.

## Overview

Progress Bar communicates completion state for tasks such as uploads, rollouts, and background
loading. It supports:

- Determinate progress (`min`, `max`, `value`)
- Indeterminate loading state (`indeterminate`)
- Semantic `progressbar` accessibility attributes
- Stable slot hooks for custom styling

## Supported states

- `min`: number (default `0`)
- `max`: number (default `100`)
- `value`: number (default `0`)
- `indeterminate`: boolean (default `false`)
- Wrapper input: `ariaLabel` for accessible naming

## Common use cases

- File upload progress
- CI/CD rollout status
- Background synchronization
- Step completion indicators

## Headless component goals

- Expose semantic range attributes for determinate state
- Remove range attributes for indeterminate state
- Clamp invalid ranges and values safely
- Provide root/indicator slot hooks for theming

## Required headless features

### Core behavior

- Root directive for progress track
- Indicator directive for fill element
- Range normalization (`min`, `max`, `value`)
- Indeterminate state hooks

### Accessibility

- `role="progressbar"` on root
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` in determinate mode
- Omit `aria-value*` attributes in indeterminate mode

### State exposure

- `data-slot="progress-bar"` on root
- `data-slot="progress-bar-indicator"` on indicator
- `data-indeterminate` on root and indicator during indeterminate state

## Suggested primitives / parts

- `TngProgressBar` via `[tngProgressBar]`
- `TngProgressBarIndicator` via `[tngProgressBarIndicator]`

## Suggested APIs

### Primitive directives

- `[min]`, `[max]`, `[value]`, `[indeterminate]` on `[tngProgressBar]`
- `[tngProgressBarIndicator]` for visual fill element

### Wrapper component

- `<tng-progress-bar [min] [max] [value] [indeterminate] [ariaLabel]>`

## Test checklist

### Primitive tests

- [x] Exports public progress bar directives
- [x] Normalizes/clamps invalid ranges
- [x] Applies role and `aria-value*` in determinate mode
- [x] Removes `aria-value*` and sets `data-indeterminate` in indeterminate mode
- [x] Applies `data-slot` hooks on root and indicator

### Component tests

- [x] Exports public wrapper symbol
- [x] Calculates indicator percent correctly
- [x] Renders determinate semantics and width
- [x] Renders indeterminate width/state hooks
- [x] Recomputes clamped range output on runtime updates

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless (`__tests__`)
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-progress-bar>` component created in `components`
6. [x] Test cases created for `<tng-progress-bar>` (`__tests__`)
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add progress-bar`)
14. [x] `tailng-cli` command generation added for progress-bar artifacts
15. [x] CLI integration tests added for `tailng add progress-bar`

## Links

- Playground: `/progress-bar`
