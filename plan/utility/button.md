# Button

Headless button primitive for press/action semantics, accessibility, and interaction states.

## Overview

Button is a headless utility that provides button semantics (native button or role="button"), type (button, submit, reset), and interaction states. Styled variants (primary, secondary, outline, ghost, link) and sizes (sm, md, lg) are typically provided by the component layer. Built for accessibility: focus ring, disabled state, and optional loading state. Supports optional leading/trailing icons and slot content.

This component should expose type, disabled, loading (if any), and focus/state exposure while leaving visual variants and sizing to the consumer or styled component.

## Supported states

- Default / hover / active / focused / focus-visible
- Disabled
- Loading (optional; disables interaction and may show spinner)
- Type: button | submit | reset

## Common use cases

- Primary and secondary actions
- Form submit and reset
- Variants: primary, secondary, outline, ghost, link
- Sizes: sm, md, lg
- Optional icon (leading/trailing) and loading spinner
- Accessible focus ring and disabled state

## Headless component goals

- Provide native button semantics (type, disabled) or equivalent (role="button", tabindex, keyboard)
- Support type="button" | "submit" | "reset"
- Support disabled and optional loading state
- Expose state for styling (data-disabled, data-loading, data-focused, data-focus-visible)
- Support slot content and optional icon slots
- No variant/size in headless; those are component/styling concerns

## Required headless features

### Core behavior

- Button root (native `<button>` or element with role="button", type, disabled)
- Optional: loading state (disables click, may show loading indicator)
- Type: button (default), submit, reset
- Disabled: no click, aria-disabled and disabled attribute when native button

### Accessibility

- Native button: type, disabled, aria-disabled when disabled
- When not native: role="button", tabindex="0", aria-disabled, keyboard (Enter/Space)
- Focus visible: ensure focus ring or data-focus-visible for styling
- Accessible name: text content or aria-label
- Loading: aria-busy="true" and optional aria-live when state changes

### Interaction

- Click activates; Submit/Reset when type is submit/reset and inside form
- Disabled: no activation
- Loading: no activation (and optional spinner)
- Keyboard: Enter and Space activate when focusable

### Composition

- Button root (single directive or component)
- Optional: icon slots (leading/trailing) or content projection
- Composes with icon, badge, or custom content

### State exposure

- data-disabled, data-loading (if supported), data-focused, data-focus-visible
- data-slot="button" or equivalent
- Optional: data-variant, data-size (if exposed by component)

## Suggested primitives / parts

- `ButtonRoot` (e.g. tngButton directive on button, or TngButtonComponent)
- Optional: ButtonIcon (leading/trailing) as slots

## Suggested APIs

### Button root

- `type?: 'button' | 'submit' | 'reset'` (default: 'button')
- `disabled?: boolean`
- `loading?: boolean` (optional; disables and may show spinner)
- `ariaLabel?: string`, `ariaLabelledby?: string`, `ariaDescribedby?: string`
- Optional: variant, size (component layer; not strictly headless)
- Optional: form, formAction, formMethod (for submit)

### Angular API contract (required)

- tngButton directive or TngButtonComponent: inputs type, disabled, loading (if supported), ariaLabel; native button or role="button" with keyboard support
- Styled component may add variant (primary, secondary, outline, ghost, link) and size (sm, md, lg)
- Must support form submit/reset when type is submit/reset
- Focus ring or data-focus-visible for keyboard users

## Keyboard interaction

- Tab: focus button
- Enter: activate
- Space: activate
- Shift+Tab: move focus away
- When disabled or loading: no activation

## Accessibility notes

- Prefer native `<button>` for semantics and form integration
- Ensure focus indicator is visible (focus-visible)
- Loading state should be announced (aria-busy) and prevent double-submit
- Icon-only buttons must have aria-label or aria-labelledby

## Open design decisions

- Whether loading is in headless or component only
- Variant/size: headless exposes data-variant/data-size vs. component-only
- Link variant: anchor vs. button styled as link (accessibility differs)

## Test checklist

### Rendering

- [ ] Renders as button (native or role="button")
- [ ] Renders with type button/submit/reset
- [ ] Renders disabled state correctly
- [ ] Renders loading state when supported
- [ ] Applies data-disabled, data-loading, data-slot

### Accessibility

- [ ] Has accessible name (content or aria-label)
- [ ] type and disabled reflected on native button
- [ ] aria-disabled when disabled
- [ ] Focus visible when focused via keyboard
- [ ] Loading: aria-busy when applicable

### Keyboard interaction

- [ ] Tab focuses button
- [ ] Enter and Space activate
- [ ] Disabled and loading do not activate

### Pointer interaction

- [ ] Click activates
- [ ] Disabled and loading do not activate

### Data attributes

- [ ] Applies data-disabled, data-focused, data-focus-visible
- [ ] Applies data-loading when supported

## Implementation Steps

1. [ ] Headless component created in `primitives` (or button is component-only with directive)
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [ ] Minimum style `<tng-button>` component created in `components`
6. [ ] Test cases created for `<tng-button>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add button`)
14. [ ] `tailng-cli` command generation added for button artifacts
15. [ ] CLI integration tests added for `tailng add button`

## Links

- Docs route: `/components/utility/button`
- Playground: `/button` (if present)
