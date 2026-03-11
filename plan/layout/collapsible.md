# Collapsible

Headless collapsible primitive for a single disclosure panel (one trigger, one content panel).

## Overview

Collapsible is a headless disclosure component: one trigger toggles the visibility of one content panel. It is lighter than an accordion when only a single expand/collapse section is needed. It supports controlled and uncontrolled open state, disabled state, and accessible expanded/collapsed semantics.

This component should expose behavior, accessibility, and state for styling; animation and visual design are left to the consumer.

## Supported states

- `open` / expanded
- `closed` / collapsed
- `disabled` (trigger disabled, panel state unchanged)
- Trigger: `focused`, `focus-visible`

## Common use cases

- FAQ single item
- “Show more” / “Show less” for a block of content
- Single disclosure in a form or sidebar
- Lighter alternative to accordion when only one panel is needed
- Composes with styling for borders, padding, animation

## Headless component goals

- Provide accessible disclosure semantics (aria-expanded, aria-controls)
- Support controlled and uncontrolled open state
- Support disabled trigger
- Support keyboard (Enter/Space) and pointer interaction
- Expose state for custom rendering and animation

## Required headless features

### Core behavior

- Single trigger toggles single content panel
- Controlled: `open` + `openChange` (or equivalent)
- Uncontrolled: `defaultOpen`
- `disabled` on trigger prevents toggling
- Content visibility tied to open state (e.g. hidden when closed)

### Accessibility

- Trigger: `aria-expanded="true" | "false"`, `aria-controls` pointing to content id
- Trigger is a button (type=button)
- Content region has matching `id` for aria-controls
- Optional: `aria-disabled` on trigger when disabled

### Interaction

- Click on trigger toggles open state
- Enter or Space on trigger toggles open state
- Disabled trigger does not toggle
- Focus management: trigger is focusable

### Composition

- Collapsible root (holds state)
- Collapsible trigger (button)
- Collapsible content (panel with id for aria-controls)

### State exposure

- `data-state="open" | "closed"` on root and trigger
- `data-disabled` when disabled
- `data-focused` / `data-focus-visible` on trigger when applicable

## Suggested primitives / parts

- `CollapsibleRoot` (e.g. `tngCollapsible`)
- `CollapsibleTrigger` (button)
- `CollapsibleContent` (panel)

## Suggested APIs

### Collapsible root

- `open?: boolean`
- `defaultOpen?: boolean`
- `openChange?: (open: boolean) => void`
- `disabled?: boolean`

### Collapsible trigger

- `contentId?: string` (for aria-controls; may be auto-generated)
- `disabled?: boolean` (or inherited from root)
- `open` / open state (from root or inputs)

### Collapsible content

- `open` (from root); used for visibility and data-state

### Angular API contract (required)

- `tngCollapsible` should expose: inputs `open`, `defaultOpen`, `disabled`; output `openChange`
- Trigger and content directives receive state from root (inject root or use shared context)
- Trigger must be native button or have button semantics

## State model

- `open === false` → collapsed, `aria-expanded="false"`, `data-state="closed"`
- `open === true` → expanded, `aria-expanded="true"`, `data-state="open"`

## Keyboard interaction

- Tab: focus trigger
- Enter / Space: toggle open state (when not disabled)
- Shift+Tab: move focus away

## Accessibility notes

- Always set `aria-expanded` on the trigger and `aria-controls` to the content id
- Content id must be stable and unique for the page
- Ensure focus is visible on the trigger

## Open design decisions

- Whether content is removed from DOM when closed or only hidden (affects animation and accessibility)
- Whether `openChange` is emitted on both open and close or only when consumer needs to sync

## Test checklist

### Rendering

- [ ] Renders closed by default when `defaultOpen` is false
- [ ] Renders open when `open=true` or `defaultOpen=true`
- [ ] Renders trigger as button with correct type
- [ ] Renders content with id for aria-controls
- [ ] Renders disabled state correctly on trigger

### Accessibility

- [ ] Trigger has `aria-expanded` matching open state
- [ ] Trigger has `aria-controls` pointing to content id
- [ ] Trigger has `aria-disabled` or disabled attribute when disabled
- [ ] Content is hidden or removed when closed (no duplicate focus targets)

### Keyboard interaction

- [ ] Enter toggles open/closed
- [ ] Space toggles open/closed
- [ ] Does not toggle when disabled

### Pointer interaction

- [ ] Click on trigger toggles state
- [ ] Does not toggle when disabled

### Controlled behavior

- [ ] Supports controlled open state
- [ ] Emits openChange when toggled
- [ ] Does not change visual state without controlled prop update

### Uncontrolled behavior

- [ ] Supports defaultOpen and updates internal state on user interaction

### Data attributes

- [ ] Applies `data-state="open" | "closed"` on root and trigger
- [ ] Applies `data-disabled` when disabled

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [ ] Test cases created for headless (controlled, uncontrolled, keyboard, a11y)
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-collapsible>` component created in `components`
6. [ ] Test cases created for `<tng-collapsible>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add collapsible`)
14. [ ] `tailng-cli` command generation added for collapsible artifacts
15. [ ] CLI integration tests added for `tailng add collapsible`

## Links

- Playground: `/collapsible`
