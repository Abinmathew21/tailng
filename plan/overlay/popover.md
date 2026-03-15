# Popover

Headless popover primitive for a floating panel anchored to a trigger.

## Overview

Popover is a headless overlay that shows a floating panel anchored to a trigger element (e.g. button or input). It is used for pickers, custom dropdowns, or extra content without full modal behavior. Position is relative to the trigger; optional arrow. Click outside or Escape closes it. Unlike dialog, focus trap is not mandatory—popover can contain form controls or lists and focus may move outside. It composes with menu, listbox, or custom content.

This component should expose open state, trigger/panel association, positioning, and dismissal (outside click, Escape) while leaving layout and styling to the consumer.

## Supported states

- `open` / closed
- `disabled` (popover does not open)
- Position/side: top | bottom | left | right (or auto)
- Optional: focus management (move focus into panel on open; optional trap)
- Optional: arrow/caret for visual anchor

## Common use cases

- Date/time picker container
- Custom dropdown (e.g. color picker, custom select)
- Extra content or actions (e.g. “More options” panel)
- Composes with menu, listbox, or form controls
- Position relative to trigger; optional arrow; click outside or Escape to close

## Headless component goals

- Provide accessible popover semantics (role, aria-expanded on trigger, aria-controls, optional aria-label)
- Support controlled and uncontrolled open state
- Support positioning relative to trigger (side, alignment, collision)
- Close on click outside (optional) and Escape
- Optional: move focus into panel on open; optional focus trap
- Expose state for custom rendering and positioning
- No mandatory focus trap so popover can contain interactive content without forcing trap

## Required headless features

### Core behavior

- Popover trigger (element that toggles open)
- Popover panel (floating content)
- Open/close on trigger click (toggle); optional open on hover
- Controlled: `open` + `openChange`; uncontrolled: internal state
- Close on Escape; optional close on click outside (pointer down outside)
- Optional: close when focus leaves (e.g. to another tab)
- `disabled`: popover does not open
- Positioning: anchor to trigger; side/alignment; optional collision detection (if in scope)

### Accessibility

- Trigger: aria-expanded when open, aria-controls (panel id), aria-haspopup="true" (or "dialog" for modal-like)
- Panel: id for aria-controls; optional role (e.g. "dialog" if modal-like, or generic region)
- Optional: move focus into panel on open (first focusable)
- Optional: trap focus (then popover behaves more like dialog)
- Escape closes and may return focus to trigger

### Interaction

- Click trigger: toggle open/closed
- Click outside (backdrop or document): close when configured
- Escape: close and optionally restore focus to trigger
- Disabled: trigger does not open popover
- Optional: open on hover, close on hover leave (tooltip-like)

### Composition

- Popover root (optional wrapper)
- Popover trigger (button or element)
- Popover panel (content; may be portaled)
- Optional: PopoverArrow (visual anchor)
- Composes with menu, listbox, form controls, or custom content

### State exposure

- data-open, data-side (or data-placements) on panel/root
- data-disabled on trigger
- data-slot for trigger and panel

## Suggested primitives / parts

- `PopoverRoot` (optional; holds state)
- `PopoverTrigger`
- `PopoverPanel` / `PopoverContent`
- `PopoverArrow` (optional)

## Suggested APIs

### Popover root (if present)

- `open?: boolean`, `defaultOpen?: boolean`
- `openChange?: (open: boolean) => void`
- `disabled?: boolean`
- Registers trigger and panel for positioning and close-on-outside

### Popover trigger

- Opens/closes on click (toggle)
- `aria-expanded`, `aria-controls`, `aria-haspopup`
- `disabled`: does not open

### Popover panel

- `id` for aria-controls
- `side?: 'top' | 'bottom' | 'left' | 'right'` or auto
- `align?: 'start' | 'center' | 'end'`
- Optional: collision detection, offset
- Rendered in portal or next to trigger (positioning layer responsibility may be CDK)

### Angular API contract (required)

- Popover root or single component: inputs open, defaultOpen, disabled; output openChange (or closed with reason)
- Trigger: opens on click; exposes aria-expanded, aria-controls
- Panel: id, positioning inputs; optional autoFocus (first focusable)
- Close reasons: outside-pointer, escape, programmatic (optional type TngPopoverCloseReason)
- Integrate with overlay/runtime for stacking and escape handling if using CDK overlay

## Keyboard interaction

- Trigger: Enter/Space toggles (when trigger is button)
- When open: Escape closes and optionally restores focus to trigger
- Optional: focus moves into panel on open; Tab may leave panel (no trap) or stay (trap)
- No trap by default so user can Tab to next field or element outside

## Accessibility notes

- aria-expanded and aria-controls link trigger and panel for screen readers
- If panel contains focusable elements, ensure focus management is predictable (e.g. move focus in on open, restore on close)
- If focus trap is used, follow dialog-like patterns; if not, ensure Escape and outside click close and focus is not lost

## Open design decisions

- Whether popover has optional focus trap (modal-like) vs. always no trap
- Positioning: in headless (position state) vs. fully in overlay/positioning service
- Close when focus leaves (e.g. Tab out) vs. only Escape and outside click
- Role of panel: none, "dialog", or "menu" depending on content

## Test checklist

### Rendering

- [x] Renders trigger and panel
- [x] Panel has id for aria-controls
- [x] Panel is hidden when closed (or unmounted)
- [x] Panel is visible when open
- [x] Applies data-open, data-side (if used), data-slot

### Accessibility

- [x] Trigger has aria-expanded matching open state
- [x] Trigger has aria-controls pointing to panel id
- [x] Trigger has aria-haspopup when appropriate
- [x] Escape closes and optionally restores focus to trigger
- [x] Optional: focus moves into panel on open

### Pointer and keyboard

- [x] Click trigger toggles open/closed
- [x] Click outside closes when configured
- [x] Escape closes
- [x] Disabled trigger does not open

### Controlled / uncontrolled

- [x] Supports controlled open state
- [x] Emits openChange / closed with reason
- [x] Supports defaultOpen and updates on toggle/close

### Data attributes

- [x] Applies data-open, data-disabled, data-slot on trigger and panel

## Implementation Steps

1. [x] Headless component created in `primitives` (or popover implemented as component with clear API)
2. [x] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-popover>` component created in `components`
6. [x] Test cases created for `<tng-popover>`
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add popover`)
14. [ ] `tailng-cli` command generation added for popover artifacts
15. [ ] CLI integration tests added for `tailng add popover`

## Links

- Playground: `/popover`
