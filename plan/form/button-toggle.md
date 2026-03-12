# Button Toggle

Headless button-toggle primitive for toggleable button options (single or multiple selection in a group).

## Overview

Button toggle is a headless form control: one or more button-like controls that toggle between pressed and unpressed. Used alone (single toggle) or in a group where one or many can be selected (single-select like radio, or multi-select like checkbox). Often used in toolbars (e.g. bold, italic), view switchers, or filter chips. Pressed state is reflected via aria-pressed and data attributes; optional icon or label per option.

This component should expose behavior, accessibility, and state (value / values) while leaving visual styling to the consumer.

## Supported states

- Per button: pressed / unpressed, disabled, focused, focus-visible
- Group: single or multiple selection; value(s); disabled, readonly
- Orientation: horizontal | vertical
- Direction: ltr | rtl (for keyboard)

## Common use cases

- Toolbar options (bold, italic, underline)
- View mode switcher (list/grid)
- Alignment or format options
- Filter chips (single or multi)
- Composes with menu or toolbar

## Headless component goals

- Provide accessible button semantics with aria-pressed
- Support single-value (one pressed) or multiple-value (many pressed) group mode
- Support controlled and uncontrolled value(s)
- Support keyboard navigation (arrows, Tab) and selection (Enter/Space)
- Support disabled items and disabled group
- Expose state for custom rendering and styling
- Support orientation and RTL

## Required headless features

### Core behavior

- Button toggle group: value (single) or values (multiple), valueChange/valuesChange, type single/multiple
- Button toggle item: value (string/number), pressed state from group
- Controlled and uncontrolled value(s)
- Optional: activation mode (auto select on focus vs. explicit Enter/Space)
- Disabled group and per-item disabled

### Accessibility

- Each button: role="button", aria-pressed="true"|"false", aria-disabled when disabled
- Group: role="group" with aria-label; or toolbar role when in toolbar
- Roving tabindex or single tab stop; arrows move focus; Enter/Space toggle
- Orientation (aria-orientation or implicit from layout)

### Interaction

- Click toggles pressed state (and updates group value)
- Enter/Space toggle when focused
- Arrows move focus between buttons (optional wrap/loop)
- Disabled button does not toggle
- In single mode: selecting one deselects others

### Composition

- ButtonToggleGroup (container)
- ButtonToggle (button with value; used inside group)
- Optional: group label

### State exposure

- data-value, data-pressed (or data-state) per button
- data-disabled per button and group
- data-focused, data-focus-visible
- data-orientation on group

## Suggested primitives / parts

- `ButtonToggleGroup` (e.g. tngButtonToggleGroup)
- `ButtonToggle` (e.g. button[tngButtonToggle] with value)

## Suggested APIs

### Button toggle group

- `value?: string | number` (single) or `values?: (string|number)[]` (multiple)
- `defaultValue?` / `defaultValues?`
- `valueChange?` / `valuesChange?`
- `type?: 'single' | 'multiple'`
- `orientation?: 'horizontal' | 'vertical'`
- `dir?: 'ltr' | 'rtl' | 'auto'`
- `disabled?: boolean`, `readonly?: boolean`
- `ariaLabel?: string`
- Optional: loop (keyboard wrap), activation mode

### Button toggle item

- `value: string | number` (required)
- `disabled?: boolean`
- Pressed state from group (injected)

### Angular API contract (required)

- Group: inputs value, defaultValue, values, defaultValues, type, orientation, dir, disabled, readonly; outputs valueChange, valuesChange
- Item: input value, disabled; must be used inside group
- Item should be native button or have button semantics

## Keyboard interaction

- Tab: focus group (one button in tab order) or focus first/next button
- Arrows: move focus between buttons (and optionally toggle in single mode)
- Enter/Space: toggle focused button
- Home/End: first/last button (optional)
- Loop when configured

## Accessibility notes

- Group must have accessible name (aria-label or group label)
- Each button must have accessible name (text or aria-label)
- aria-pressed must reflect current state
- In toolbar context, consider role="toolbar"

## Form behavior

- Optional: hidden inputs or value array for form submission
- Group value(s) can be bound to form control (ControlValueAccessor)

## Open design decisions

- Whether single mode allows no selection (optional empty value)
- Activation on arrow focus vs. explicit Enter/Space
- SelectBox vs. ButtonToggle naming (selectbox may be same or variant)

## Test checklist

### Rendering

- [x] Renders group and toggle buttons
- [x] Renders pressed state per button from value(s)
- [x] Renders disabled state (group and item)
- [x] Applies data-value, data-pressed, data-disabled, data-orientation

### Accessibility

- [x] Group has aria-label or labelledby
- [x] Each button has aria-pressed
- [x] Disabled buttons have aria-disabled
- [x] Keyboard focus order and roving tabindex correct

### Keyboard interaction

- [x] Arrows move focus between buttons
- [x] Enter/Space toggle focused button
- [x] Single mode: selecting one deselects others
- [x] Disabled buttons skipped

### Pointer interaction

- [x] Click toggles button and updates group value
- [x] Disabled does not toggle

### Controlled / uncontrolled

- [x] Supports controlled value(s)
- [x] Emits valueChange/valuesChange
- [x] Supports defaultValue(s) and updates on interaction

### Data attributes

- [x] Applies data-pressed, data-disabled, data-focused, data-focus-visible

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style button-toggle component created in `components`
6. [x] Test cases created for button-toggle component
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add button-toggle`)
14. [x] `tailng-cli` command generation added for button-toggle artifacts
15. [x] CLI integration tests added for `tailng add button-toggle`

## Links

- Playground: `/button-toggle`
