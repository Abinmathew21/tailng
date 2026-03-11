# Checkbox

Headless checkbox primitive for binary and tri-state selection.

## Overview

Checkbox is a headless form control used for boolean selection and mixed-state selection.
It supports both standalone usage and grouped usage, including parent-child selection patterns where the parent can become `mixed` when only some children are selected.

This component should expose behavior, accessibility, and state management clearly, while leaving visual styling to the consumer or to higher-level styled components.

## Supported states

- `checked`
- `unchecked`
- `mixed` / `indeterminate`
- `disabled`
- `readonly`
- `required`
- `invalid`
- `focused`
- `focus-visible`

## Common use cases

- Accepting a single boolean option
- Selecting multiple items in a list
- “Select all” with partial selection support
- Permission matrices
- Tree or nested selection patterns
- Table row selection

## Headless component goals

- Provide accessible checkbox semantics
- Support binary and tri-state behavior
- Support controlled and uncontrolled APIs
- Support form integration
- Support label association and description/error wiring
- Support keyboard and pointer interactions
- Expose state for custom rendering and styling
- Work as a standalone checkbox or within checkbox groups

## Required headless features

### Core behavior

- Binary checkbox support
- Tri-state checkbox support
- Programmatic `mixed` state support
- Optional automatic parent checkbox aggregation from child states
- Controlled state support
- Uncontrolled state support
- `disabled`, `readonly`, `required`, and `invalid` support
- Native form compatibility where applicable
- Reset behavior with HTML forms

### Accessibility

- `role="checkbox"` support when not using native input directly
- `aria-checked="true" | "false" | "mixed"`
- `aria-disabled`
- `aria-readonly`
- `aria-required`
- `aria-invalid`
- Label association through native label or explicit labelling APIs
- Description and error message association
- Accessible name calculation support
- Correct announcement of mixed state by assistive technology

### Interaction

- Space toggles checkbox
- Label click toggles checkbox
- Pointer click toggles checkbox
- Prevent interaction when disabled
- Preserve expected readonly behavior
- Focus management support
- Focus-visible state exposure

### Composition

- Standalone checkbox primitive
- Checkbox label primitive or label integration support
- Description primitive or description ID support
- Error message primitive or error ID support
- Group container support
- Parent-child selection composition support
- Hidden input support for form submission when needed

### State exposure

- `data-checked`
- `data-unchecked`
- `data-mixed`
- `data-disabled`
- `data-readonly`
- `data-invalid`
- `data-required`
- `data-focused`
- `data-focus-visible`

## Suggested primitives / parts

### Standalone primitives

- `CheckboxRoot`
- `CheckboxIndicator`
- `CheckboxLabel`
- `CheckboxDescription`
- `CheckboxError`
- `CheckboxHiddenInput`

### Group primitives

- `CheckboxGroup`
- `CheckboxGroupLabel`
- `CheckboxGroupDescription`
- `CheckboxGroupError`
- `CheckboxGroupItem`

## Suggested APIs

### Checkbox root

- `checked?: boolean | 'mixed'`
- `defaultChecked?: boolean | 'mixed'`
- `checkedChange?: (checked: boolean | 'mixed') => void`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean`
- `invalid?: boolean`
- `name?: string`
- `value?: string`
- `id?: string`
- `inputRef?: ElementRef | HTMLElement | HTMLInputElement`
- `aria-label?: string`
- `aria-labelledby?: string`
- `aria-describedby?: string`
- `form?: string`

### Checkbox group

- `value?: string[]`
- `defaultValue?: string[]`
- `valueChange?: (value: string[]) => void`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean`
- `invalid?: boolean`
- `name?: string`
- `orientation?: 'horizontal' | 'vertical'`
- `aria-label?: string`
- `aria-labelledby?: string`
- `aria-describedby?: string`

### Group item

- `value: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `id?: string`

### Angular API contract (required)

- `tngCheckbox` should expose Angular-style bindings:
  - Inputs: `checked`, `defaultChecked`, `disabled`, `readonly`, `required`, `invalid`, `name`, `value`, `id`, `form`
  - Outputs: `checkedChange`
- Group should expose Angular-style bindings:
  - Inputs: `value`, `defaultValue`, `disabled`, `readonly`, `required`, `invalid`, `name`, `orientation`
  - Outputs: `valueChange`
- Checkbox root should implement `ControlValueAccessor` for Angular forms integration
- Must support:
  - `formControl`
  - `formControlName`
  - `ngModel`
- Must support touched/dirty/disabled state propagation from Angular forms API

### Tri-state parent helper API

Optional utility/composition support for aggregate state:

- `childrenValues: string[]`
- `selectedChildrenValues: string[]`
- derived parent state:
  - `false` when none selected
  - `true` when all selected
  - `'mixed'` when partially selected

## State model

### Binary checkbox

- `false` → unchecked
- `true` → checked

### Tri-state checkbox

- `false` → unchecked
- `true` → checked
- `'mixed'` → indeterminate

### Native checkbox mapping (required)

- Use native `<input type="checkbox">` as the primary interaction element whenever possible
- State mapping:
  - `checked=true` → `input.checked = true`, `input.indeterminate = false`, `aria-checked="true"`
  - `checked=false` → `input.checked = false`, `input.indeterminate = false`, `aria-checked="false"`
  - `checked='mixed'` → `input.checked = false`, `input.indeterminate = true`, `aria-checked="mixed"`
- `indeterminate` must be set as a DOM property, not as an HTML attribute
- Re-apply `indeterminate` after render updates and after form reset handling

## Keyboard interaction

- `Tab`: Moves focus to checkbox
- `Space`: Toggles checkbox state
- `Shift + Tab`: Moves focus away in reverse order

Notes:

- Enter is generally not required for checkbox activation
- For tri-state parent checkbox, toggle behavior must be defined consistently

## Readonly behavior (decision)

- Readonly checkbox remains focusable
- Readonly checkbox does not toggle from:
  - Space key
  - Pointer click
  - Label click
- Readonly state should still expose semantic state through `aria-readonly="true"` when using custom role-based checkbox

## Tri-state behavior recommendations

For a parent “select all” checkbox:

- If none of the child items are selected, parent is `unchecked`
- If all child items are selected, parent is `checked`
- If only some child items are selected, parent is `mixed`

Recommended toggle behavior for parent checkbox:

- From `unchecked` → toggle to `checked` and select all children
- From `checked` → toggle to `unchecked` and clear all children
- From `mixed` → toggle to `checked` and select all children

This behavior is predictable and aligns with common product expectations.

## Accessibility notes

- Prefer native `<input type="checkbox">` behavior where possible
- When using custom rendering, preserve semantic checkbox behavior fully
- Mixed state must be represented with `aria-checked="mixed"`
- Visual indeterminate state alone is not sufficient
- Label text should provide the primary accessible name
- Description and error messaging should be linked programmatically

## Form behavior

- Checkbox should integrate with native form submission
- Unchecked checkboxes do not submit values in native HTML forms
- Checked checkbox submits its value
- Hidden input strategy may be required for custom headless implementations
- Form reset should restore `defaultChecked` / initial state

## Open design decisions

- Whether `mixed` is allowed as an uncontrolled initial state for standalone checkbox
- Whether group API should be fully separate from standalone checkbox API
- Whether parent-child aggregation belongs in core primitive or helper utilities
- Whether hidden input should be automatic or opt-in

## Test checklist

### Rendering

- [ ] Renders an unchecked checkbox by default
- [ ] Renders a checked checkbox when `checked=true`
- [ ] Renders a mixed checkbox when `checked='mixed'`
- [ ] Renders disabled state correctly
- [ ] Renders readonly state correctly
- [ ] Renders required state correctly
- [ ] Renders invalid state correctly
- [ ] Renders associated label text correctly
- [ ] Renders associated description correctly
- [ ] Renders associated error message correctly

### Accessibility

- [ ] Exposes correct checkbox role when custom root is used
- [ ] Exposes `aria-checked='false'` for unchecked state
- [ ] Exposes `aria-checked='true'` for checked state
- [ ] Exposes `aria-checked='mixed'` for mixed state
- [ ] Exposes `aria-disabled` when disabled
- [ ] Exposes `aria-readonly` when readonly
- [ ] Exposes `aria-required` when required
- [ ] Exposes `aria-invalid` when invalid
- [ ] Computes accessible name from label correctly
- [ ] Associates description through `aria-describedby`
- [ ] Associates error message through `aria-describedby`

### Keyboard interaction

- [ ] Focuses with Tab
- [ ] Toggles from unchecked to checked with Space
- [ ] Toggles from checked to unchecked with Space
- [ ] Toggles from mixed to checked with Space for tri-state parent behavior
- [ ] Does not toggle when disabled
- [ ] Does not toggle when readonly
- [ ] Retains focus-visible state after keyboard focus

### Pointer and label interaction

- [ ] Toggles on direct click
- [ ] Toggles when clicking the label
- [ ] Does not toggle on click when disabled
- [ ] Does not toggle on click when readonly

### Controlled behavior

- [ ] Supports controlled checked state
- [ ] Calls `checkedChange` with `true`
- [ ] Calls `checkedChange` with `false`
- [ ] Calls `checkedChange` with `'mixed'` where supported
- [ ] Does not change visual state without controlled prop update

### Uncontrolled behavior

- [ ] Supports `defaultChecked=false`
- [ ] Supports `defaultChecked=true`
- [ ] Supports `defaultChecked='mixed'` if allowed
- [ ] Updates internal state on user interaction

### Group behavior

- [ ] Supports multiple selected values in group
- [ ] Adds value to group when item is checked
- [ ] Removes value from group when item is unchecked
- [ ] Supports disabled group state
- [ ] Supports readonly group state
- [ ] Supports required group state
- [ ] Supports invalid group state

### Parent-child tri-state behavior

- [ ] Parent becomes unchecked when no child is selected
- [ ] Parent becomes checked when all children are selected
- [ ] Parent becomes mixed when some children are selected
- [ ] Toggling parent from unchecked selects all children
- [ ] Toggling parent from checked clears all children
- [ ] Toggling parent from mixed selects all children

### Form integration

- [ ] Submits value when checked
- [ ] Does not submit value when unchecked
- [ ] Preserves name and value for native form submission
- [ ] Resets to initial state on form reset
- [ ] Works with hidden input strategy when custom root is used

### Data attributes

- [ ] Applies `data-checked` in checked state
- [ ] Applies `data-unchecked` in unchecked state
- [ ] Applies `data-mixed` in mixed state
- [ ] Applies `data-disabled` in disabled state
- [ ] Applies `data-readonly` in readonly state
- [ ] Applies `data-invalid` in invalid state
- [ ] Applies `data-required` in required state
- [ ] Applies `data-focused` on focus
- [ ] Applies `data-focus-visible` on keyboard focus

### Angular forms integration

- [ ] Works with `formControl`
- [ ] Works with `formControlName`
- [ ] Works with `ngModel`
- [ ] Propagates touched state correctly (`onTouched`)
- [ ] Propagates disabled state from Angular forms API
- [ ] Group integration works with reactive forms arrays/models

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-checkbox>` component created in `components`
6. [x] Test cases created for `<tng-checkbox>`
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add checkbox`)
14. [x] `tailng-cli` command generation added for checkbox artifacts
15. [x] CLI integration tests added for `tailng add checkbox`

## Links

- Playground: `/checkbox`
