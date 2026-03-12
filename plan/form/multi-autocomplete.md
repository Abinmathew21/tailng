# MultiAutocomplete

Headless multi-autocomplete primitive for chip-based autocomplete selection (multiple values).

## Overview

MultiAutocomplete is a headless form control: autocomplete that allows multiple selections, often displayed as chips or tags. New selections are added from a filtered list; chips can be removed. Composes listbox with input and chip/tag UI. Input drives filtering; selecting an option adds to values and may keep dropdown open for next selection; remove chip removes from values.

This component should expose input/trigger area, chip list, overlay listbox, values (array), filtering, add/remove, and accessibility while leaving styling to the consumer.

## Supported states

- open / closed (dropdown)
- values (array of selected items)
- filter/query (input text)
- highlighted option (keyboard)
- disabled, invalid
- Focus: input or chip or option
- Loading (optional; async options)

## Common use cases

- Multiple tags (categories, skills, recipients)
- Chips shown in trigger area; input to add more
- Remove chip to remove value
- Filter options by typing
- Composes listbox with input and chip/tag UI
- Add/remove and inline filtering

## Headless component goals

- Provide accessible combobox/listbox semantics for multi-select with input
- Support multiple values (array); add on select, remove on chip remove
- Support filtering by input value
- Keyboard: type to filter, arrows move, Enter adds option; focus chips and remove with Delete/Backspace
- Chips: each has remove control (accessible button)
- Support controlled and uncontrolled values
- Expose state for chip and option rendering
- Optional: max values, duplicate handling

## Required headless features

### Core behavior

- MultiAutocomplete root: values, defaultValues, valuesChange; open state
- Trigger area: input (filter) + chip list (selected items with remove)
- Overlay: listbox with options filtered by input
- Select option: add to values (and optionally keep open)
- Remove chip: remove value from array
- Optional: prevent duplicates; max values
- Disabled, invalid
- Close on Escape, outside click; optional close on blur

### Accessibility

- Trigger/input: aria-expanded, aria-controls, aria-multiselectable
- Listbox: role="listbox", aria-multiselectable="true"; options aria-selected
- Chips: each chip has remove button with accessible name ("Remove X")
- Keyboard: input focus for filter; arrows in listbox; Enter adds; focus chips and Delete/Backspace to remove
- Active descendant or roving tabindex for listbox and chips
- Accessible name for component

### Interaction

- Type in input to filter options
- Click option (or Enter) adds to values; optionally close or stay open
- Click remove on chip removes value
- Keyboard: move to chip, Delete/Backspace removes
- Click outside or Escape closes dropdown
- Disabled option not addable; disabled chip not removable (if applicable)

### Composition

- MultiAutocomplete root
- MultiAutocomplete trigger (input + chips container)
- MultiAutocomplete chip (per value; with remove)
- MultiAutocomplete content (overlay)
- MultiAutocomplete listbox + options

### State exposure

- data-open, data-disabled, data-invalid
- data-selected on option; data-values for chips
- data-slot
- Per-chip: data-value or key for remove

## Suggested primitives / parts

- `MultiAutocompleteRoot` (e.g. tngMultiAutocomplete)
- `MultiAutocompleteTrigger` (input + chips)
- `MultiAutocompleteChip` (value + remove button)
- `MultiAutocompleteContent`
- `MultiAutocompleteListbox` + `MultiAutocompleteOption`

## Suggested APIs

### MultiAutocomplete root

- `values?: T[]`, `defaultValues?: T[]`, `valuesChange?: (values: T[]) => void`
- `open?`, `defaultOpen?`, `openChange?`
- `disabled?`, `invalid?`
- `filterFn?`, `getOptionLabel?`, `getChipLabel?`
- `maxValues?`, `allowDuplicate?`
- `ariaLabel?`
- Optional: closeAfterSelect (false to keep open)

### Chip

- value (from parent); remove event or callback
- Accessible remove button label: "Remove [label]"

### Option

- value; selected when in values (show check or hide from list)
- Optional: hide already-selected in list vs. show as selected

### Angular API contract (required)

- tngMultiAutocomplete: values, defaultValues, open; valuesChange, openChange
- Trigger with input and chip list; content with listbox
- Chip remove emits or updates values
- ControlValueAccessor with array value
- Must support custom option and chip templates

## Keyboard interaction

- Tab: focus input or first chip
- Input: type to filter; Arrow Down opens/moves to listbox
- In listbox: arrows move; Enter adds option
- Focus chip: Tab or arrows; Delete/Backspace removes chip
- Escape: close dropdown or clear input
- Optional: Arrow Left/Right between chips

## Accessibility notes

- Chips must have remove control with clear label
- Listbox aria-multiselectable; options can show selected or be hidden when selected
- Ensure focus order: input → chips → listbox when open
- Announce when value added or removed if helpful

## Form behavior

- values array with form control
- Form reset restores defaultValues
- ControlValueAccessor with array

## Open design decisions

- Show selected options in list (with check) vs. hide from list
- Close after each add vs. keep open
- Duplicate handling: allow or prevent
- Max values and behavior when reached

## Test checklist

### Rendering

- [ ] Renders input and chip list
- [ ] Options filter by input
- [ ] Selecting option adds to values and shows chip
- [ ] Remove chip removes value
- [ ] Open/close; disabled, invalid
- [ ] Optional max values and duplicate handling

### Accessibility

- [ ] ARIA on trigger and listbox
- [ ] Chips have remove button with accessible name
- [ ] Keyboard add and remove

### Keyboard and pointer

- [ ] Type filters; Enter adds
- [ ] Focus chip and Delete/Backspace removes
- [ ] Escape closes
- [ ] Click option adds; click remove removes

### Controlled / uncontrolled

- [ ] values and valuesChange
- [ ] defaultValues and internal updates

### Form integration

- [ ] Array value with formControlName
- [ ] Reset restores defaultValues

### Data attributes

- [ ] data-open, data-disabled, data-selected

## Implementation Steps

1. [ ] Headless component created in `primitives` (or composed from autocomplete + chips)
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [ ] Minimum style `<tng-multi-autocomplete>` component created in `components`
6. [ ] Test cases created for multi-autocomplete component
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add multi-autocomplete`)
14. [ ] `tailng-cli` command generation added for multi-autocomplete artifacts
15. [ ] CLI integration tests added for `tailng add multi-autocomplete`

## Links

- Docs route: `/components/form/multi-autocomplete`
- Playground: `/multi-autocomplete` (if present)
