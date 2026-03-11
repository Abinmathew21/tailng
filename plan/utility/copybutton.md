# CopyButton

Headless copy button primitive for clipboard copy with success/error feedback.

## Overview

CopyButton is a headless utility that copies a configurable string (or content from a target element) to the clipboard and provides success or error feedback. Feedback can be label change, live region announcement, or integration with toast. Optional success duration before resetting state; optional hotkey. Often used in code blocks or share flows.

This component should expose copy action, payload (text or target), success/error state, and announcement behavior while leaving button styling to the consumer.

## Supported states

- Idle / copying / success / error
- Disabled
- Optional: success duration countdown before reset to idle
- Focused, focus-visible (on trigger)

## Common use cases

- Copy code in code block header
- Copy link or share payload
- Success/error feedback (label change or toast)
- Optional hotkey (e.g. Ctrl+C when focused)
- Often used with code blocks or share flows

## Headless component goals

- Provide copy-to-clipboard behavior (navigator.clipboard or fallback)
- Support configurable payload: explicit string or target element (e.g. code block)
- Support success and error feedback (events and optional announce to screen readers)
- Optional success duration before resetting to idle
- Optional hotkey to trigger copy
- Disabled state
- Expose state for custom label/icon (idle vs. success vs. error)

## Required headless features

### Core behavior

- Trigger (button or element with copy behavior)
- Payload: explicit text (tngCopyButtonText) or target element (tngCopyButtonTarget) to copy from
- On activate: copy payload to clipboard; on success: optional announce, set success state, reset after duration; on error: optional announce, set error state
- Optional: copy format (plain vs. html) when applicable
- Disabled: no copy
- Optional: success duration (ms) before reset

### Accessibility

- Trigger: accessible name (e.g. "Copy code"); update to "Copied" or similar on success when label changes
- Announce success/error to screen readers (live region or aria-live) when configured
- Optional: success and error message strings configurable for i18n and a11y
- Focus visible on trigger

### Interaction

- Click (and optional hotkey) triggers copy
- Disabled prevents copy
- After success, optional auto-reset after duration; optional manual reset on blur

### Composition

- CopyButton trigger (directive on button or element)
- Composes with code block header, share UI, or any content that provides copy payload
- Optional: target reference (element to copy from) when not using explicit text

### State exposure

- data-state or data-copy-state: idle | copying | success | error
- data-disabled when disabled
- Optional: data-success-duration for styling countdown (if exposed)

## Suggested primitives / parts

- `CopyButton` / `CopyTrigger` (e.g. tngCopyButton or tngCopy on button)
- Optional: CopySuccessMessage, CopyErrorMessage (for live region content)

## Suggested APIs

### CopyButton trigger

- `tngCopyButtonText?: string` (explicit payload) or `tngCopyButtonTarget?: ElementRef | HTMLElement` (copy from element)
- `tngCopyButtonFormat?: 'text/plain' | 'text/html'` (when applicable)
- `tngCopyButtonSuccessDurationMs?: number`
- `tngCopyButtonDisabled?: boolean`
- `tngCopyButtonHotkey?: string | null` (e.g. 'mod+c')
- `tngCopyButtonAnnounce?: boolean | 'polite' | 'assertive'` (announce to screen readers)
- `tngCopyButtonSuccessMessage?: string`
- `tngCopyButtonErrorMessage?: string`
- Outputs: optional `copied` (success), `copyError` (error)
- State: idle | success | error (and reset after duration)

### Angular API contract (required)

- tngCopyButton (or tngCopy): inputs for text, target, format, successDurationMs, disabled, hotkey, announce, successMessage, errorMessage; optional outputs copied, copyError
- Trigger must be button or have button semantics and be focusable
- Clipboard API: prefer navigator.clipboard.writeText; fallback for older browsers if needed

## Keyboard interaction

- Tab: focus trigger
- Enter/Space: trigger copy (when not disabled)
- Optional: hotkey (e.g. mod+c) triggers copy when focus is on trigger or when focus is in target (e.g. code block)
- Shift+Tab: move focus away

## Accessibility notes

- Button must have clear label ("Copy" / "Copy code"); on success, consider "Copied" and optional live region so screen readers hear result
- Announce success and error via aria-live or live region when announce is enabled
- Ensure success/error messages are visible or announced; avoid success state that only changes icon with no text

## Open design decisions

- Whether to support copy from selection (e.g. selected text in page) as payload
- Hotkey scope: only when trigger focused vs. when focus inside a related container
- Fallback when clipboard API unavailable (e.g. execCommand('copy'))

## Test checklist

### Rendering

- [ ] Renders trigger (button or element)
- [ ] Shows idle state by default
- [ ] Shows success state after successful copy (and resets after duration when configured)
- [ ] Shows error state on clipboard failure
- [ ] Disabled state prevents copy
- [ ] Applies data-state (idle/success/error), data-disabled

### Accessibility

- [ ] Trigger has accessible name
- [ ] Success/error announced when announce is enabled
- [ ] Focus visible on trigger

### Interaction

- [ ] Click triggers copy with correct payload (text or target content)
- [ ] Hotkey triggers copy when configured
- [ ] Disabled does not copy
- [ ] Success resets after successDurationMs when set

### Payload

- [ ] Copies explicit text when tngCopyButtonText provided
- [ ] Copies target element content when tngCopyButtonTarget provided
- [ ] Handles missing payload (error or no-op as designed)

### Data attributes

- [ ] Applies data-state, data-disabled

## Implementation Steps

1. [x] Headless component created in `primitives` (tngCopy / tngCopyButton in copy primitive)
2. [x] Test cases created for headless (behavior spec)
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [ ] Minimum style `<tng-copy-button>` component created in `components` (or use directive only)
6. [ ] Test cases created for copy button component/directive
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add copybutton`)
14. [ ] `tailng-cli` command generation added for copybutton artifacts
15. [ ] CLI integration tests added for `tailng add copybutton`

## Links

- Docs route: `/components/utility/copybutton`
- Playground: `/copybutton` (if present)
