# Toggle

Headless toggle primitive for a two-state button (pressed / unpressed), commonly used in toolbars and as icon buttons.

## Overview

Toggle is a headless control that behaves as a button with a persistent pressed state. It is typically used for toolbar actions (e.g. bold, italic) or mode switches where the visual state reflects on/off. It is often icon-only but can show labels or on/off icons. State can be controlled or uncontrolled and may sync with an external model.

This component should expose behavior, accessibility, and state management clearly, while leaving visual styling to the consumer or to higher-level styled components.

## Supported states

- `pressed`
- `unpressed`
- `disabled`
- `focused`
- `focus-visible`

## Common use cases

- Toolbar actions (bold, italic, underline)
- Icon-only toggles in toolbars or menus
- Mode switches (e.g. grid/list view)
- Optional on/off icons or labels
- Composing inside a toolbar, dropdown, or menu
- Toggle groups (multiple independent or single-selection toggles)

## Headless component goals

- Provide accessible button semantics with `aria-pressed`
- Support two-state (pressed/unpressed) behavior only
- Support controlled and uncontrolled APIs
- Support optional form integration where applicable
- Support label and description wiring
- Support keyboard (Space, Enter) and pointer interactions
- Expose state for custom rendering and styling
- Work standalone or inside a toggle group container

## Required headless features

### Core behavior

- Two-state toggle support (pressed / unpressed)
- Controlled state support
- Uncontrolled state support (`defaultPressed`)
- `disabled` support
- Native `<button type="button">` or equivalent semantics
- Optional: reset behavior with HTML forms

### Accessibility

- `role="button"` (implicit when using native button)
- `aria-pressed="true" | "false"`
- `aria-disabled` when disabled
- Label association (native or explicit labelling APIs)
- Optional description association
- Accessible name calculation support

### Interaction

- Space toggles pressed state
- Enter toggles pressed state
- Pointer click toggles pressed state
- Prevent interaction when disabled
- Focus management and focus-visible state exposure

### Composition

- Standalone toggle primitive
- Optional toggle label or icon slots
- Optional group container (e.g. `role="group"`, `aria-label`) for grouping multiple toggles
- Composes with toolbar, dropdown, or menu patterns

### State exposure

- `data-state="on" | "off"` (or `data-pressed` / `data-unpressed` if preferred)
- `data-disabled`
- `data-focused`
- `data-focus-visible`

## Suggested primitives / parts

### Standalone primitives

- `ToggleRoot` (button with `aria-pressed`, hosts `tngToggle`)
- `ToggleIndicator` (optional; for custom on/off icon or visual)
- `ToggleLabel` (optional; for text or accessible name)

### Group primitives (optional)

- `ToggleGroup` (container with `role="group"`, `aria-label`; does not enforce single/multiple selection unless designed as such)

## Suggested APIs

### Toggle root

- `pressed?: boolean`
- `defaultPressed?: boolean`
- `pressedChange?: (pressed: boolean) => void`
- `disabled?: boolean`
- `id?: string`
- `aria-label?: string`
- `aria-labelledby?: string`
- `aria-describedby?: string`
- `type?: 'button'` (default)

### Toggle group (if present)

- `aria-label?: string`
- `aria-labelledby?: string`
- `orientation?: 'horizontal' | 'vertical'` (optional, for toolbar layout hints)

### Angular API contract (required)

- `tngToggle` should expose Angular-style bindings:
  - Inputs: `pressed`, `defaultPressed`, `disabled`, `id`, `ariaLabel`, `ariaLabelledby`, `ariaDescribedby`
  - Outputs: `pressedChange`
- Toggle root should use native `<button type="button">` for semantics and form behavior
- Optional: implement `ControlValueAccessor` for Angular forms integration if toggle is used in form contexts (e.g. `formControlName`)

## State model

- `false` → unpressed, `aria-pressed="false"`, `data-state="off"`
- `true` → pressed, `aria-pressed="true"`, `data-state="on"`

## Keyboard interaction

- `Tab`: Moves focus to toggle
- `Space`: Toggles pressed state
- `Enter`: Toggles pressed state
- `Shift + Tab`: Moves focus away in reverse order

## Accessibility notes

- Use native `<button type="button">` where possible
- Always expose `aria-pressed` to reflect current state
- Ensure visible focus indicator (e.g. via `data-focus-visible`)
- When used in a group, provide an accessible name for the group (e.g. `aria-label` on container)

## Form behavior

- Toggle is primarily an action button with state; form submission is optional
- If integrated with forms: optional hidden input or `ControlValueAccessor` to submit a value when pressed
- Form reset (if supported) should restore `defaultPressed` / initial state

## Open design decisions

- Whether toggle group enforces single-selection (only one pressed) vs. multiple independent toggles
- Whether `ControlValueAccessor` is in scope for toggle
- Whether to support optional `name` / `value` for form submission
- Naming: `data-state="on"|"off"` vs. `data-pressed` / `data-unpressed` (current primitive uses `data-state`)

## Test checklist

### Rendering

- [x] Renders an unpressed toggle by default
- [x] Renders a pressed toggle when `pressed=true`
- [x] Renders disabled state correctly
- [x] Renders as a button (type=button)
- [x] Renders associated label/icon correctly

### Accessibility

- [x] Exposes `aria-pressed="false"` when unpressed
- [x] Exposes `aria-pressed="true"` when pressed
- [x] Exposes `aria-disabled` when disabled
- [x] Computes accessible name from label/aria-label correctly
- [x] Associates description via `aria-describedby` when provided

### Keyboard interaction

- [x] Focuses with Tab
- [x] Toggles from unpressed to pressed with Space
- [x] Toggles from pressed to unpressed with Space
- [x] Toggles from unpressed to pressed with Enter
- [x] Toggles from pressed to unpressed with Enter
- [x] Does not toggle when disabled
- [x] Retains focus-visible state after keyboard focus

### Pointer interaction

- [x] Toggles on click
- [x] Does not toggle on click when disabled

### Controlled behavior

- [x] Supports controlled pressed state
- [x] Calls `pressedChange` with `true` when toggled on
- [x] Calls `pressedChange` with `false` when toggled off
- [x] Does not change visual state without controlled prop update

### Uncontrolled behavior

- [x] Supports `defaultPressed=false`
- [x] Supports `defaultPressed=true`
- [x] Updates internal state on user interaction

### Group behavior (if applicable)

- [x] Toggle group provides role="group" and aria-label
- [x] Toggles inside group retain independent pressed state (or single-selection behavior if designed)

### Data attributes

- [x] Applies `data-state="off"` when unpressed
- [x] Applies `data-state="on"` when pressed
- [x] Applies `data-disabled` when disabled
- [x] Applies `data-focused` on focus
- [x] Applies `data-focus-visible` on keyboard focus

### Angular forms integration (if applicable)

- [ ] Works with `formControl` / `formControlName` / `ngModel` when ControlValueAccessor is implemented
- [x] Propagates touched and disabled state correctly

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless (controlled/uncontrolled, keyboard, pointer, a11y, data attributes)
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-toggle>` component created in `components` (if not present)
6. [x] Test cases created for `<tng-toggle>`
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add toggle`)
14. [x] `tailng-cli` command generation added for toggle artifacts
15. [x] CLI integration tests added for `tailng add toggle`

## Links

- Playground: `/toggle`

# Toggle

Headless toggle primitive for a two-state pressed button, commonly used for formatting actions, mode controls, and compact command surfaces.

## Overview

Toggle is a headless control that behaves as a button with a persistent pressed state.
It is typically used for toolbar actions such as bold or italic, mode switches such as grid/list view, and compact command surfaces where the visual state reflects on/off.
It is often icon-only but can also show labels or on/off indicators.

This component should provide accessibility, keyboard and pointer interaction, state management, Angular forms integration where supported, and signal-first Angular 21+ compatible APIs, while leaving rendering and styling to the consumer or to a higher-level styled component.

## Supported states

- `pressed`
- `unpressed`
- `disabled`
- `focused`
- `focus-visible`

## Common use cases

- Toolbar actions such as bold, italic, and underline
- Icon-only toggles in toolbars or menus
- Mode switches such as grid/list view
- Optional on/off icons or labels
- Composing inside a toolbar, dropdown, or menu
- Toggle groups with independent or exclusive selection behavior where designed

## Headless component goals

- Provide accessible button semantics with `aria-pressed`
- Support two-state pressed / unpressed behavior only
- Support controlled and uncontrolled APIs
- Support signal-first Angular 21+ component APIs
- Support keyboard and pointer interactions
- Support optional Angular forms integration where in scope
- Support label and description wiring
- Expose state for custom rendering and styling
- Work standalone or inside a toggle group container

## Required headless features

### Core behavior

- Two-state toggle support
- Controlled state support
- Uncontrolled state support
- `disabled` support
- Native `<button type="button">` or equivalent semantics
- Optional reset behavior with HTML forms where supported

### Accessibility

- `role="button"` support, implicit when using native button
- `aria-pressed="true" | "false"`
- `aria-disabled` when disabled
- Label association through native label text or explicit labelling APIs
- Optional description association
- Accessible name calculation support

### Interaction

- Space toggles pressed state
- Enter toggles pressed state
- Pointer click toggles pressed state
- Prevent interaction when disabled
- Focus management support
- Focus-visible state exposure

### Composition

- Standalone toggle primitive
- Optional indicator primitive for custom on/off visuals
- Optional label primitive for visible text or accessible naming
- Optional group container for grouping multiple toggles
- Composition with toolbar, dropdown, or menu patterns

### State exposure

- `data-state="on" | "off"`
- `data-disabled`
- `data-focused`
- `data-focus-visible`

## Suggested primitives / parts

### Standalone primitives

- `ToggleRoot`
- `ToggleIndicator`
- `ToggleLabel`

### Group primitives

- `ToggleGroup`
- `ToggleGroupItem`

## Suggested APIs

### Toggle root

Framework-neutral headless contract:

- `pressed?: boolean`
- `defaultPressed?: boolean`
- `pressedChange?: (pressed: boolean) => void`
- `disabled?: boolean`
- `id?: string`
- `aria-label?: string`
- `aria-labelledby?: string`
- `aria-describedby?: string`
- `type?: 'button'`

### Toggle group

- `value?: string | string[]`
- `defaultValue?: string | string[]`
- `valueChange?: (value: string | string[]) => void`
- `selectionMode?: 'single' | 'multiple'`
- `disabled?: boolean`
- `orientation?: 'horizontal' | 'vertical'`
- `aria-label?: string`
- `aria-labelledby?: string`

### Toggle group item

- `value: string`
- `disabled?: boolean`
- `id?: string`

## Angular API contract (required)

For TailNG signal-first Angular 21+ components, the Angular-facing primitive/component contract should align with signal APIs and Angular forms.

### Signal-first Angular API expectations

- Use signal-based inputs for component configuration
- Use Angular-style outputs for change events
- Prefer `pressed` + `pressedChange` and `value` + `valueChange`
- Keep APIs compatible with two-way binding patterns where appropriate
- Avoid decorator-first legacy patterns in new component design unless needed for compatibility

### Angular integration requirements

- Support ControlValueAccessor where toggle is treated as a boolean form control
- Support `formControl`
- Support `formControlName`
- Support `ngModel` where TailNG still chooses to expose compatibility
- Sync disabled state from Angular forms into the component
- Mark control as touched on appropriate blur interaction
- Preserve dirty/pristine behavior through value updates
- Preserve validation state mapping where form integration is in scope

### Angular value contract

- Standalone toggle external value type: `boolean`
- `pressedChange` should emit the current pressed state
- Group value type should depend on `selectionMode`
- Internal visual state must not change the external value contract

## State model

### Standalone toggle

- `false` → unpressed, `aria-pressed="false"`, `data-state="off"`
- `true` → pressed, `aria-pressed="true"`, `data-state="on"`

### Toggle group

- `selectionMode='single'` → one selected value or no selected value, depending on design
- `selectionMode='multiple'` → array of selected values

## Keyboard interaction

- `Tab`: Moves focus to toggle
- `Space`: Toggles pressed state
- `Enter`: Toggles pressed state
- `Shift + Tab`: Moves focus away in reverse order

## Behavior recommendations

- Standalone toggle should toggle on every valid activation
- Clicking an already pressed standalone toggle should toggle it off
- Toggle group should explicitly support either single or multiple selection mode
- Single-selection toggle group behavior should be defined clearly if allowing deselection of the active item
- Toggle should preserve native button activation semantics wherever possible
- Focus should remain on the toggle after activation unless parent composite behavior defines otherwise

## Readonly / disabled behavior decision

Recommended behavior:

- `disabled` should prevent focus and activation according to native button behavior
- Toggle does not need a dedicated readonly state in the primitive, because it is fundamentally a button-style command control rather than a text-entry control
- If an application requires readonly-like behavior, it should usually be modeled with `disabled` or with higher-level business rules rather than primitive-level readonly semantics

## Accessibility notes

- Use native `<button type="button">` where possible
- Always expose `aria-pressed` to reflect current state
- Ensure visible focus indication through standard focus styling or `data-focus-visible`
- When used in a group, provide an accessible name for the group
- Toggle is a pressed-button pattern, not a switch pattern; settings-style on/off controls may need a dedicated switch component instead

## Form behavior

- Toggle is primarily an action button with state
- When form integration is in scope, toggle may be treated as a boolean form control through ControlValueAccessor
- If native form submission is required, hidden input strategy may be needed
- Form reset should restore `defaultPressed` or initial form-bound value where supported

## Open design decisions

- Whether standalone toggle should support full ControlValueAccessor in the first version
- Whether single-selection toggle groups allow deselecting the currently active item
- Whether toggle group belongs in the same primitive family or should be planned separately
- Whether hidden input support should be automatic or opt-in for form submission scenarios
- Whether `ToggleGroupItem` should be a dedicated primitive or derived from `ToggleRoot`

## Test checklist

### Rendering

- [x] Renders an unpressed toggle by default
- [x] Renders a pressed toggle when `pressed=true`
- [x] Renders disabled state correctly
- [x] Renders as a button with `type='button'`
- [x] Renders associated label or icon correctly

### Accessibility

- [x] Exposes `aria-pressed='false'` when unpressed
- [x] Exposes `aria-pressed='true'` when pressed
- [x] Exposes `aria-disabled` when disabled
- [x] Computes accessible name from visible label or aria attributes correctly
- [x] Associates description through `aria-describedby` when provided

### Keyboard interaction

- [x] Focuses with Tab
- [x] Toggles from unpressed to pressed with Space
- [x] Toggles from pressed to unpressed with Space
- [x] Toggles from unpressed to pressed with Enter
- [x] Toggles from pressed to unpressed with Enter
- [x] Does not toggle when disabled
- [x] Retains focus-visible state after keyboard focus

### Pointer interaction

- [x] Toggles on click
- [x] Does not toggle on click when disabled

### Controlled behavior

- [x] Supports controlled pressed state
- [x] Calls `pressedChange` with `true` when toggled on
- [x] Calls `pressedChange` with `false` when toggled off
- [x] Does not change visual state without controlled prop update

### Uncontrolled behavior

- [x] Supports `defaultPressed=false`
- [x] Supports `defaultPressed=true`
- [x] Updates internal state on user interaction

### Group behavior

- [x] Supports `selectionMode='single'` when group is enabled
- [x] Supports `selectionMode='multiple'` when group is enabled
- [x] Preserves shared group labeling correctly
- [x] Updates selected value correctly in single mode
- [x] Updates selected values correctly in multiple mode
- [x] Respects disabled group state
- [x] Respects disabled item state

### Angular forms integration

- [x] Works with ControlValueAccessor when supported
- [x] Works with `formControl`
- [x] Works with `formControlName`
- [ ] Works with `ngModel` if supported
- [x] Marks control as touched on blur
- [x] Syncs disabled state from Angular forms
- [x] Preserves dirty/pristine behavior correctly
- [x] Exposes validation state correctly when form integration is in scope

### Data attributes

- [x] Applies `data-state='off'` when unpressed
- [x] Applies `data-state='on'` when pressed
- [x] Applies `data-disabled` when disabled
- [x] Applies `data-focused` on focus
- [x] Applies `data-focus-visible` on keyboard focus

## Implementation Steps

- [x] Headless component created in `primitives`
- [x] Test cases created for headless
- [x] Headless example page added/updated in playground - plain CSS app
- [x] Headless example page added/updated in playground - Tailwind app
- [x] Minimum style `<tng-toggle>` component created in `components`
- [x] Test cases created for `<tng-toggle>`
- [x] Component example page added/updated in playground - plain CSS app
- [x] Component example page added/updated in playground - Tailwind app
- [x] Docs added/updated in docs project - Overview section
- [x] Docs added/updated in docs project - API section
- [x] Docs added/updated in docs project - Styling section
- [x] Docs added/updated in docs project - Example section
- [x] Registry templates added in registry
- [x] `tailng add toggle` command generation added
- [x] CLI integration tests added for `tailng add toggle`

## Links

- Playground: `/toggle`
