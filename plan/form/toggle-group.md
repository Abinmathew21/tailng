# Toggle Group

Headless toggle group primitive for grouped toggle controls (single or multiple selection).

## Overview

Toggle group is a headless container that holds multiple toggle buttons (see Toggle) and enforces single-selection (one pressed) or multiple-selection (many pressed) behavior. Used for alignment, view mode, or filter options. Each child is a toggle with a value; group exposes value(s) and valueChange. Keyboard navigation and selection; optional disabled items.

This component should expose group value(s), type (single/multiple), and coordination between toggles while leaving visual styling to the consumer.

## Supported states

- Group: value (single) or values (multiple), disabled, orientation
- Per item: pressed (derived from value(s)), disabled
- Focus: one item in tab order; roving tabindex or single tab stop

## Common use cases

- Alignment (left, center, right)
- View mode (list, grid)
- Filter or format options (single or multi)
- Composes with toggle/button primitive
- Optional disabled items

## Headless component goals

- Provide group semantics (role="group", aria-label)
- Support single (one value) or multiple (array of values) selection
- Support controlled and uncontrolled value(s)
- Coordinate child toggles: only one or many pressed based on type
- Keyboard navigation and Enter/Space to toggle
- Expose state for styling
- Support orientation (horizontal/vertical)

## Required headless features

### Core behavior

- ToggleGroup root: value/defaultValue or values/defaultValues, valueChange/valuesChange, type single/multiple
- Registers child toggles (tngToggle) and syncs pressed state from value(s)
- Optional: orientation, disabled group
- Child toggle receives value; group injects and updates value(s) on toggle

### Accessibility

- Group: role="group", aria-label
- Children: aria-pressed from group state
- Roving tabindex or single tab stop; arrows move; Enter/Space toggle
- aria-orientation when applicable

### Interaction

- Click on child toggle updates group value(s)
- In single mode: selecting one deselects others
- In multiple mode: toggle adds/removes value
- Disabled child does not change value

### Composition

- ToggleGroup (container)
- Toggle (button with value) as children
- Optional group label

### State exposure

- data-type (single/multiple), data-orientation on group
- data-disabled on group and items
- Per-item pressed state via data-state or data-pressed

## Suggested primitives / parts

- `ToggleGroupRoot` (e.g. tngToggleGroup)
- Child: Toggle (tngToggle) with value; group coordinates

## Suggested APIs

### Toggle group root

- `value?: string | number` (single) or `values?: (string|number)[]` (multiple)
- `defaultValue?` / `defaultValues?`
- `valueChange?` / `valuesChange?`
- `type?: 'single' | 'multiple'`
- `orientation?: 'horizontal' | 'vertical'`
- `disabled?: boolean`
- `ariaLabel?: string`

### Child toggle

- `value: string | number` (required)
- `disabled?: boolean`
- Pressed state from group (injected)

### Angular API contract (required)

- tngToggleGroup: inputs value, defaultValue, values, defaultValues, type, orientation, disabled; outputs valueChange, valuesChange
- Child tngToggle used with value; group injects and syncs
- Must support both single and multiple type

## Keyboard interaction

- Tab: focus one toggle in group
- Arrows: move focus between toggles
- Enter/Space: toggle focused item (update group value(s))
- Home/End: first/last (optional)

## Accessibility notes

- Group must have accessible name
- Each toggle must have accessible name
- aria-pressed on each toggle must reflect group value(s)
- Orientation should match visual layout

## Form behavior

- Optional: group value(s) bound to form control (ControlValueAccessor for single or multi)
- Form reset restores defaultValue(s)

## Open design decisions

- Whether single mode allows no selection (value null/undefined)
- Toggle group vs. button toggle: same primitive or separate (current codebase has both tngToggleGroup and tngButtonToggleGroup)

## Test checklist

### Rendering

- [ ] Renders group and child toggles
- [ ] Pressed state matches value(s)
- [ ] Single mode: only one pressed
- [ ] Multiple mode: multiple pressed
- [ ] Disabled group/items applied correctly

### Accessibility

- [ ] Group has aria-label
- [ ] Each toggle has aria-pressed
- [ ] Keyboard focus and toggle work

### Keyboard and pointer

- [ ] Arrows move focus; Enter/Space toggle
- [ ] Click updates value(s) correctly
- [ ] Disabled items skipped

### Controlled / uncontrolled

- [ ] Controlled value(s) and valueChange/valuesChange
- [ ] Uncontrolled defaultValue(s) and internal updates

### Data attributes

- [ ] Applies data-type, data-orientation, data-disabled, item data-state

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style toggle-group component created in `components`
6. [ ] Test cases created for toggle-group component
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add toggle-group`)
14. [ ] `tailng-cli` command generation added for toggle-group artifacts
15. [ ] CLI integration tests added for `tailng add toggle-group`

## Links

- Playground: `/toggle-group`
