# Autocomplete

Headless autocomplete primitive for single-value autocomplete with filtering.

## Overview

Autocomplete combines a text input with a listbox (or dropdown) so users can type to filter and select a single value from options. Input drives filtering; listbox shows matching options; selection updates the input value. Keyboard and mouse selection with accessible focus management. Used for search-as-you-type, tags, or single-choice with search.

This component should expose trigger (input), overlay/listbox, filtering, value, and accessibility while leaving styling to the consumer.

## Supported states

- open / closed (listbox visible)
- value (selected option or null)
- filter/query (input text)
- focused option (keyboard highlight)
- disabled, invalid (optional)
- loading (optional; async options)

## Common use cases

- Single-value select with type-to-filter
- Search suggestions (select one)
- Country/city picker with search
- Input reflects selected value; keyboard and mouse selection
- Composes with listbox and popover/overlay

## Headless component goals

- Provide accessible combobox/listbox semantics (aria-autocomplete, aria-expanded, aria-controls, aria-activedescendant)
- Support single selection; value reflected in input
- Support filtering: input value filters options
- Keyboard: type to filter, arrows to move, Enter to select, Escape to close
- Open/close on focus, click outside, Escape
- Support controlled and uncontrolled value
- Expose state for custom rendering

## Required headless features

### Core behavior

- Autocomplete root: value, defaultValue, valueChange; open state
- Trigger (input): value/filter, aria-expanded, aria-controls, aria-activedescendant
- Overlay/listbox: options; filtering by input value
- Single selection: selecting option sets value and closes; input shows selected label or value
- Optional: open on focus, open on input, close on select, close on blur/Escape
- Disabled, invalid support

### Accessibility

- Trigger: role="combobox" or input with aria-autocomplete="list", aria-expanded, aria-controls (listbox id), aria-activedescendant (focused option id)
- Listbox: role="listbox", options role="option", aria-selected
- Keyboard: arrows move activedescendant; Enter selects; Escape closes
- Type-ahead: filter options; optional type-to-select
- Accessible name for trigger and listbox

### Interaction

- Focus/blur and input change drive open/filter
- Click option selects and closes
- Enter selects highlighted option
- Escape closes without selecting
- Click outside closes

### Composition

- Autocomplete root
- Autocomplete trigger (input)
- Autocomplete content/overlay
- Autocomplete listbox
- Autocomplete option (with value and label)

### State exposure

- data-open, data-disabled, data-invalid
- data-focused, data-focus-visible on trigger and option
- data-selected on option

## Suggested primitives / parts

- `AutocompleteRoot` (e.g. tngAutocomplete)
- `AutocompleteTrigger` (input)
- `AutocompleteContent` / `AutocompleteOverlay`
- `AutocompleteListbox`
- `AutocompleteOption`

## Suggested APIs

### Autocomplete root

- `value?: T`, `defaultValue?: T`, `valueChange?: (value: T) => void`
- `open?: boolean`, `defaultOpen?: boolean`, `openChange?: (open: boolean) => void`
- `disabled?: boolean`, `invalid?: boolean`
- `filterFn?: (query: string, option: T) => boolean` or filter by option label
- `getOptionLabel?: (option: T) => string`
- `ariaLabel?`, `ariaLabelledby?`, `ariaDescribedby?`
- Optional: closeOnSelect, openOnFocus

### Trigger

- Input value (filter/query); may show selected label when closed
- Receives aria-expanded, aria-controls, aria-activedescendant from root

### Option

- `value: T`, `label?: string` (or from getOptionLabel)
- Selected state from root value
- Disabled option support

### Angular API contract (required)

- tngAutocomplete: inputs value, defaultValue, open, disabled, invalid; outputs valueChange, openChange
- Trigger: input with tngAutocompleteTrigger; value and filter binding
- Listbox and option: value, selected, keyboard coordination
- Must support ControlValueAccessor for form integration
- Options can be async; loading state optional

## Keyboard interaction

- Tab: focus trigger (or close and move focus)
- Arrow Down: open if closed; move to next option if open
- Arrow Up: move to previous option
- Enter: select highlighted option and close
- Escape: close
- Type: filter options; optional type-ahead to focus option
- Home/End: first/last option (optional)

## Accessibility notes

- aria-expanded, aria-controls, aria-activedescendant must stay in sync
- Listbox must have id for aria-controls
- Options must have id for aria-activedescendant
- Announce selected value and filter result count when appropriate

## Form behavior

- Value syncs with form control (ControlValueAccessor)
- name/value for submission (often hidden input or value from selected option)

## Open design decisions

- Editable vs. select-only (input read-only when closed)
- Clear button and empty value
- Minimum characters before open/filter

## Test checklist

### Rendering

- [x] Renders trigger and overlay/listbox
- [x] Listbox opens/closes correctly
- [x] Options filter by input value
- [x] Selected value reflected in trigger
- [x] Disabled and invalid states

### Accessibility

- [x] Trigger has aria-expanded, aria-controls, aria-activedescendant
- [x] Listbox has role="listbox"; options role="option", aria-selected
- [x] Keyboard moves activedescendant and selects

### Keyboard interaction

- [x] Arrows move highlight; Enter selects; Escape closes
- [x] Type filters options
- [x] Tab closes and moves focus

### Pointer interaction

- [x] Click option selects and closes
- [x] Click outside closes

### Controlled / uncontrolled

- [x] Controlled value and open
- [x] valueChange and openChange emitted
- [x] Uncontrolled defaultValue and defaultOpen

### Data attributes

- [x] Applies data-open, data-disabled, data-selected where defined

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless (a11y spec)
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style autocomplete component created in `components`
6. [x] Test cases created for autocomplete component
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add autocomplete`)
14. [x] `tailng-cli` command generation added for autocomplete artifacts
15. [x] CLI integration tests added for `tailng add autocomplete`

## Links

- Docs route: `/components/form/autocomplete`
- Playground: `/autocomplete` (if present)
