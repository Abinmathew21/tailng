# Skeleton

Headless skeleton primitive for decorative loading placeholders.

## Overview

Skeleton placeholders mimic final content layout while data is loading. They help reduce perceived
wait and avoid abrupt layout shifts. TailNG skeleton supports:

- Decorative loading blocks with no semantic content
- Animation and rounding state hooks
- Wrapper sizing inputs for fast composition (`width`, `height`)
- Stable slot/state attributes for custom themes

## Supported states

- `animated`: boolean (default `true`)
- `rounded`: boolean (default `true`)
- Wrapper inputs: `width` (default `100%`), `height` (default `1rem`)

## Common use cases

- Text paragraph loading placeholders
- Avatar + card skeletons
- Table row scaffolding
- Inline content loading surfaces

## Headless component goals

- Keep placeholders decorative by default (`aria-hidden`, presentation role)
- Expose simple state hooks for animation and shape
- Support any consumer-defined width/height/layout classes

## Required headless features

### Core behavior

- Root directive for skeleton placeholder blocks
- Animated and rounded state inputs

### Accessibility

- `aria-hidden="true"` on root
- `role="presentation"` on root

### State exposure

- `data-slot="skeleton"` on root
- `data-animated="true|false"` state hook
- `data-rounded="true|false"` state hook

## Suggested primitives / parts

- `TngSkeleton` via `[tngSkeleton]`

## Suggested APIs

### Primitive directive

- `[animated]`, `[rounded]` on `[tngSkeleton]`

### Wrapper component

- `<tng-skeleton [animated] [rounded] [width] [height]>`

## Test checklist

### Primitive tests

- [x] Exports public skeleton directive
- [x] Resolves `data-animated` and `data-rounded`
- [x] Applies decorative accessibility semantics (`aria-hidden`, `role`)
- [x] Applies `data-slot="skeleton"` root hook
- [x] Reflects animated/rounded state updates at runtime

### Component tests

- [x] Exports public wrapper symbol
- [x] Resolves CSS size fallback for width/height
- [x] Renders primitive semantics through wrapper root
- [x] Applies width/height styles on rendered skeleton element
- [x] Recomputes state/size output on runtime updates

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless (`__tests__`)
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-skeleton>` component created in `components`
6. [x] Test cases created for `<tng-skeleton>` (`__tests__`)
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add skeleton`)
14. [x] `tailng-cli` command generation added for skeleton artifacts
15. [x] CLI integration tests added for `tailng add skeleton`

## Links

- Playground: `/skeleton`
