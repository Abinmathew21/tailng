# Listbox

Headless listbox primitive for single or multiple selection with keyboard behavior.

## Overview

Listbox is a headless form control for a list of options with single or multiple selection. Full keyboard support: arrow keys, type-ahead, Home/End, optional focus loop. ARIA semantics: role="listbox", role="option", aria-selected. Composes with dropdowns, autocomplete, select, and custom list UIs. Options can be disabled; value(s) controlled or uncontrolled.

This component should expose listbox root, options (with value), value(s), keyboard navigation, and accessibility while leaving styling to the consumer.

## Supported states

- value (single) or values (multiple)
- highlighted/focused option (keyboard)
- open/closed when used inside overlay (handled by parent)
- disabled option(s)
- orientation: vertical (default) or horizontal

## Common use cases

- Dropdown option list (select, autocomplete)
- Standalone list of selectable items
- Single or multi-select
- Type-ahead and focus loop
- Composes with dropdowns, autocomplete, custom list UIs

## Headless component goals

- Provide accessible listbox semantics (role="listbox", role="option", aria-selected, aria-multiselectable when multiple)
- Support single value or multiple values
- Support controlled and uncontrolled value(s)
- Keyboard: arrows, Home/End, type-ahead, optional loop
- Enter/Space select (toggle in multi)
- Expose state for styling
- Support disabled options

## Required headless features

### Core behavior

- Listbox root: value or values, valueChange/valuesChange, multiple (boolean)
- Options: value (tngValue), selected state from root, disabled
- Roving tabindex or single tab stop; one option focused at a time
- Keyboard: Arrow Up/Down (or Left/Right if horizontal), Home, End, optional type-ahead
- Enter/Space: select (single) or toggle (multiple)
- Optional: loop (wrap at first/last)

### Accessibility

- Root: role="listbox", aria-multiselectable when multiple, aria-label or aria-labelledby
- Option: role="option", aria-selected, aria-disabled when disabled
- aria-activedescendant on root pointing to focused option id (or roving tabindex)
- Options must have stable ids
- Single tab stop into listbox; focus moves with arrows

### Interaction

- Click option selects (single) or toggles (multiple)
- Keyboard move and select/toggle
- Disabled option not selectable and skipped in navigation

### Composition

- Listbox root (container)
- Listbox option (each item with value)
- Optional: option group (role="group", aria-labelledby) for headings
- Composes inside select, autocomplete, combobox, or standalone

### State exposure

- data-selected on option
- data-disabled on option
- data-focused or activedescendant for highlighted option
- data-multiple on root
- data-slot

## Suggested primitives / parts

- `ListboxRoot` (e.g. tngListbox)
- `ListboxOption` (e.g. tngOption with tngValue)
- Optional: ListboxGroup (optgroup-like)

## Suggested APIs

### Listbox root

- `value?: T` (single) or `values?: T[]` (multiple)
- `defaultValue?` / `defaultValues?`
- `valueChange?` / `valuesChange?`
- `multiple?: boolean`
- `disabled?: boolean` (disable whole listbox)
- `ariaLabel?`, `ariaLabelledby?`
- `orientation?: 'vertical' | 'horizontal'`
- Optional: loop (keyboard wrap)

### Listbox option

- `value: T` (tngValue; required)
- `disabled?: boolean`
- Selected state from root (injected)
- Optional: id for aria-activedescendant

### Angular API contract (required)

- tngListbox: value, defaultValue, values, defaultValues, multiple, disabled; valueChange, valuesChange
- tngOption with tngValue; must be used inside listbox
- Option receives selected and disabled from root
- ControlValueAccessor for single value when used as form control; multi may use array
- Must support custom option template

## Keyboard interaction

- Tab: focus listbox (one option in tab order)
- Arrow Down/Up: move to next/previous option (wrap if loop)
- Arrow Left/Right: in horizontal mode, move (or same as up/down)
- Home/End: first/last option
- Enter: select (single) or toggle (multiple)
- Space: same as Enter (toggle in multi)
- Type-ahead: focus first option matching typed character(s)
- Shift+Tab: exit listbox

## Accessibility notes

- Only one tab stop; focus managed with arrows (roving tabindex or aria-activedescendant)
- aria-selected must reflect selection
- aria-multiselectable="true" when multiple
- Option ids for aria-activedescendant when used
- Group headings: role="group", aria-labelledby for group label

## Form behavior

- Single value: ControlValueAccessor with one value
- Multiple: value array; form control holds array
- Form reset restores defaultValue(s)

## Open design decisions

- Type-ahead: single character vs. multi-character buffer with timeout
- Option group (optgroup) in primitive vs. component
- Whether listbox manages focus with activedescendant or roving tabindex

## Test checklist

### Rendering

- [ ] Renders listbox and options
- [ ] Selected state matches value(s)
- [ ] Multiple mode: multiple selected
- [ ] Disabled options not selectable
- [ ] Applies data-selected, data-disabled, data-multiple, data-slot

### Accessibility

- [ ] Root has role="listbox", aria-multiselectable when multiple
- [ ] Options have role="option", aria-selected
- [ ] Disabled options have aria-disabled
- [ ] Keyboard focus and activedescendant/roving tabindex correct

### Keyboard interaction

- [ ] Arrows move focus/highlight
- [ ] Home/End to first/last
- [ ] Enter/Space select or toggle
- [ ] Type-ahead focuses matching option
- [ ] Disabled options skipped
- [ ] Loop when configured

### Pointer interaction

- [ ] Click option selects (single) or toggles (multiple)
- [ ] Disabled option does not select

### Controlled / uncontrolled

- [ ] Controlled value(s); valueChange/valuesChange
- [ ] Uncontrolled defaultValue(s); internal updates

### Form integration

- [ ] Works with formControlName/ngModel (single and multi)
- [ ] Value array for multi

### Data attributes

- [ ] data-selected, data-disabled, data-focused, data-slot

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [ ] Minimum style listbox component created in `components`
6. [ ] Test cases created for listbox component
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add listbox`)
14. [ ] `tailng-cli` command generation added for listbox artifacts
15. [ ] CLI integration tests added for `tailng add listbox`

## Links

- Docs route: `/components/form/listbox`
- Playground: `/listbox` (if present)
