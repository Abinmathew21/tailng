# Progress Spinner

Headless circular progress primitive for determinate and indeterminate loading states.

## Overview

Progress Spinner communicates task state when using circular indicators (sync, checks, background
jobs). It supports:

- Determinate progress (`min`, `max`, `value`)
- Indeterminate loading state (`indeterminate`)
- Semantic `progressbar` accessibility attributes
- Stable root slot hook for custom styling

## Supported states

- `min`: number (default `0`)
- `max`: number (default `100`)
- `value`: number (default `0`)
- `indeterminate`: boolean (default `false`)
- Wrapper inputs: `ariaLabel`, `size`, `strokeWidth`

## Common use cases

- Data synchronization status
- Background indexing or checks
- Section-level loading placeholders
- Inline operation progress indicators

## Headless component goals

- Expose semantic range attributes for determinate state
- Remove range attributes for indeterminate state
- Clamp invalid ranges and values safely
- Provide stable root slot hook for theming (`data-slot="progress-spinner"`)

## Required headless features

### Core behavior

- Root directive for spinner semantics
- Range normalization (`min`, `max`, `value`)
- Indeterminate state hooks

### Accessibility

- `role="progressbar"` on root
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` in determinate mode
- Omit `aria-value*` attributes in indeterminate mode

### State exposure

- `data-slot="progress-spinner"` on root
- `data-indeterminate` on root during indeterminate state

## Suggested primitives / parts

- `TngProgressSpinner` via `[tngProgressSpinner]`

## Suggested APIs

### Primitive directive

- `[min]`, `[max]`, `[value]`, `[indeterminate]` on `[tngProgressSpinner]`

### Wrapper component

- `<tng-progress-spinner [min] [max] [value] [indeterminate] [ariaLabel] [size] [strokeWidth]>`

## Test checklist

### Primitive tests

- [x] Exports public progress spinner directive
- [x] Normalizes/clamps invalid ranges
- [x] Applies role and `aria-value*` in determinate mode
- [x] Removes `aria-value*` and sets `data-indeterminate` in indeterminate mode
- [x] Handles non-finite values safely

### Component tests

- [x] Exports public wrapper symbol
- [x] Calculates determinate percent and dash offset correctly
- [x] Renders determinate semantics and dash attributes
- [x] Renders indeterminate state hooks and removes dash offset
- [x] Recomputes clamped range output on runtime updates

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless (`__tests__`)
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-progress-spinner>` component created in `components`
6. [x] Test cases created for `<tng-progress-spinner>` (`__tests__`)
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add progress-spinner`)
14. [x] `tailng-cli` command generation added for progress-spinner artifacts
15. [x] CLI integration tests added for `tailng add progress-spinner`

## Links

- Playground: `/progress-spinner`
