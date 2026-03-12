# Chips

Headless chips primitive for tokenized input and removable item chip usage.

## Overview

Chips represent selected items or tags that can be removed (e.g. in multi-autocomplete or filter UIs). Each chip is a compact token with optional remove action. Often used with multi-select or tag input. Accessible remove control (button or icon) per chip. May be standalone (display + remove) or composed inside multi-autocomplete/input.

This component should expose chip container, individual chip (with value and remove), and remove behavior while leaving styling to the consumer. Chips can be purely presentational (parent manages values) or chip group can hold value array and emit remove.

## Supported states

- Per chip: default, focused, focus-visible (on remove button)
- Disabled chip (optional; non-removable or dimmed)
- Optional: chip group disabled
- With/without remove button

## Common use cases

- Selected items as chips (multi-autocomplete, multiselect)
- Filter tags with remove
- Input chips (type and add; chip per value)
- Each chip has optional remove; accessible remove control
- Composes with multi-select, tag input, filter bar

## Headless component goals

- Provide chip container and chip item structure
- Support remove action: each chip has remove control (button) with accessible name
- Optional: chip group holds values array and remove event (valuesChange when one removed)
- Keyboard: focus chips and remove button; Enter/Space or Delete to remove
- Expose data attributes for styling (data-value, data-disabled)
- Composes with input (for add) and multi-autocomplete
- No default styling; consumer or tag component adds visuals

## Required headless features

### Core behavior

- Chips root (container for list of chips)
- Chip item: value (or label), optional remove button
- Remove: emit remove event with value (parent updates array) or chip group manages values and valuesChange
- Optional: disabled chip (no remove or disabled remove)
- Optional: max chips (display only; add logic in parent)
- Chips can be read-only (display only, no remove) or removable

### Accessibility

- Chip list: role="list" or role="group"; aria-label when meaningful
- Each chip: optional role="listitem"; remove button must have accessible name ("Remove [label]")
- Focus: remove buttons focusable; Tab or arrows move between chips/buttons
- Ensure sufficient touch target for remove
- Do not use icon-only remove without aria-label

### Interaction

- Click remove button: remove chip (emit or update parent)
- Keyboard: focus remove button, Enter/Space to remove
- Optional: Delete/Backspace on chip focus removes (when chip is focusable)
- Disabled chip: remove not clickable or no remove button

### Composition

- Chips root (container)
- Chip item (value + optional remove)
- Optional: ChipRemove (button directive)
- Composes with multi-autocomplete, multiselect, tag input
- Parent typically holds values array and passes to chips; chips emit remove

### State exposure

- data-slot (chips, chip, chip-remove)
- data-value or data-label for chip (styling)
- data-disabled when chip disabled
- data-focused on remove button when focused

## Suggested primitives / parts

- `ChipsRoot` (e.g. tngChips container)
- `ChipItem` (e.g. tngChip with value)
- `ChipRemove` (e.g. button in chip for remove)

## Suggested APIs

### Chips root

- Optional: `values?: T[]`, `valuesChange?: (values: T[]) => void` (when chips own state)
- Or: chips only receive values as input and emit remove(value); parent owns state
- `disabled?: boolean` (disable all removes)
- `ariaLabel?` (e.g. "Selected tags")
- Structural; projects chip items

### Chip item

- `value: T` (for display and remove callback)
- `label?: string` (for remove button aria-label: "Remove {label}")
- `disabled?: boolean` (optional; chip not removable)
- Remove: (chipRemove) or (remove) output with value
- Content: chip label/text; remove button slot or directive

### Chip remove

- Button with aria-label "Remove [chip label]"
- Emits or calls parent remove with value
- Disabled when chip or group disabled

### Angular API contract (required)

- tngChips: optional values, valuesChange; or only chipRemove output
- tngChip: value, label, disabled; chipRemove output
- Remove button: accessible name, focusable, triggers remove
- When used inside multi-autocomplete/multiselect, parent passes values and handles remove in valuesChange
- Can be standalone chip list with values + valuesChange (remove updates array)

## Keyboard interaction

- Tab: focus first remove button (or first chip if chip is focusable)
- Arrows: move between chips/remove buttons (optional)
- Enter/Space on remove button: remove chip
- Optional: when chip has focus, Delete/Backspace removes
- Shift+Tab: move focus away

## Accessibility notes

- Every remove control must have accessible name (not icon-only without label)
- Chip list should have aria-label when it represents a meaningful group
- Focus order: remove buttons or chips in logical order
- Ensure remove is not accidentally triggered (confirm not required; single action)

## Form behavior

- Chips often back a form control value (array); parent component syncs values with form
- Remove updates array; form control value updates via parent
- No direct ControlValueAccessor on chips; parent (e.g. multi-autocomplete) has CVA

## Open design decisions

- Chips as controlled only (parent owns values) vs. chips with values + valuesChange
- Chip focusable as a whole vs. only remove button focusable
- Input chip (add by typing) in scope or only display + remove

## Test checklist

### Rendering

- [x] Renders chip list and chip items
- [x] Each chip shows value/label
- [x] Remove button present when removable
- [x] Disabled chip/group when set
- [x] Applies data-slot, data-value, data-disabled

### Accessibility

- [x] Remove button has accessible name ("Remove X")
- [x] Remove buttons focusable
- [x] Chip list has aria-label when needed
- [x] Keyboard focus order correct

### Interaction

- [x] Click remove removes chip and parent updates
- [x] Enter/Space on remove button removes
- [x] Disabled chip does not remove
- [x] Optional: Delete/Backspace on chip removes

### Data attributes

- [x] data-slot, data-value, data-disabled
- [x] data-focused on remove when focused

## Implementation Steps

1. [x] Headless component created in `primitives` (or chips are part of tag component)
2. [x] Test cases created for headless
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style chips component created in `components`
6. [x] Test cases created for chips component
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add chips`)
14. [x] `tailng-cli` command generation added for chips artifacts
15. [x] CLI integration tests added for `tailng add chips`

## Links

- Docs route: `/components/form/chips`
- Playground: `/chips` (if present)
