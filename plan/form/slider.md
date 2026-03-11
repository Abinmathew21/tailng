# Slider

Range-based input.

## Overview

Control for selecting a value (or range) on a track. Drag, arrow keys, or click on track; optional min/max/step and labels.

## Key points

- Single value or range (dual thumbs); optional ticks or labels.
- Keyboard: arrows adjust value; Home/End for min/max.
- Accessible value announcement and optional input for exact value.

## Links

- Playground: `/slider`

# Slider

Headless slider primitive for selecting a single value or a bounded range across a continuous or stepped track.

## Overview

Slider is a headless range-based input control used to select one value or multiple thumb values within a defined minimum and maximum.
It is commonly used for quantities, percentages, media timelines, price ranges, and visual adjustments where dragging or keyboard stepping is more natural than plain text entry.

This component should provide accessibility, pointer and keyboard interaction, value clamping, Angular forms integration, and signal-first Angular 21+ compatible APIs, while leaving rendering and styling to the consumer or to a higher-level styled component.

## Supported states

- `idle`
- `dragging`
- `disabled`
- `readonly`
- `required`
- `invalid`
- `focused`
- `focus-visible`

## Common use cases

- Volume or media position controls
- Brightness or opacity adjustment
- Percentage selection
- Single numeric value selection within a range
- Dual-thumb price range filtering
- Time or progress scrubbing

## Headless component goals

- Provide accessible slider semantics
- Support single-value and multi-thumb range behavior
- Support controlled and uncontrolled APIs
- Support signal-first Angular 21+ component APIs
- Support pointer, keyboard, and track interactions
- Support Angular forms integration
- Support label association and description/error wiring
- Expose state for custom rendering and styling
- Support continuous and stepped values

## Required headless features

### Core behavior

- Single-thumb slider support
- Multi-thumb slider support
- Configurable `min`, `max`, and `step`
- Value clamping within range
- Optional custom step rounding strategy
- Controlled value support
- Uncontrolled value support
- Range ordering rules for multi-thumb sliders
- Optional minimum steps gap between thumbs
- `disabled`, `readonly`, `required`, and `invalid` support
- Native form compatibility where applicable
- Reset behavior with HTML forms

### Accessibility

- `role="slider"` support for custom thumb elements when not using native range input directly
- `aria-valuemin`
- `aria-valuemax`
- `aria-valuenow`
- `aria-valuetext` when needed
- `aria-orientation`
- `aria-disabled`
- `aria-readonly`
- `aria-required`
- `aria-invalid`
- Label association through native labelling patterns or explicit labelling APIs
- Description and error message association
- Accessible name calculation support
- Correct announcement of thumb position and value

### Interaction

- Drag thumb with pointer input
- Click or press track to move nearest thumb where supported
- Arrow keys adjust by one step
- PageUp / PageDown adjust by larger increment where supported
- Home moves to minimum
- End moves to maximum
- Prevent interaction when disabled
- Preserve expected readonly behavior
- Focus management support
- Focus-visible state exposure

### Composition

- Slider root primitive
- Slider track primitive
- Slider range primitive
- Slider thumb primitive
- Hidden input support for form submission when needed
- Label integration support
- Description primitive or description ID support
- Error message primitive or error ID support
- Tick mark / mark support where needed

### State exposure

- `data-disabled`
- `data-readonly`
- `data-invalid`
- `data-required`
- `data-dragging`
- `data-focused`
- `data-focus-visible`
- `data-orientation`

## Suggested primitives / parts

- `SliderRoot`
- `SliderTrack`
- `SliderRange`
- `SliderThumb`
- `SliderHiddenInput`
- `SliderLabel`
- `SliderDescription`
- `SliderError`
- `SliderMark`

## Suggested APIs

### Slider root

Framework-neutral headless contract:

- `value?: number | number[]`
- `defaultValue?: number | number[]`
- `valueChange?: (value: number | number[]) => void`
- `min?: number`
- `max?: number`
- `step?: number`
- `minStepsBetweenThumbs?: number`
- `orientation?: 'horizontal' | 'vertical'`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean`
- `invalid?: boolean`
- `name?: string`
- `id?: string`
- `aria-label?: string`
- `aria-labelledby?: string`
- `aria-describedby?: string`
- `getAriaValueText?: (value: number, index?: number) => string`
- `form?: string`

### Slider thumb

- `index: number`
- `disabled?: boolean`
- `id?: string`
- `inputRef?: ElementRef | HTMLElement | HTMLInputElement`

### Slider mark

- `value: number`
- `label?: string`

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

- External value type: `number | number[]`
- Single-thumb sliders should expose one numeric value
- Multi-thumb sliders should expose ordered numeric array values
- `valueChange` should emit the full current value model
- Internal drag state must not change the external value contract

## State model

### Single-thumb slider

- one numeric value between `min` and `max`

### Multi-thumb slider

- ordered numeric values between `min` and `max`
- each thumb value respects clamping and step constraints
- thumbs must respect ordering and minimum gap rules when configured

## Keyboard interaction

- `Tab`: Moves focus into the slider thumb according to tab order
- `Shift + Tab`: Moves focus away in reverse order
- `ArrowRight` / `ArrowUp`: Increases value by one step
- `ArrowLeft` / `ArrowDown`: Decreases value by one step
- `PageUp`: Increases value by a larger increment where supported
- `PageDown`: Decreases value by a larger increment where supported
- `Home`: Moves thumb to minimum
- `End`: Moves thumb to maximum

Notes:

- Keyboard behavior should align with WAI-ARIA slider expectations
- For vertical sliders, visual direction must remain consistent with announced value behavior
- Multi-thumb focus order should remain stable and predictable

## Behavior recommendations

- Dragging should clamp values within min/max bounds
- Track click should move the nearest eligible thumb when enabled
- Multi-thumb sliders should prevent thumb crossover unless explicitly designed otherwise
- Value rounding should be consistent when step is provided
- Emitted values should stay normalized and ordered for range sliders

## Readonly behavior decision

Recommended readonly behavior:

- Allow focus
- Allow screen reader navigation
- Prevent value changes from keyboard, pointer, and drag interaction
- Preserve readonly semantics without making the control unavailable to assistive technology

## Accessibility notes

- Prefer native input behavior where feasible for simpler slider cases
- When using custom rendering, preserve slider semantics fully on each thumb
- Each thumb should expose a clear accessible name where multiple thumbs exist
- `aria-valuetext` should be supported for human-friendly labels such as currency or percentages
- Description and error messaging should be linked programmatically
- Invalid and required states should be exposed in a way assistive technology can interpret reliably

## Form behavior

- Slider should integrate with native form submission when appropriate
- Single-value slider submits one value under the configured name
- Multi-thumb slider may require a hidden input strategy for submission
- Form reset should restore `defaultValue` / initial state

## Open design decisions

- Whether track click should always move the nearest thumb or be configurable
- Whether PageUp / PageDown increments should default to 10 steps or a custom ratio
- Whether multi-thumb sliders should support thumb crossover
- Whether hidden inputs for range sliders should be automatic or opt-in
- Whether vertical orientation should support reversed visual direction options

## Test checklist

### Rendering

- [ ] Renders slider root correctly
- [ ] Renders track correctly
- [ ] Renders thumb correctly
- [ ] Renders range segment correctly
- [ ] Renders one thumb for single-value slider
- [ ] Renders multiple thumbs for range slider
- [ ] Renders disabled state correctly
- [ ] Renders readonly state correctly
- [ ] Renders required state correctly
- [ ] Renders invalid state correctly
- [ ] Renders associated label correctly
- [ ] Renders associated description correctly
- [ ] Renders associated error message correctly

### Accessibility

- [ ] Exposes correct slider role when custom thumb is used
- [ ] Exposes `aria-valuemin` correctly
- [ ] Exposes `aria-valuemax` correctly
- [ ] Exposes `aria-valuenow` correctly
- [ ] Exposes `aria-valuetext` when configured
- [ ] Exposes `aria-orientation` correctly
- [ ] Exposes `aria-disabled` when disabled
- [ ] Exposes `aria-readonly` when readonly
- [ ] Exposes `aria-required` when required
- [ ] Exposes `aria-invalid` when invalid
- [ ] Computes accessible name correctly
- [ ] Associates description through `aria-describedby`
- [ ] Associates error message through `aria-describedby`

### Keyboard interaction

- [ ] Focuses thumb with Tab
- [ ] Increases value with ArrowRight
- [ ] Increases value with ArrowUp
- [ ] Decreases value with ArrowLeft
- [ ] Decreases value with ArrowDown
- [ ] Increases value with PageUp where supported
- [ ] Decreases value with PageDown where supported
- [ ] Moves value to minimum with Home
- [ ] Moves value to maximum with End
- [ ] Does not change value when disabled
- [ ] Does not change value when readonly
- [ ] Retains focus-visible state after keyboard focus

### Pointer and drag interaction

- [ ] Starts drag on thumb pointer interaction
- [ ] Updates value during drag
- [ ] Ends drag correctly on pointer release
- [ ] Clamps value within min/max during drag
- [ ] Moves nearest thumb on track click when enabled
- [ ] Does not change value on pointer interaction when disabled
- [ ] Does not change value on pointer interaction when readonly

### Controlled behavior

- [ ] Supports controlled value state
- [ ] Calls `valueChange` with numeric value for single slider
- [ ] Calls `valueChange` with numeric array for range slider
- [ ] Does not change visual state without controlled prop update

### Uncontrolled behavior

- [ ] Supports `defaultValue` for single slider
- [ ] Supports `defaultValue` for range slider
- [ ] Updates internal state on keyboard interaction
- [ ] Updates internal state on pointer interaction
- [ ] Resets to initial uncontrolled value on form reset

### Angular forms integration

- [ ] Works with ControlValueAccessor
- [ ] Works with `formControl`
- [ ] Works with `formControlName`
- [ ] Works with `ngModel` if supported
- [ ] Marks control as touched on blur
- [ ] Syncs disabled state from Angular forms
- [ ] Preserves dirty/pristine behavior correctly
- [ ] Exposes validation state correctly to Angular forms consumers

### Range behavior

- [ ] Keeps range values ordered
- [ ] Prevents thumb crossover when not allowed
- [ ] Respects `minStepsBetweenThumbs` when configured
- [ ] Moves only the intended thumb during interaction
- [ ] Emits normalized ordered values for range slider

### Form integration

- [ ] Submits selected value for single slider
- [ ] Preserves name for native form submission
- [ ] Resets to initial state on form reset
- [ ] Works with hidden input strategy for range slider when custom root is used

### Data attributes

- [ ] Applies `data-disabled` in disabled state
- [ ] Applies `data-readonly` in readonly state
- [ ] Applies `data-invalid` in invalid state
- [ ] Applies `data-required` in required state
- [ ] Applies `data-dragging` during drag
- [ ] Applies `data-focused` on focus
- [ ] Applies `data-focus-visible` on keyboard focus
- [ ] Applies `data-orientation` correctly

## Implementation Steps

- [ ] Headless component created in `primitives`
- [ ] Test cases created for headless
- [ ] Headless example page added/updated in playground - plain CSS app
- [ ] Headless example page added/updated in playground - Tailwind app
- [ ] Minimum style `<tng-slider>` component created in `components`
- [ ] Test cases created for `<tng-slider>`
- [ ] Component example page added/updated in playground - plain CSS app
- [ ] Component example page added/updated in playground - Tailwind app
- [ ] Docs added/updated in docs project - Overview section
- [ ] Docs added/updated in docs project - API section
- [ ] Docs added/updated in docs project - Styling section
- [ ] Docs added/updated in docs project - Example section
- [ ] Registry templates added in registry
- [ ] `tailng add slider` command generation added
- [ ] CLI integration tests added for `tailng add slider`

## Links

- Playground: `/slider`