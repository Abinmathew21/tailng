# Radio

Headless radio group primitive for single selection from a list of mutually exclusive options.

## Overview

Radio is a headless selection control used when the user must choose exactly one option from a defined set.
It is typically presented as a radio group with multiple radio items that share a common value model and keyboard interaction pattern.

This component should provide accessibility, keyboard navigation, selection management, Angular forms integration, and signal-first Angular 21+ compatible APIs, while leaving rendering and styling to the consumer or to a higher-level styled component.

## Supported states

- `checked`
- `unchecked`
- `disabled`
- `readonly`
- `required`
- `invalid`
- `focused`
- `focus-visible`

## Common use cases

- Choosing one option from a short list
- Selecting a payment method
- Choosing a shipping method
- Selecting a preference or mode
- Picking one value in settings or filters
- Survey or questionnaire single-choice answers

## Headless component goals

- Provide accessible radio group semantics
- Support exactly one selected value within a group
- Support controlled and uncontrolled APIs
- Support signal-first Angular 21+ component APIs
- Support keyboard navigation between radio items
- Support Angular forms integration
- Support label association and description/error wiring
- Expose state for custom rendering and styling
- Work as a standalone radio group abstraction with composable radio items

## Required headless features

### Core behavior

- Single-selection radio group behavior
- Controlled value support
- Uncontrolled value support
- Group-level `disabled`, `readonly`, `required`, and `invalid` support
- Item-level `disabled` support
- Optional initial default selection
- Native form compatibility where applicable
- Reset behavior with HTML forms

### Accessibility

- `role="radiogroup"` support for custom group root when needed
- `role="radio"` support for custom radio items when not using native input directly
- `aria-checked` on custom radio items
- `aria-disabled`
- `aria-readonly`
- `aria-required`
- `aria-invalid`
- Group label association through native label patterns or explicit labelling APIs
- Description and error message association at group level
- Accessible name calculation support for group and item labels
- Correct screen reader announcement of selected state

### Interaction

- Arrow key navigation between radio items
- Space checks focused item
- Optional click-to-select behavior on item root and label
- Prevent interaction when disabled
- Preserve expected readonly behavior
- Focus management support
- Focus-visible state exposure

### Composition

- Radio group primitive
- Radio item primitive
- Radio indicator primitive
- Label integration support
- Description primitive or description ID support
- Error message primitive or error ID support
- Hidden input or native input support for form submission when needed

### State exposure

- `data-checked`
- `data-unchecked`
- `data-disabled`
- `data-readonly`
- `data-invalid`
- `data-required`
- `data-focused`
- `data-focus-visible`

## Suggested primitives / parts

### Group primitives

- `RadioGroup`
- `RadioGroupLabel`
- `RadioGroupDescription`
- `RadioGroupError`

### Item primitives

- `RadioItem`
- `RadioIndicator`
- `RadioLabel`
- `RadioHiddenInput`

## Suggested APIs

### Radio group

Framework-neutral headless contract:

- `value?: string`
- `defaultValue?: string`
- `valueChange?: (value: string) => void`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean`
- `invalid?: boolean`
- `name?: string`
- `orientation?: 'horizontal' | 'vertical'`
- `loop?: boolean`
- `id?: string`
- `aria-label?: string`
- `aria-labelledby?: string`
- `aria-describedby?: string`
- `form?: string`

### Radio item

- `value: string`
- `disabled?: boolean`
- `id?: string`
- `inputRef?: ElementRef | HTMLElement | HTMLInputElement`

## Angular API contract (required)

For TailNG signal-first Angular 21+ components, the Angular-facing primitive/component contract should align with signal APIs and Angular forms.

### Signal-first Angular API expectations

- Use signal-based inputs for component configuration
- Use Angular-style outputs for change events
- Prefer `value` + `valueChange` naming over `onValueChange`
- Keep APIs compatible with two-way binding patterns where appropriate
- Avoid decorator-first legacy patterns in new component design unless needed for compatibility

### Angular integration requirements

- Support ControlValueAccessor for Angular forms interoperability
- Support `formControl`
- Support `formControlName`
- Support `ngModel` where TailNG still chooses to expose compatibility
- Sync disabled state from Angular forms into the component
- Mark control as touched on appropriate blur interaction
- Preserve dirty/pristine behavior through value updates
- Preserve validation state mapping for required and invalid usage

### Angular value contract

- External value type: `string`
- `valueChange` should emit the selected item value
- Group state should expose one selected value at a time
- Internal focus management must not change the external value contract

## State model

### Group state

- no selected value → no radio checked
- selected value equals one item value → that item checked

### Item state

- `checked`
- `unchecked`
- `disabled`
- `focused`

## Keyboard interaction

- `Tab`: Moves focus into the radio group
- `Shift + Tab`: Moves focus away in reverse order
- `ArrowRight` / `ArrowDown`: Moves focus to next radio item and selects it
- `ArrowLeft` / `ArrowUp`: Moves focus to previous radio item and selects it
- `Space`: Selects focused radio item

Notes:

- Only one radio item can be checked at a time
- Arrow-key behavior should align with WAI-ARIA radio group expectations
- Looping from last to first item may be configurable
- Readonly behavior should prevent value changes while still allowing focus if supported

## Selection behavior recommendations

- Selecting one item must unselect the previously selected item
- Clicking an already selected item should keep it selected
- Radios should not toggle off to “no selection” through normal item activation once one is selected, unless explicitly designed otherwise
- If a default value is provided, matching item should be initially checked
- Focus movement should not create ambiguous selection state

## Readonly behavior decision

Recommended readonly behavior:

- Allow focus
- Allow screen reader navigation
- Prevent value changes from keyboard and pointer interaction
- Preserve readonly semantics without making the control unavailable to assistive technology

## Accessibility notes

- Prefer native `<input type="radio">` behavior where possible
- When using custom rendering, preserve radiogroup and radio semantics fully
- Group should expose a clear accessible label
- Each item should expose a label that clearly identifies the option
- Description and error messaging should be linked programmatically at group level
- Invalid and required states should be exposed in a way assistive technology can interpret reliably

## Form behavior

- Radio group should integrate with native form submission
- Selected radio submits its value under the shared group `name`
- Unselected radios do not submit values
- Hidden input or native input strategy may be required for custom headless implementations
- Form reset should restore `defaultValue` / initial state

## Open design decisions

- Whether readonly should be supported in the primitive or only at styled/component level
- Whether looped arrow navigation should be enabled by default
- Whether selection should follow focus for all arrow movements by default
- Whether item root click and label click should always proxy to selection
- Whether hidden input should be automatic or opt-in

## Test checklist

### Rendering

- [ ] Renders radio group correctly
- [ ] Renders radio items correctly
- [ ] Renders unchecked items by default
- [ ] Renders checked item when `value` matches item
- [ ] Renders checked item from `defaultValue`
- [ ] Renders disabled group state correctly
- [ ] Renders disabled item state correctly
- [ ] Renders readonly state correctly
- [ ] Renders required state correctly
- [ ] Renders invalid state correctly
- [ ] Renders associated group label correctly
- [ ] Renders associated description correctly
- [ ] Renders associated error message correctly

### Accessibility

- [ ] Exposes correct radiogroup role when custom group root is used
- [ ] Exposes correct radio role when custom item root is used
- [ ] Exposes `aria-checked='true'` on selected item
- [ ] Exposes `aria-checked='false'` on unselected items
- [ ] Exposes `aria-disabled` when disabled
- [ ] Exposes `aria-readonly` when readonly
- [ ] Exposes `aria-required` when required
- [ ] Exposes `aria-invalid` when invalid
- [ ] Computes accessible name from group label correctly
- [ ] Associates description through `aria-describedby`
- [ ] Associates error message through `aria-describedby`

### Keyboard interaction

- [ ] Focuses radio group with Tab
- [ ] Moves selection to next item with ArrowRight
- [ ] Moves selection to next item with ArrowDown
- [ ] Moves selection to previous item with ArrowLeft
- [ ] Moves selection to previous item with ArrowUp
- [ ] Selects focused item with Space
- [ ] Does not change selection when group is disabled
- [ ] Does not change selection when item is disabled
- [ ] Does not change selection when readonly
- [ ] Retains focus-visible state after keyboard focus
- [ ] Loops navigation when `loop=true`
- [ ] Does not loop navigation when `loop=false`

### Pointer and label interaction

- [ ] Selects item on direct click
- [ ] Selects item when clicking the label
- [ ] Does not change selection on click when group is disabled
- [ ] Does not change selection on click when item is disabled
- [ ] Does not change selection on click when readonly
- [ ] Keeps selected item selected when clicked again

### Controlled behavior

- [ ] Supports controlled value state
- [ ] Calls `valueChange` with selected item value
- [ ] Does not change visual state without controlled prop update

### Uncontrolled behavior

- [ ] Supports `defaultValue`
- [ ] Updates internal state on keyboard selection
- [ ] Updates internal state on pointer selection

### Angular forms integration

- [ ] Works with ControlValueAccessor
- [ ] Works with `formControl`
- [ ] Works with `formControlName`
- [ ] Works with `ngModel` if supported
- [ ] Marks control as touched on blur
- [ ] Syncs disabled state from Angular forms
- [ ] Preserves dirty/pristine behavior correctly
- [ ] Exposes validation state correctly to Angular forms consumers

### Group behavior

- [ ] Allows only one selected item at a time
- [ ] Unselects previous item when a new item is selected
- [ ] Preserves shared group name for all items
- [ ] Supports horizontal orientation
- [ ] Supports vertical orientation

### Form integration

- [ ] Submits selected value under shared name
- [ ] Does not submit value when no item is selected
- [ ] Resets to initial state on form reset
- [ ] Works with hidden input strategy when custom root is used

### Data attributes

- [ ] Applies `data-checked` on selected item
- [ ] Applies `data-unchecked` on unselected item
- [ ] Applies `data-disabled` in disabled state
- [ ] Applies `data-readonly` in readonly state
- [ ] Applies `data-invalid` in invalid state
- [ ] Applies `data-required` in required state
- [ ] Applies `data-focused` on focus
- [ ] Applies `data-focus-visible` on keyboard focus

## Implementation Steps

- [ ] Headless component created in `primitives`
- [ ] Test cases created for headless
- [ ] Headless example page added/updated in playground - plain CSS app
- [ ] Headless example page added/updated in playground - Tailwind app
- [ ] Minimum style `<tng-radio>` component created in `components`
- [ ] Test cases created for `<tng-radio>`
- [ ] Component example page added/updated in playground - plain CSS app
- [ ] Component example page added/updated in playground - Tailwind app
- [ ] Docs added/updated in docs project - Overview section
- [ ] Docs added/updated in docs project - API section
- [ ] Docs added/updated in docs project - Styling section
- [ ] Docs added/updated in docs project - Example section
- [ ] Registry templates added in registry
- [ ] `tailng add radio` command generation added
- [ ] CLI integration tests added for `tailng add radio`

## Links

- Playground: `/radio`