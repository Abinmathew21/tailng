# Toast

Headless toast primitives and wrapper component for non-blocking notification feedback.

## Overview

Toast presents short-lived messages in a fixed viewport (for example, top-right or bottom-right).
It supports:

- Stack/queue display
- Optional title + message body
- Auto-dismiss timing with persistent mode (`duration: 0`)
- Keyboard dismissal (Escape)
- Tone-based accessibility semantics (`status` vs `alert`)

## Supported states

- `tone`: `'neutral' | 'success' | 'warning' | 'danger'`
- `open`: `boolean` (`tngToastItem`)
- Wrapper inputs:
  - `duration: number`
  - `maxVisible: number`
  - `mode: 'toast' | 'snackbar'`
  - `position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'`
- Wrapper output:
  - `dismissed: EventEmitter<string>`

## Headless goals

- Expose stable primitive hooks for viewport + item.
- Map tone to correct ARIA role and live politeness.
- Map open state to visibility hooks.
- Keep wrapper runtime deterministic for queue limits and auto-dismiss.

## Required features

### Primitive layer

- `TngToastViewport` directive (`[tngToastViewport]`)
- `TngToastItem` directive (`[tngToastItem]`)
- Slot/state hooks: `data-slot`, `data-tone`, `data-state`
- ARIA semantics:
  - `role=status` and `aria-live=polite` for neutral/success
  - `role=alert` and `aria-live=assertive` for warning/danger

### Component layer

- `<tng-toast>` wrapper with imperative API:
  - `show(message, options?)`
  - `dismiss(id)`
- Auto-dismiss timer handling
- Queue trimming by `maxVisible` (latest toasts kept)
- Escape-key dismissal on focused toast item

## Test checklist

### Primitive tests (`__tests__`)

- [x] Exports `TngToastViewport` and `TngToastItem`
- [x] Maps tone to ARIA role and live politeness
- [x] Maps open/closed state to data + hidden attributes
- [x] Applies viewport/item slot hooks
- [x] Reflects tone and open runtime changes

### Component tests (`__tests__`)

- [x] Exports wrapper symbol
- [x] Normalizes duration and maxVisible helpers
- [x] Keeps latest items when `maxVisible` is exceeded
- [x] Renders tone semantics on created toast items
- [x] Emits `dismissed` on manual dismissal
- [x] Auto-dismisses by timer
- [x] Keeps duration `0` toasts open
- [x] Dismisses on Escape and ignores other keys
- [x] Reflects `mode` and `position` attributes on viewport

## Implementation steps

1. [x] Headless primitives implemented in `@tailng-ui/primitives`
2. [x] Primitive tests implemented in `__tests__`
3. [x] Wrapper component implemented in `@tailng-ui/components`
4. [x] Component tests implemented in `__tests__`
5. [x] Playground demo exists in plain CSS app (`/toast`)
6. [x] Playground demo exists in Tailwind app (`/toast`)
7. [x] Docs routes and pages implemented:
   - overview
   - api
   - styling
   - examples
8. [x] Registry source templates available for `tailng add toast`
9. [x] CLI aliases supported (`snackbar`, `sonner` -> `toast`)

## Links

- Playground: `/toast`
