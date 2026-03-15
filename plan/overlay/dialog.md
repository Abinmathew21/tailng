# Dialog

Headless dialog primitive for a modal overlay with backdrop and focus trap.

## Overview

Dialog is a headless overlay component for modal dialogs: a panel with an optional backdrop that dims the background. Focus is trapped inside the dialog while open; Escape (and optionally backdrop click) closes it when dismissible. Used for confirmations, forms, or critical content that requires user response. Optional parts include title, description, and action buttons (e.g. Cancel/Confirm).

This component should expose open state, focus trap, restore focus on close, and accessibility (role="dialog", aria-modal, aria-labelledby, aria-describedby) while leaving layout and styling to the consumer.

## Supported states

- `open` / closed
- `disabled` (cannot open)
- Focus: trapped inside when open; restore focus to trigger on close
- Optional: size (sm, md, lg) or custom
- Backdrop visible; optional scroll lock on body

## Common use cases

- Confirmation dialogs (e.g. delete, discard)
- Forms that require completion or cancellation
- Critical notices or alerts
- Optional title, description, and actions (Cancel/Confirm)
- Backdrop dims background; focus stays in dialog; Escape closes when dismissible

## Headless component goals

- Provide accessible dialog semantics (role="dialog", aria-modal="true", aria-labelledby, aria-describedby)
- Support controlled and uncontrolled open state
- Focus trap: focus moves into dialog when opened; Tab cycles within; no focus outside
- Restore focus to trigger (or designated element) on close
- Escape closes when dismissible; optional backdrop click to close
- Optional scroll lock when open
- Support title and description for accessible name and description

## Required headless features

### Core behavior

- Dialog root/container (panel that holds content)
- Optional: DialogTrigger (opens dialog)
- Open/close via input or imperative API
- Controlled: `open` + `openChange`; uncontrolled: `defaultOpen`
- Close on Escape when dismissible; optional close on backdrop click
- Optional: close button (emits close with reason)
- Optional: size or class for styling

### Accessibility

- Panel: role="dialog", aria-modal="true", aria-labelledby (title id), aria-describedby (description id, optional)
- Focus trap: on open, focus first focusable or element with data-tng-dialog-initial-focus
- Tab and Shift+Tab cycle within dialog only
- Escape closes and restores focus when dismissible
- Optional: aria-label if no visible title
- Restore focus to element that had focus before open (or trigger)

### Interaction

- Open/close via binding or programmatic API
- Backdrop click closes when configured (dismissible)
- Escape key closes when configured
- Focus never leaves dialog while open (trap)
- Close button (if present) closes with reason (e.g. close-button)

### Composition

- Dialog root (overlay panel)
- Dialog trigger (optional; button or element that opens)
- Dialog title (for aria-labelledby)
- Dialog description (optional; for aria-describedby)
- Dialog content (body)
- Dialog actions (footer with buttons)
- Dialog close button (optional)
- Backdrop (optional element or slot)

### State exposure

- data-open, data-size (if applicable) on root
- data-disabled when disabled
- data-slot for each part

## Suggested primitives / parts

- `DialogRoot` / `Dialog` (panel container)
- `DialogTrigger` (optional)
- `DialogTitle`
- `DialogDescription`
- `DialogContent`
- `DialogActions`
- `DialogClose` (optional button)
- Backdrop (slot or directive)

## Suggested APIs

### Dialog root

- `open?: boolean`, `defaultOpen?: boolean`
- `openChange?: (open: boolean) => void` or `closed?: (reason: TngDialogCloseReason) => void`
- `disabled?: boolean`
- `dismissible?: boolean` (Escape and/or backdrop close)
- `closeOnBackdropClick?: boolean`
- `closeOnEscape?: boolean`
- `restoreFocus?: boolean`
- `autoFocus?: 'first-focusable' | 'dialog' | element selector | 'none'`
- `trapFocus?: boolean`
- `ariaLabel?: string` (if no title)
- `ariaLabelledby?: string`, `ariaDescribedby?: string`
- `size?: 'sm' | 'md' | 'lg'` (styling hint)
- Optional: scroll lock when open

### Dialog trigger

- Opens dialog on click; optional aria-haspopup="dialog"

### Dialog title

- Renders heading; id for aria-labelledby
- Optional: level (h2) for heading hierarchy

### Dialog description

- Optional; id for aria-describedby

### Angular API contract (required)

- tng-dialog (or dialog root): inputs open, defaultOpen, disabled, dismissible, closeOnBackdropClick, closeOnEscape, restoreFocus, autoFocus, trapFocus, ariaLabel, ariaLabelledby, ariaDescribedby, size; output openChange and/or closed with reason
- Title and description expose ids for root’s aria-labelledby / aria-describedby
- Focus trap and restore focus must work with Angular zone and change detection

## Keyboard interaction

- Tab / Shift+Tab: cycle focus within dialog only
- Escape: close dialog and restore focus when dismissible
- No focus on dialog when closed; trigger is focusable to open

## Accessibility notes

- role="dialog" and aria-modal="true" are required for modal dialogs
- aria-labelledby (title) is required; aria-describedby (description) recommended when present
- Focus trap must include all focusable elements; ensure visible focus indicator
- Announcing open/close (e.g. focus move or live region) improves UX

## Open design decisions

- Whether dialog is always modal (aria-modal=true) or supports non-modal mode
- Exact close reasons (backdrop, close-button, escape, programmatic)
- Whether trigger is part of primitive or consumer-provided
- Portal: dialog rendered in body or in designated host

## Test checklist

### Rendering

- [x] Renders dialog panel when open
- [x] Renders backdrop when open
- [x] Renders title and description when provided
- [x] Renders content and actions
- [x] Applies data-open, data-size (if used), data-slot

### Accessibility

- [x] Panel has role="dialog" and aria-modal="true"
- [x] Panel has aria-labelledby (title id) and optional aria-describedby
- [x] Focus moves into dialog on open (first focusable or initial-focus element)
- [x] Tab stays within dialog when open
- [x] Escape closes and restores focus when dismissible
- [x] Focus restored to trigger (or previous focus) on close

### Keyboard and pointer

- [x] Escape closes when closeOnEscape
- [x] Backdrop click closes when closeOnBackdropClick
- [x] Disabled prevents open
- [x] Close button closes with correct reason

### Controlled / uncontrolled

- [x] Supports controlled open state
- [x] Emits openChange / closed with reason
- [x] Supports defaultOpen and updates on close

### Data attributes

- [x] Applies data-open, data-disabled, data-slot on parts

## Implementation Steps

1. [x] Headless component created in `primitives` (or dialog implemented as component with clear API)
2. [x] Test cases created for headless
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-dialog>` component created in `components`
6. [x] Test cases created for `<tng-dialog>`
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add dialog`)
14. [x] `tailng-cli` command generation added for dialog artifacts
15. [x] CLI integration tests added for `tailng add dialog`

## Links

- Playground: `/dialog`
