# Drawer

Headless drawer primitive for a slide-in overlay panel from the start or end side.

## Overview

Drawer is a headless overlay component: a panel that slides in from a side (start or end, typically left or right). It can operate in overlay mode (over content) or push/side mode (shifts content). Backdrop, focus trap, and close-on-outside-click or Escape are typical. It is used for navigation, detail views, or secondary content.

This component should expose open state, position, mode, focus management, and accessibility (aria-modal, focus trap, restore focus) while leaving animation and layout to the consumer.

## Supported states

- `open` / closed
- `disabled` (cannot open)
- Position: start | end (resolved to left/right by dir)
- Mode: overlay | push | side
- Focus: trapped inside when open; restore focus on close
- Backdrop visible/hidden

## Common use cases

- Side navigation panel
- Detail or settings panel
- Cart or filters panel
- Overlay or push layout; optional backdrop and close on outside click
- Composes with list, form, or custom content

## Headless component goals

- Provide accessible overlay semantics (aria-modal or role="dialog"/"navigation", etc.)
- Support controlled and uncontrolled open state
- Support position (start/end) and mode (overlay/push/side)
- Focus trap when open; Escape to close; optional close on outside click
- Restore focus to trigger on close
- Optional backdrop and scroll lock
- Support RTL (dir) for start/end resolution

## Required headless features

### Core behavior

- Drawer container (optional): coordinates multiple drawers, content offset for push mode, scroll lock, inert main content
- Drawer panel: open/closed, position, mode
- Controlled: `opened` + output; uncontrolled: `defaultOpened`
- Close on Escape; optional close on outside click (backdrop or pointer outside)
- Optional backdrop element; optional scroll lock when open

### Accessibility

- When open: role (e.g. "dialog", "navigation", "complementary", "region"), aria-modal where appropriate, aria-label
- Focus trap: focus moves into drawer when opened; Tab cycles within drawer; optional autoFocus (drawer element vs. first focusable)
- Escape closes drawer and returns focus to trigger (restoreFocus)
- Main content may be marked inert when overlay is open

### Interaction

- Open/close via input or imperative API
- Click outside (backdrop) closes when configured
- Escape key closes when configured
- Optional swipe gesture to close (implementation-specific)

### Composition

- DrawerContainer (optional): wraps drawer(s) and main content
- Drawer (panel)
- DrawerContent (main content area for offset/inert)
- Backdrop (optional, may be part of drawer or container)

### State exposure

- data-open, data-position, data-mode on drawer
- data-disabled when disabled
- data-direction (ltr/rtl) on container

## Suggested primitives / parts

- `DrawerContainer` (optional)
- `Drawer` (panel)
- `DrawerContent` (main content)
- Backdrop (slot or directive)

## Suggested APIs

### Drawer container

- `hasBackdrop?: 'auto' | boolean`
- `closeOthersOnOpen?: boolean`
- `animate?: boolean`
- `lockScroll?: 'auto' | boolean`
- `dir?: 'ltr' | 'rtl' | 'auto'`
- Registers drawers and content for layout and scroll lock

### Drawer

- `opened?: boolean`, `defaultOpened?: boolean`
- `openedChange?: (opened: boolean) => void` (or tngDrawerOpened / tngDrawerClosed outputs)
- `mode?: 'overlay' | 'push' | 'side'`
- `position?: 'start' | 'end'`
- `disabled?: boolean`
- `backdrop?: 'auto' | boolean`
- `closeOnOutsideClick?: boolean`
- `closeOnEscape?: boolean`
- `restoreFocus?: boolean`
- `autoFocus?: 'drawer' | 'first-focusable' | 'none'`
- `trapFocus?: 'auto' | boolean`
- `ariaLabel?: string`, `role?: 'navigation' | 'dialog' | 'complementary' | 'region'`

### Drawer content

- Receives offset (margin or transform) from container when drawer is push/side and open
- May be set inert when overlay is open

### Angular API contract (required)

- Container: inputs hasBackdrop, closeOthersOnOpen, animate, lockScroll, dir
- Drawer: inputs opened, defaultOpened, mode, position, disabled, backdrop, closeOnOutsideClick, closeOnEscape, restoreFocus, autoFocus, trapFocus; outputs openedChange (or tngDrawerOpened, tngDrawerClosed)
- Drawer content: used with container for offset and inert

## Keyboard interaction

- Tab: cycles focus within drawer when trap is active
- Escape: closes drawer and restores focus when closeOnEscape is true
- No focus on drawer when closed

## Accessibility notes

- Use aria-modal when drawer is dialog-like; use role="navigation" or "complementary" when appropriate
- Focus trap must include all focusable elements inside drawer; ensure visible focus indicator
- Announce open/close to screen readers (e.g. live region or focus move)

## Open design decisions

- Whether container is required or drawer can be used standalone (overlay only)
- Exact role and aria-modal usage per drawer type
- Swipe gesture API (optional)

## Test checklist

### Rendering

- [ ] Renders drawer panel with correct position and mode
- [ ] Renders open/closed state correctly
- [ ] Renders with container and content for push/side offset
- [ ] Renders backdrop when configured
- [ ] Applies data-open, data-position, data-mode

### Accessibility

- [ ] Drawer has role and aria-label when open
- [ ] Focus moves into drawer when opened (trap)
- [ ] Tab stays within drawer when open
- [ ] Escape closes and restores focus when configured
- [ ] Main content inert when overlay open (if designed)

### Keyboard and pointer

- [ ] Escape closes drawer
- [ ] Click outside (backdrop) closes when configured
- [ ] Disabled drawer does not open

### Controlled / uncontrolled

- [ ] Supports controlled opened state
- [ ] Emits openedChange / tngDrawerOpened / tngDrawerClosed
- [ ] Supports defaultOpened and updates on close/open

### Data attributes

- [ ] Applies data-open, data-position, data-mode, data-disabled

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless (behavior spec)
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-drawer>` component created in `components`
6. [ ] Test cases created for `<tng-drawer>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add drawer`)
14. [ ] `tailng-cli` command generation added for drawer artifacts
15. [ ] CLI integration tests added for `tailng add drawer`

## Links

- Playground: `/drawer`
