# SelectBox

Headless select-box primitive for single-choice select with trigger and content composition.

## Overview

SelectBox is a headless form control with a trigger (button or field) that opens a listbox or dropdown for choosing one option. Conceptually similar to Select; the name may denote a specific API or composition pattern (trigger + content). Trigger shows current selection; single value; closing commits selection. Supports custom trigger and option rendering. Composes with listbox and overlay.

This component should expose trigger, content/listbox, options, value, open state, and accessibility while leaving styling to the consumer. If SelectBox and Select are the same in implementation, this doc can reference Select and note any naming/API differences.

## Supported states

- open / closed
- value (selected)
- highlighted option (keyboard)
- disabled, invalid, required
- focused, focus-visible

## Common use cases

- Single-choice dropdown with custom trigger
- Trigger shows current selection; click opens list
- Custom trigger and option rendering
- Form integration with name/value
- Composes with listbox

## Headless component goals

- Provide accessible select/combobox semantics
- Support single value and valueChange
- Support controlled and uncontrolled value and open
- Keyboard and pointer interaction
- Custom trigger and option content
- Expose state for styling

## Required headless features

### Core behavior

- SelectBox root: value, defaultValue, valueChange; open, openChange
- Trigger: displays selected label; opens on click
- Content: listbox with options; close on select, Escape, outside
- Option: value; selected when matches root value
- Disabled, required, invalid

### Accessibility

- Trigger: aria-expanded, aria-controls, aria-haspopup
- Listbox: role="listbox"; options role="option", aria-selected
- Keyboard: open, move, select, close
- Accessible name

### Interaction

- Click trigger opens; click option selects and closes
- Enter/Space open; arrows move; Enter selects; Escape closes
- Click outside closes

### Composition

- SelectBox root
- SelectBox trigger
- SelectBox content
- SelectBox listbox + options

### State exposure

- data-open, data-disabled, data-invalid
- data-selected on option

## Suggested primitives / parts

- `SelectBoxRoot` (or reuse Select root with alias)
- `SelectBoxTrigger`
- `SelectBoxContent`
- `SelectBoxListbox` / `SelectBoxOption`

## Suggested APIs

### SelectBox root

- `value?`, `defaultValue?`, `valueChange?`
- `open?`, `defaultOpen?`, `openChange?`
- `disabled?`, `required?`, `invalid?`
- `name?`, `form?`
- `ariaLabel?`

### Trigger

- Receives aria from root; displays selected label

### Option

- value (tngValue); selected from root
- disabled option support

### Angular API contract (required)

- SelectBox (or Select) exposes value, open, disabled, required, invalid; valueChange, openChange
- Trigger and option composition
- ControlValueAccessor for forms

## Keyboard interaction

- Tab: focus trigger or move focus
- Enter/Space: open
- Arrows: move highlight; Enter: select and close
- Escape: close
- Type-ahead optional

## Accessibility notes

- Same as Select: aria-expanded, aria-controls, listbox and option roles
- Trigger accessible name

## Form behavior

- value and name for submission
- ControlValueAccessor
- Form reset restores defaultValue

## Open design decisions

- SelectBox vs. Select: same primitive with two names or distinct APIs
- Whether selectbox implies a different trigger style (e.g. field-like vs. button-like)

## Test checklist

### Rendering

- [ ] Renders trigger and content
- [ ] Trigger shows selection; open/close correct
- [ ] Option selected state; disabled/invalid

### Accessibility

- [ ] ARIA and roles correct
- [ ] Keyboard open, move, select, close

### Controlled / uncontrolled

- [ ] value and open; valueChange, openChange
- [ ] Uncontrolled defaults

### Data attributes

- [ ] data-open, data-disabled, data-selected

## Implementation Steps

1. [ ] Headless component created in `primitives` (or shared with Select)
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [ ] Minimum style selectbox component created in `components`
6. [ ] Test cases created for selectbox component
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add selectbox`)
14. [ ] `tailng-cli` command generation added for selectbox artifacts
15. [ ] CLI integration tests added for `tailng add selectbox`

## Links

- Docs route: `/components/form/selectbox`
- Playground: `/selectbox` (if present)
