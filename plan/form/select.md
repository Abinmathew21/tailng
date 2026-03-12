# Select

Headless select primitive for single-choice dropdown.

## Overview

Select is a headless form control: a trigger (button or field) that opens a listbox for choosing one option. Trigger shows current selection; opening shows the full list. Keyboard: Enter/Space open; arrows move; Enter selects. Composes with listbox; supports custom trigger and option rendering. No type-to-filter by default (use combobox/autocomplete for that).

This component should expose trigger, content/listbox, options, value, open state, and accessibility while leaving styling to the consumer.

## Supported states

- open / closed
- value (selected option or null)
- highlighted option (keyboard)
- disabled, invalid, required
- focused, focus-visible (trigger and options)

## Common use cases

- Single-choice dropdown (country, role, category)
- Trigger shows label of selected value
- Custom trigger and option rendering
- Keyboard: Enter/Space open; arrows move; Enter selects
- Composes with listbox

## Headless component goals

- Provide accessible select semantics (aria-expanded, aria-controls, aria-haspopup="listbox", role on trigger; listbox role and option aria-selected)
- Support single value; valueChange on select
- Support controlled and uncontrolled value and open state
- Keyboard: open, close, move, select
- Optional search/filter inside listbox (component layer)
- Expose state for styling
- Support disabled options

## Required headless features

### Core behavior

- Select root: value, defaultValue, valueChange; open, defaultOpen, openChange
- Trigger: shows selected label; aria-expanded, aria-controls, aria-haspopup
- Content: listbox with options
- Option: value, label; selected when value matches
- Close on select, Escape, outside click
- Disabled, required, invalid

### Accessibility

- Trigger: role="combobox" or "button", aria-expanded, aria-controls (listbox id), aria-haspopup="listbox", aria-labelledby
- Listbox: role="listbox"; options role="option", aria-selected
- aria-activedescendant for keyboard highlight (optional; or roving tabindex)
- Accessible name for trigger and listbox

### Interaction

- Click trigger opens; click option selects and closes
- Enter/Space on trigger open
- Arrows move in listbox; Enter selects
- Escape closes
- Click outside closes

### Composition

- Select root
- Select trigger
- Select content
- Select listbox
- Select option (with value)

### State exposure

- data-open, data-disabled, data-invalid, data-required
- data-selected on option
- data-focused, data-focus-visible

## Suggested primitives / parts

- `SelectRoot` (e.g. tngSelect)
- `SelectTrigger`
- `SelectContent`
- `SelectListbox` (or listbox primitive)
- `SelectOption` (e.g. tngSelectOption with tngValue)

## Suggested APIs

### Select root

- `value?: T`, `defaultValue?: T`, `valueChange?: (value: T) => void`
- `open?: boolean`, `defaultOpen?: boolean`, `openChange?: (open: boolean) => void`
- `disabled?: boolean`, `required?: boolean`, `invalid?: boolean`
- `name?: string`, `form?: string` (for submission)
- `ariaLabel?`, `ariaLabelledby?`

### Trigger

- Receives aria-expanded, aria-controls from root
- Displays selected option label (from root value)

### Option

- `value: T` (tngValue); label from content or optionLabel
- `disabled?: boolean`
- Selected when root value equals option value

### Angular API contract (required)

- tngSelect: value, defaultValue, open, disabled, required, invalid; valueChange, openChange
- Trigger, content, listbox, option directives; option uses tngValue
- ControlValueAccessor for form integration
- Must support custom option template and trigger template

## Keyboard interaction

- Tab: focus trigger (or close and move focus)
- Enter/Space on trigger: open
- Arrow Down/Up: move highlight in listbox
- Enter: select highlighted and close
- Escape: close
- Home/End: first/last option (optional)
- Type-ahead: optional jump to option by first letter

## Accessibility notes

- Trigger must have accessible name (selected value or placeholder)
- aria-expanded and aria-controls must reference listbox id
- Options must have stable ids for aria-activedescendant if used

## Form behavior

- value and name for form submission (hidden input or form value)
- ControlValueAccessor for Angular forms
- Form reset restores defaultValue

## Open design decisions

- Whether select supports search/filter inside (primitive vs. component)
- Option group (optgroup) support
- Multi-select vs. single only (this plan is single; multiselect is separate)

## Test checklist

### Rendering

- [ ] Renders trigger and content/listbox
- [ ] Trigger shows selected label
- [ ] Open/close correct
- [ ] Option selected state matches value
- [ ] Disabled, required, invalid

### Accessibility

- [ ] Trigger has aria-expanded, aria-controls, aria-haspopup
- [ ] Listbox and options have correct roles and aria-selected
- [ ] Keyboard open, move, select, close

### Keyboard and pointer

- [ ] Enter/Space open; arrows move; Enter selects; Escape closes
- [ ] Click option selects and closes
- [ ] Click outside closes

### Controlled / uncontrolled

- [ ] Controlled value and open; valueChange, openChange
- [ ] Uncontrolled defaultValue, defaultOpen

### Form integration

- [ ] Works with formControlName, ngModel
- [ ] name/value for submission

### Data attributes

- [ ] data-open, data-disabled, data-selected

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [ ] Minimum style `<tng-select>` component created in `components`
6. [ ] Test cases created for `<tng-select>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add select`)
14. [ ] `tailng-cli` command generation added for select artifacts
15. [ ] CLI integration tests added for `tailng add select`

## Links

- Playground: `/select`
