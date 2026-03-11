# Tag

Headless tag primitive for compact status/count labels (chips).

## Overview

Tag is a headless utility that displays a small label or badge for status (e.g. "New", "Draft"), category, or count. Often used in lists, filters, or as chips. Optional icon and removable (close) button. Variants for status (success, warning, error, etc.) or neutral. Composes with list, filter bar, or input (chip list).

This component should expose structure and optional removable behavior while leaving variant styling to the consumer.

## Supported states

- Default / with icon / with close button
- Disabled (optional; e.g. non-removable)
- Variant: neutral, success, warning, error, info (component/styling)
- Focused, focus-visible (on close button when present)

## Common use cases

- Status labels (New, Draft, Published)
- Category or filter chips
- Count or short text labels
- Optional icon and removable (close); variants for status or neutral
- Composes with list, filter bar, or input chips

## Headless component goals

- Provide structure: root (tag container), optional icon slot, optional close button
- Support removable: close button with optional output (removed) or value change
- Expose data attributes for variant styling
- No interactive behavior on root except when close is clicked
- Accessible: tag text readable; close button has accessible name

## Required headless features

### Core behavior

- Tag root (container for text and optional icon/close)
- Optional: close button (removes tag or emits removed)
- Content: text or projected content (icon + text)
- Optional: disabled state (e.g. not removable)
- Variant/size typically in component layer for styling

### Accessibility

- Tag: ensure text is readable (contrast)
- Close button: accessible name (e.g. "Remove [tag label]") and keyboard activatable
- When tag is interactive (e.g. filter chip), ensure it is focusable and activatable
- Optional: role="listitem" when inside list of tags

### Interaction

- Click on close button: remove tag or emit event
- Optional: click on tag (e.g. to toggle filter) when designed
- Disabled: close not clickable or tag not interactive

### Composition

- Tag root
- Optional: TagIcon, TagClose (button)
- Content projection for label text
- Composes with list, filter bar, input chips

### State exposure

- data-slot (tag, tag-close, etc.)
- data-disabled when disabled
- Optional: data-variant, data-size for styling
- data-removable or presence of close button for styling

## Suggested primitives / parts

- `TagRoot` (e.g. tngTag)
- `TagClose` (optional; button to remove)
- Optional: TagIcon (slot)

## Suggested APIs

### Tag root

- `disabled?: boolean` (optional; e.g. not removable)
- `removable?: boolean` (show close button)
- Optional: variant, size (component layer)
- Structural; content projected

### Tag close

- `ariaLabel?: string` (e.g. "Remove [label]")
- Emits removed or tagRemove (parent handles removal or emits)
- Optional: disabled when tag disabled

### Angular API contract (required)

- tngTag: inputs disabled, removable (if supported); optional output removed
- Tag close: button with aria-label; emits so parent can remove from list or update model
- When used in form (e.g. chips), removal may sync with form control value

## Keyboard interaction

- Tag itself may not be focusable unless it is a chip/button
- Close button: Tab to focus, Enter/Space to activate (remove)
- When tag is focusable (chip): Enter/Space may toggle or remove per design

## Accessibility notes

- Close button must have clear label ("Remove" or "Remove [tag text]")
- List of tags: use list semantics (ul/li) or role="list" and role="listitem" when appropriate
- Ensure tag text and close icon have sufficient contrast

## Open design decisions

- Whether tag is ever focusable as a whole (e.g. filter chip) vs. only close button focusable
- Removal: emit only vs. two-way binding (value array)
- Variant/size in primitive vs. component only

## Test checklist

### Rendering

- [ ] Renders root with content (text, optional icon)
- [ ] Renders close button when removable
- [ ] Renders disabled state when supported
- [ ] Applies data-slot, data-disabled, optional data-variant

### Accessibility

- [ ] Close button has accessible name
- [ ] Close button is focusable and keyboard activatable
- [ ] Tag text has sufficient contrast

### Interaction

- [ ] Click on close removes or emits
- [ ] Disabled prevents close when applicable

### Data attributes

- [ ] Applies data-slot, data-disabled
- [ ] Optional data-removable, data-variant

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-tag>` component created in `components`
6. [ ] Test cases created for `<tng-tag>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add tag`)
14. [ ] `tailng-cli` command generation added for tag artifacts
15. [ ] CLI integration tests added for `tailng add tag`

## Links

- Playground: `/tag`
