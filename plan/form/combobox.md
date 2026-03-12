# Combobox

Headless combobox primitive for text input with options popup (filter and select).

## Overview

Combobox is a headless form control: an input that opens a list of options. User can type to filter and select one (or optionally multiple) values; selection can update the input value. Similar to autocomplete; often used when the trigger is an input that can be editable (type to filter) or read-only (click to open). Composes with listbox and popover/overlay. Keyboard: type to filter, arrows to move, Enter to select.

This component should expose trigger (input), overlay, listbox, options, value, filtering, and accessibility while leaving styling to the consumer.

## Supported states

- open / closed
- value (selected) or values (if multi)
- filter/query (input text)
- highlighted option (keyboard)
- disabled, invalid
- Optional: editable (input can be edited when closed) vs. select-only

## Common use cases

- Single-choice with search (country, product)
- Editable or select-only input + dropdown
- Composes with listbox and popover
- Keyboard: type to filter, arrows move, Enter selects

## Headless component goals

- Provide accessible combobox semantics (aria-expanded, aria-controls, aria-activedescendant)
- Support single selection (and optionally multiple)
- Support filtering by input value
- Keyboard and pointer interaction
- Controlled and uncontrolled value
- Open on focus/click; close on select, Escape, outside click
- Expose state for styling

## Required headless features

### Core behavior

- Combobox root: value(s), valueChange, open state
- Trigger (input): displays value/label; filter drives option list
- Content/overlay with listbox and options
- Filter options by query; select updates value and optionally closes
- Disabled, invalid

### Accessibility

- Trigger: aria-expanded, aria-controls, aria-activedescendant
- Listbox: role="listbox"; options role="option", aria-selected
- Type-ahead and arrow navigation
- Accessible name

### Interaction

- Open on focus or click; close on select, Escape, outside click
- Type filters; arrows move; Enter selects
- Click option selects

### Composition

- Combobox root
- Combobox trigger (input)
- Combobox content/overlay
- Combobox listbox + options

### State exposure

- data-open, data-disabled, data-invalid
- data-selected on option
- data-focused, data-focus-visible

## Suggested primitives / parts

- `ComboboxRoot` (e.g. tngCombobox)
- `ComboboxTrigger` (input)
- `ComboboxContent`
- `ComboboxListbox` / `ComboboxOption`

## Suggested APIs

### Combobox root

- `value?`, `defaultValue?`, `valueChange?`
- `open?`, `defaultOpen?`, `openChange?`
- `disabled?`, `invalid?`
- `filterFn?`, `getOptionLabel?`
- `ariaLabel?`
- Optional: multiple (values array)

### Trigger

- Input binding for filter/value; aria from root

### Option

- value, label; selected from root

### Angular API contract (required)

- tngCombobox: value, open, disabled; valueChange, openChange
- Trigger and listbox/option coordination
- ControlValueAccessor for form integration when single value

## Keyboard interaction

- Tab: focus trigger or close and move
- Arrow Down/Up: open if needed; move highlight
- Enter: select and close
- Escape: close
- Type: filter options

## Accessibility notes

- aria-expanded, aria-controls, aria-activedescendant in sync
- Listbox and option ids for references

## Form behavior

- Value bound to form; name/value for submission

## Open design decisions

- Combobox vs. autocomplete: same primitive or separate (codebase has both; combobox may be simpler or alias)
- Editable vs. read-only trigger

## Test checklist

### Rendering

- [ ] Renders trigger and overlay/listbox
- [ ] Open/close and filter work
- [ ] Selection updates value and trigger display
- [ ] Disabled/invalid

### Accessibility

- [ ] ARIA attributes correct
- [ ] Keyboard navigation and selection

### Controlled / uncontrolled

- [ ] value and open controlled; valueChange, openChange
- [ ] Uncontrolled defaults

### Data attributes

- [ ] data-open, data-disabled, data-selected

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style combobox component created in `components`
6. [ ] Test cases created for combobox component
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add combobox`)
14. [ ] `tailng-cli` command generation added for combobox artifacts
15. [ ] CLI integration tests added for `tailng add combobox`

## Links

- Playground: `/combobox`
