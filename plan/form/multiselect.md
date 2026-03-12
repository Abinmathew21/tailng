# MultiSelect

Headless multiselect primitive for multiple-selection dropdown behavior and state.

## Overview

MultiSelect is a headless form control: a dropdown or listbox that allows selecting multiple options. State is reflected in the trigger (e.g. count, chip list, or "X selected"). Toggle selection on option click; optional clear-all and keyboard support for multi-select. Checkbox or highlight state per option. Composes with listbox and overlay; value is an array.

This component should expose trigger, content/listbox, options, values (array), open state, and accessibility (aria-multiselectable, aria-selected) while leaving styling to the consumer.

## Supported states

- open / closed
- values (selected array)
- highlighted option (keyboard)
- disabled option(s), disabled multiselect
- required, invalid (optional)
- focused, focus-visible

## Common use cases

- Multi-choice dropdown (tags, categories, permissions)
- Trigger shows count or chip list
- Toggle on option click; clear-all button
- Checkbox or highlight per option
- Keyboard support for multi-select
- Composes with listbox and overlay

## Headless component goals

- Provide accessible multiselect semantics (trigger aria-expanded, aria-controls; listbox aria-multiselectable, options aria-selected)
- Support multiple selected values (array)
- Support controlled and uncontrolled values
- Keyboard: open, move, toggle with Enter/Space, close
- Optional: select all, clear all
- Expose state for trigger display (count, labels) and option styling
- Support disabled options

## Required headless features

### Core behavior

- MultiSelect root: values (array), defaultValues, valuesChange; open, openChange
- Trigger: displays summary (count, first N labels, or custom); aria-expanded, aria-controls
- Content: listbox with multiple selection (aria-multiselectable)
- Option: value; selected when in values array; click toggles
- Close on Escape, optional outside click; may stay open on select (toggle) or close on blur
- Disabled, required, invalid
- Optional: select all, clear all actions

### Accessibility

- Trigger: aria-expanded, aria-controls, aria-haspopup="listbox"
- Listbox: role="listbox", aria-multiselectable="true"
- Options: role="option", aria-selected="true"|"false"
- Keyboard: arrows move; Enter/Space toggle option; Escape close
- Accessible name for trigger (e.g. "Categories") and listbox
- Announce selection count or changes when appropriate

### Interaction

- Click trigger opens
- Click option toggles selection (add/remove from values)
- Enter/Space on option toggles
- Optional: select all, clear all (buttons or keyboard)
- Click outside or Escape closes
- Disabled option not selectable

### Composition

- MultiSelect root
- MultiSelect trigger
- MultiSelect content
- MultiSelect listbox + options (reuse listbox primitive with multiple=true)
- Optional: clear all, select all in trigger or overlay

### State exposure

- data-open, data-disabled, data-invalid
- data-selected on option
- data-values or count for trigger display
- data-slot

## Suggested primitives / parts

- `MultiSelectRoot` (e.g. tngMultiselect)
- `MultiSelectTrigger`
- `MultiSelectContent`
- `MultiSelectListbox` (or listbox with multiple)
- `MultiSelectOption`
- Optional: MultiSelectClearAll, MultiSelectSelectAll

## Suggested APIs

### MultiSelect root

- `values?: T[]`, `defaultValues?: T[]`, `valuesChange?: (values: T[]) => void`
- `open?`, `defaultOpen?`, `openChange?`
- `disabled?`, `required?`, `invalid?`
- `name?` (for form; may submit as array or comma-separated)
- `ariaLabel?`
- Optional: maxSelections, selectAll, clearAll

### Trigger

- Displays: count ("3 selected"), labels, or custom template
- aria-expanded, aria-controls from root

### Option

- value (tngValue); selected when in values array
- disabled option
- Toggle on click/Enter/Space

### Angular API contract (required)

- tngMultiselect: values, defaultValues, open, disabled; valuesChange, openChange
- Trigger, content, listbox, option; option toggles on activate
- ControlValueAccessor with value as array
- Must support custom trigger template (chips, count) and option template

## Keyboard interaction

- Tab: focus trigger (or close and move)
- Enter/Space on trigger: open
- Arrow Down/Up: move highlight
- Enter/Space on option: toggle option (do not close)
- Escape: close
- Optional: Select all (Ctrl+A), Clear all (shortcut or button)
- Home/End: first/last option

## Accessibility notes

- aria-multiselectable="true" on listbox
- Each option aria-selected must reflect state
- Trigger should indicate multi-select and optionally count
- Announce when option selected/deselected if not obvious from UI

## Form behavior

- values array bound to form control
- name/value: may need hidden inputs or serialized value for submission
- Form reset restores defaultValues
- ControlValueAccessor with array value

## Open design decisions

- Close on each select vs. keep open for multiple selections
- Max selections limit and behavior
- Trigger display: always count vs. chips vs. custom only

## Test checklist

### Rendering

- [ ] Renders trigger and content/listbox
- [ ] Trigger shows count or selected labels
- [ ] Options show selected state (checkbox or highlight)
- [ ] Open/close; toggle adds/removes from values
- [ ] Disabled options; clear all / select all when present

### Accessibility

- [ ] Listbox aria-multiselectable; options aria-selected
- [ ] Trigger aria-expanded, aria-controls
- [ ] Keyboard toggle and move

### Keyboard and pointer

- [ ] Enter/Space toggle option
- [ ] Arrows move; Escape closes
- [ ] Click option toggles
- [ ] Clear all / select all when implemented

### Controlled / uncontrolled

- [ ] values and valuesChange
- [ ] defaultValues and internal updates

### Form integration

- [ ] Works with formControlName (array value)
- [ ] Form reset restores defaultValues

### Data attributes

- [ ] data-open, data-disabled, data-selected

## Implementation Steps

1. [ ] Headless component created in `primitives` (or built from listbox + overlay)
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [ ] Minimum style `<tng-multiselect>` component created in `components`
6. [ ] Test cases created for multiselect component
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add multiselect`)
14. [ ] `tailng-cli` command generation added for multiselect artifacts
15. [ ] CLI integration tests added for `tailng add multiselect`

## Links

- Docs route: `/components/form/multiselect`
- Playground: `/multiselect` (if present)
