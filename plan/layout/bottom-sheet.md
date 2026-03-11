# Bottom Sheet

Headless bottom sheet primitive for a partial-height overlay panel that slides up from the bottom.

## Overview

Bottom sheet is a headless overlay component: a panel that slides up from the bottom of the viewport (often used on mobile for actions, details, or forms). It can be full height, half height, or auto (content-based). It is typically dismissible by drag gesture, tap outside, or Escape. Focus trap when open and optional backdrop are expected.

This component should expose open state, height/size options, focus management, and accessibility (aria-modal, focus trap, restore focus) while leaving animation and layout to the consumer.

## Supported states

- `open` / closed
- `disabled` (cannot open)
- Height/size: full | half | auto | custom
- Focus: trapped inside when open; restore focus on close
- Backdrop visible/hidden
- Optional: drag state (dragging to dismiss)

## Common use cases

- Mobile action sheets (share, options)
- Detail or form panels on mobile
- Bottom-anchored filters or cart
- Full, half, or auto height; dismissible by drag or tap outside
- Composes with list, buttons, or form

## Headless component goals

- Provide accessible overlay semantics (aria-modal, role="dialog" or similar, aria-label)
- Support controlled and uncontrolled open state
- Support height/size (full, half, auto, or custom value)
- Focus trap when open; Escape and optional outside click to close
- Restore focus to trigger on close
- Optional backdrop and scroll lock
- Optional drag-to-dismiss gesture (implementation-specific)

## Required headless features

### Core behavior

- Bottom sheet panel: open/closed, height/size
- Controlled: `opened` + output; uncontrolled: `defaultOpened`
- Close on Escape; optional close on outside click (backdrop or pointer outside)
- Optional backdrop; optional scroll lock when open
- Optional drag-to-dismiss (touch/mouse drag to close)

### Accessibility

- When open: role (e.g. "dialog"), aria-modal, aria-label
- Focus trap: focus moves into sheet when opened; Tab cycles within
- Escape closes and returns focus to trigger (restoreFocus)
- Optional: announce open/close to screen readers

### Interaction

- Open/close via input or imperative API
- Click/tap outside (backdrop) closes when configured
- Escape key closes when configured
- Optional: drag down to close (gesture)

### Composition

- BottomSheet (panel; may include backdrop or receive it from overlay service)
- Optional container or overlay host for stacking

### State exposure

- data-open, data-size (full/half/auto) or data-height
- data-disabled when disabled
- Optional data-dragging when drag gesture in progress

## Suggested primitives / parts

- `BottomSheetRoot` (panel)
- Optional: BottomSheetBackdrop, BottomSheetHandle (for drag affordance)

## Suggested APIs

### Bottom sheet

- `opened?: boolean`, `defaultOpened?: boolean`
- `openedChange?: (opened: boolean) => void`
- `size?: 'full' | 'half' | 'auto'` or `height?: string` (e.g. 50vh)
- `disabled?: boolean`
- `backdrop?: boolean`
- `closeOnOutsideClick?: boolean`
- `closeOnEscape?: boolean`
- `restoreFocus?: boolean`
- `autoFocus?: 'sheet' | 'first-focusable' | 'none'`
- `trapFocus?: boolean`
- `ariaLabel?: string`
- `dismissible?: boolean` (allow drag to dismiss)
- Optional: dragHandle (element that receives drag for dismiss)

### Angular API contract (required)

- tngBottomSheet: inputs opened, defaultOpened, size/height, disabled, backdrop, closeOnOutsideClick, closeOnEscape, restoreFocus, autoFocus, trapFocus, ariaLabel, dismissible; output openedChange
- Panel must integrate with focus trap and overlay stacking when used in overlay system

## Keyboard interaction

- Tab: cycles focus within sheet when trap is active
- Escape: closes sheet and restores focus when closeOnEscape is true
- No focus on sheet when closed

## Accessibility notes

- Use aria-modal when sheet is dialog-like
- Focus trap must include all focusable elements; ensure visible focus indicator
- Optional: live region or focus move to announce open/close
- If drag-to-dismiss is used, ensure keyboard users can close (Escape or button)

## Open design decisions

- Whether bottom sheet is standalone or part of overlay/dialog system
- Exact size set: full/half/auto vs. arbitrary height
- Drag-to-dismiss API (threshold, direction, handle element)
- Whether sheet can be used without a container (e.g. body portal)

## Test checklist

### Rendering

- [ ] Renders bottom sheet panel with correct size/height
- [ ] Renders open/closed state correctly
- [ ] Renders backdrop when configured
- [ ] Applies data-open, data-size or data-height
- [ ] Renders at bottom of viewport (or designated host)

### Accessibility

- [ ] Sheet has role and aria-label when open
- [ ] Focus moves into sheet when opened (trap)
- [ ] Tab stays within sheet when open
- [ ] Escape closes and restores focus when configured

### Keyboard and pointer

- [ ] Escape closes sheet
- [ ] Click/tap outside closes when configured
- [ ] Disabled sheet does not open
- [ ] Optional drag-to-dismiss works and is discoverable

### Controlled / uncontrolled

- [ ] Supports controlled opened state
- [ ] Emits openedChange
- [ ] Supports defaultOpened and updates on close/open

### Data attributes

- [ ] Applies data-open, data-size/data-height, data-disabled

## Implementation Steps

1. [ ] Headless component created in `primitives` (minimal root exists; full behavior TBD)
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [ ] Minimum style `<tng-bottom-sheet>` component created in `components`
6. [ ] Test cases created for `<tng-bottom-sheet>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add bottom-sheet`)
14. [ ] `tailng-cli` command generation added for bottom-sheet artifacts
15. [ ] CLI integration tests added for `tailng add bottom-sheet`

## Links

- Playground: `/bottom-sheet`
