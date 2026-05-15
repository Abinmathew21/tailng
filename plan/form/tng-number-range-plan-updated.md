# TailNG `tng-number-range` Implementation Plan

## Goal

Create a dedicated TailNG number range component for “between” style numeric selection.

Recommended public selector:

```html
<tng-number-range />
```

Recommended class name:

```ts
TngNumberRange
```

The component should represent two related numeric values:

```ts
export type TngNumberRangeValue = {
  min: number | null;
  max: number | null;
};
```

This should remain separate from `tng-input type="number"` because a range input has two values, cross-field validation, combined accessibility semantics, and different form behavior.

---

## Scope

### In scope

- Create a standalone Angular component for number ranges.
- Support controlled and uncontrolled usage.
- Support nullable `min` and `max` values.
- Support native number input behavior.
- Support validation for range order and boundaries.
- Support disabled and readonly states.
- Support form integration through `ControlValueAccessor`.
- Support TailNG-style slot/class customization.
- Support accessibility labels for the group and individual inputs.
- Add complete unit tests.

### Out of scope for first version

- Slider UI.
- Currency formatting.
- Locale-specific number formatting.
- Thousands separators while typing.
- Floating popover/picker behavior.
- Async validation.
- Complex masking.
- Increment/decrement spinner buttons beyond native input behavior.

---

## Suggested File Structure

TailNG currently separates the **headless primitive input** and the **styled component input**.

Existing headless input location:

```txt
libs/tailng-ui/primitives/src/lib/form/input
```

Existing styled component input location:

```txt
libs/tailng-ui/components/src/lib/form/input
```

Recommended approach: create the number range in both layers, similar to the existing input split.

### Headless primitive location

Use this for the logic-first/headless number range primitive:

```txt
libs/tailng-ui/primitives/src/lib/form/number-range/
  tng-number-range.ts
  tng-number-range.types.ts
  tng-number-range.spec.ts
  index.ts
```

The primitive should own:

- value model
- parsing helpers
- controlled/uncontrolled state behavior
- validation calculation
- accessibility state contracts
- CVA behavior if primitives currently own form integration
- headless directives/classes if that matches the existing primitive input pattern

### Styled component location

Use this for the public styled component:

```txt
libs/tailng-ui/components/src/lib/form/number-range/
  tng-number-range.ts
  tng-number-range.html
  tng-number-range.css
  tng-number-range.spec.ts
  index.ts
```

The component should own:

- rendered DOM structure
- default TailNG styles
- slot/class styling hooks
- integration with the primitive/headless behavior
- public `tng-number-range` selector

### Relationship with existing input folders

Do not modify the existing files unless shared utilities are needed:

```txt
libs/tailng-ui/primitives/src/lib/form/input
libs/tailng-ui/components/src/lib/form/input
```

Keep `tng-input type="number"` as the single-value numeric input.

Add `tng-number-range` as a new two-value range control.

### Public exports

Primitive package export example:

```ts
export * from './lib/form/number-range';
```

Component package export example:

```ts
export * from './lib/form/number-range';
```

## Public API

### Value type

```ts
export type TngNumberRangeValue = {
  min: number | null;
  max: number | null;
};
```

### Change source type

```ts
export type TngNumberRangeSource = 'min' | 'max';
```

### Change event type

```ts
export type TngNumberRangeChangeEvent = {
  value: TngNumberRangeValue;
  source: TngNumberRangeSource;
  valid: boolean;
};
```

### Suggested inputs

```ts
value?: TngNumberRangeValue | null;
defaultValue?: TngNumberRangeValue | null;

min?: number | null;
max?: number | null;
step?: number | 'any';

disabled?: boolean;
readonly?: boolean;
required?: boolean;

minPlaceholder?: string;
maxPlaceholder?: string;

ariaLabel?: string;
ariaLabelledby?: string;
minAriaLabel?: string;
maxAriaLabel?: string;

invalid?: boolean;

separator?: string;

slot?: TngSlotMap<TngNumberRangeSlots>;
```

### Suggested outputs

```ts
valueChange: EventEmitter<TngNumberRangeValue>;
rangeChange: EventEmitter<TngNumberRangeChangeEvent>;
minChange: EventEmitter<number | null>;
maxChange: EventEmitter<number | null>;
```

### Suggested slots

```ts
export type TngNumberRangeSlots =
  | 'root'
  | 'group'
  | 'minInput'
  | 'separator'
  | 'maxInput';
```

---

## Recommended First Version API

Start with a minimal stable API:

```ts
value
defaultValue
min
max
step
disabled
readonly
required
minPlaceholder
maxPlaceholder
ariaLabel
ariaLabelledby
minAriaLabel
maxAriaLabel
separator
slot
valueChange
rangeChange
```

Add `minChange` and `maxChange` only if needed by real usage.

---

## Usage Examples

### Controlled usage

```html
<tng-number-range
  [value]="priceRange()"
  [min]="0"
  [max]="100000"
  [step]="100"
  minPlaceholder="Min"
  maxPlaceholder="Max"
  ariaLabel="Price range"
  (valueChange)="priceRange.set($event)"
/>
```

```ts
priceRange = signal<TngNumberRangeValue>({
  min: null,
  max: null,
});
```

### In a form field

```html
<tng-form-field label="Price range">
  <tng-number-range
    [value]="priceRange()"
    (valueChange)="priceRange.set($event)"
  />
</tng-form-field>
```

### Reactive forms

```html
<form [formGroup]="form">
  <tng-number-range formControlName="priceRange" />
</form>
```

Expected form value:

```ts
{
  min: 100,
  max: 500
}
```

---

## Component Behavior

### Rendering

Render two native number inputs inside a grouped container:

```html
<div class="tng-number-range" role="group">
  <input type="number" />
  <span aria-hidden="true">—</span>
  <input type="number" />
</div>
```

### Value behavior

- Empty input should be represented as `null`.
- Valid numeric input should be represented as `number`.
- Both values can be null.
- One side can be filled while the other side remains null.
- The component should not force `min <= max` while typing unless validation mode later requires strict blocking.
- Prefer “allow typing, report invalid” over “block input”.

### Validation behavior

The component should calculate internal validity using:

```ts
value.min === null || value.min >= min
value.max === null || value.max <= max
value.min === null || value.max === null || value.min <= value.max
```

Validation should not prevent partial input.

### Disabled behavior

- Disabled state should disable both inputs.
- Disabled state should prevent user changes.
- Disabled state should be reflected in host/classes/data attributes.

### Readonly behavior

- Readonly state should apply to both inputs.
- Readonly state should allow focus.
- Readonly state should prevent value editing.

### Accessibility behavior

- Root/group should have `role="group"`.
- Group should be labelled by `ariaLabel` or `ariaLabelledby`.
- Min input should have a clear accessible name.
- Max input should have a clear accessible name.
- Separator should be `aria-hidden="true"`.
- Invalid state should be reflected with `aria-invalid` on both inputs when range is invalid.
- Disabled and readonly states should be reflected correctly.

---

## Implementation Steps

### Step 1: Create types

Create `tng-number-range.types.ts`.

Add:

```ts
export type TngNumberRangeValue = {
  min: number | null;
  max: number | null;
};

export type TngNumberRangeSource = 'min' | 'max';

export type TngNumberRangeChangeEvent = {
  value: TngNumberRangeValue;
  source: TngNumberRangeSource;
  valid: boolean;
};

export type TngNumberRangeSlots =
  | 'root'
  | 'group'
  | 'minInput'
  | 'separator'
  | 'maxInput';
```

---

### Step 2: Create component skeleton

Create standalone component:

```ts
@Component({
  selector: 'tng-number-range',
  standalone: true,
  templateUrl: './tng-number-range.html',
  styleUrl: './tng-number-range.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngNumberRange),
      multi: true,
    },
  ],
})
export class TngNumberRange implements ControlValueAccessor {}
```

Use signal-based inputs where possible.

---

### Step 3: Add internal state

Maintain internal writable value:

```ts
readonly internalValue = signal<TngNumberRangeValue>({
  min: null,
  max: null,
});
```

Resolve current value from controlled `value` input or internal state.

Suggested approach:

- If `[value]` is provided, treat component as controlled.
- If `[value]` is not provided, use internal value initialized from `defaultValue`.
- Always emit `valueChange` when user changes a field.
- Do not mutate object references; emit a fresh object.

---

### Step 4: Add parsing helpers

Create helper methods:

```ts
private parseNumberInput(raw: string): number | null {
  if (raw.trim() === '') {
    return null;
  }

  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : null;
}
```

Also create formatting helper:

```ts
private toInputValue(value: number | null): string {
  return value === null ? '' : String(value);
}
```

---

### Step 5: Add change handlers

Add separate handlers:

```ts
onMinInput(event: Event): void
onMaxInput(event: Event): void
```

Each handler should:

1. Read the raw input value.
2. Convert empty string to `null`.
3. Convert valid number string to `number`.
4. Build a new range object.
5. Update internal state if uncontrolled.
6. Emit `valueChange`.
7. Emit `rangeChange` with source and valid flag.
8. Notify CVA change callback.

---

### Step 6: Add validity calculation

Create computed validity:

```ts
readonly isRangeOrderValid = computed(() => {
  const value = this.currentValue();

  return (
    value.min === null ||
    value.max === null ||
    value.min <= value.max
  );
});
```

Create complete validity:

```ts
readonly isValid = computed(() => {
  const value = this.currentValue();

  const minLimit = this.min();
  const maxLimit = this.max();

  const minValid =
    value.min === null ||
    minLimit === null ||
    value.min >= minLimit;

  const maxValid =
    value.max === null ||
    maxLimit === null ||
    value.max <= maxLimit;

  const orderValid =
    value.min === null ||
    value.max === null ||
    value.min <= value.max;

  return minValid && maxValid && orderValid && !this.invalid();
});
```

---

### Step 7: Add template

Suggested template:

```html
<div
  class="tng-number-range"
  role="group"
  [attr.aria-label]="ariaLabel() || null"
  [attr.aria-labelledby]="ariaLabelledby() || null"
  [attr.data-disabled]="disabled() ? '' : null"
  [attr.data-readonly]="readonly() ? '' : null"
  [attr.data-invalid]="!isValid() ? '' : null"
>
  <input
    class="tng-number-range__input tng-number-range__input--min"
    type="number"
    [value]="minInputValue()"
    [attr.min]="min() ?? null"
    [attr.max]="max() ?? null"
    [attr.step]="step() ?? null"
    [placeholder]="minPlaceholder()"
    [disabled]="disabled()"
    [readOnly]="readonly()"
    [required]="required()"
    [attr.aria-label]="minAriaLabel()"
    [attr.aria-invalid]="!isValid() ? 'true' : null"
    (input)="onMinInput($event)"
    (blur)="onTouched()"
  />

  <span class="tng-number-range__separator" aria-hidden="true">
    {{ separator() }}
  </span>

  <input
    class="tng-number-range__input tng-number-range__input--max"
    type="number"
    [value]="maxInputValue()"
    [attr.min]="min() ?? null"
    [attr.max]="max() ?? null"
    [attr.step]="step() ?? null"
    [placeholder]="maxPlaceholder()"
    [disabled]="disabled()"
    [readOnly]="readonly()"
    [required]="required()"
    [attr.aria-label]="maxAriaLabel()"
    [attr.aria-invalid]="!isValid() ? 'true' : null"
    (input)="onMaxInput($event)"
    (blur)="onTouched()"
  />
</div>
```

Note: adjust syntax according to the existing TailNG coding style and Angular version conventions.

---

### Step 8: Add default styles

Keep styles minimal and theme-friendly.

```css
.tng-number-range {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.tng-number-range__input {
  min-width: 0;
}

.tng-number-range__separator {
  user-select: none;
}

.tng-number-range[data-disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.tng-number-range[data-invalid] .tng-number-range__input {
  border-color: var(--tng-color-danger, currentColor);
}
```

Avoid hardcoded colors if TailNG already has semantic CSS variables.

---

### Step 9: Add CVA support

Implement:

```ts
writeValue(value: TngNumberRangeValue | null): void
registerOnChange(fn: (value: TngNumberRangeValue) => void): void
registerOnTouched(fn: () => void): void
setDisabledState(isDisabled: boolean): void
```

Rules:

- `writeValue(null)` should reset to `{ min: null, max: null }`.
- Invalid external object should be normalized.
- `setDisabledState(true)` should disable both inputs.
- User changes should call registered `onChange`.
- Blur should call registered `onTouched`.

---

### Step 10: Add documentation/demo examples

Add examples for:

- Basic usage.
- Controlled signal usage.
- Reactive forms usage.
- Disabled state.
- Readonly state.
- Validation examples.
- Price filter example.
- Table column filter example.

---

## Recommended Codex Prompt

Use this prompt with Codex:

```txt
Create a new TailNG Angular component named TngNumberRange with selector tng-number-range.

The component should be standalone, signal-based, and should represent a numeric range value:
{ min: number | null; max: number | null }.

Implement it as a separate component, not as tng-input type=number.

Requirements:
- Render two native number inputs, one for min and one for max.
- Support value/defaultValue controlled-uncontrolled usage.
- Support min, max, step, disabled, readonly, required inputs.
- Support minPlaceholder, maxPlaceholder, ariaLabel, ariaLabelledby, minAriaLabel, maxAriaLabel, separator inputs.
- Emit valueChange with the full range object.
- Emit rangeChange with { value, source, valid }.
- Empty input should become null.
- Partial range should be allowed.
- Invalid order min > max should be allowed while typing but reflected as invalid.
- Add role="group" and correct aria labels.
- Separator should be aria-hidden.
- Implement ControlValueAccessor.
- Add tests covering rendering, API, value behavior, validation, accessibility, disabled, readonly, CVA, and edge cases.
- Follow the existing TailNG coding style, typing style, lint rules, and test style.
```

---

# Test Cases

## Rendering

- should create the `tng-number-range` component.
- should render a root range container.
- should render exactly two native number inputs.
- should render the first input as the min input.
- should render the second input as the max input.
- should render the default separator between both inputs.
- should render a custom separator when `separator` is provided.
- should keep the separator hidden from assistive technologies.
- should apply the expected root CSS class.
- should apply the expected min input CSS class.
- should apply the expected max input CSS class.
- should apply the expected separator CSS class.

## Selector and standalone usage

- should be usable through the `tng-number-range` selector.
- should be importable as a standalone Angular component.
- should compile inside a host test component.
- should compile without requiring Angular modules.
- should expose the component from the package public API.

## Default value behavior

- should initialize with `{ min: null, max: null }` when no value is provided.
- should initialize min input as empty when min is null.
- should initialize max input as empty when max is null.
- should initialize min input with the provided default min value.
- should initialize max input with the provided default max value.
- should normalize a null default value to `{ min: null, max: null }`.
- should not emit `valueChange` during initial render.
- should not emit `rangeChange` during initial render.

## Controlled value behavior

- should display the provided controlled min value.
- should display the provided controlled max value.
- should update displayed min value when controlled value changes.
- should update displayed max value when controlled value changes.
- should not mutate the provided controlled value object.
- should emit a fresh value object when the min input changes.
- should emit a fresh value object when the max input changes.
- should preserve max value when only min changes.
- should preserve min value when only max changes.
- should support controlled value changing back to null min.
- should support controlled value changing back to null max.
- should handle a controlled null value by displaying empty inputs.
- should handle a controlled partial value with min only.
- should handle a controlled partial value with max only.

## Uncontrolled value behavior

- should use internal state when no controlled value is provided.
- should update internal min value when min input changes.
- should update internal max value when max input changes.
- should display the updated min value after user input.
- should display the updated max value after user input.
- should preserve max value when min changes in uncontrolled mode.
- should preserve min value when max changes in uncontrolled mode.
- should support clearing min in uncontrolled mode.
- should support clearing max in uncontrolled mode.
- should not reset uncontrolled value after change detection.

## Number parsing

- should parse an integer min value.
- should parse an integer max value.
- should parse a decimal min value.
- should parse a decimal max value.
- should parse a negative min value.
- should parse a negative max value.
- should parse zero as a valid min value.
- should parse zero as a valid max value.
- should convert an empty min input to null.
- should convert an empty max input to null.
- should convert whitespace-only min input to null.
- should convert whitespace-only max input to null.
- should not emit `NaN` for invalid min input.
- should not emit `NaN` for invalid max input.
- should not emit `Infinity` for min input.
- should not emit `Infinity` for max input.
- should not emit `-Infinity` for min input.
- should not emit `-Infinity` for max input.

## Value emission

- should emit `valueChange` when min input changes.
- should emit `valueChange` when max input changes.
- should emit full range value when min input changes.
- should emit full range value when max input changes.
- should emit min as number when min input contains a valid number.
- should emit max as number when max input contains a valid number.
- should emit min as null when min input is cleared.
- should emit max as null when max input is cleared.
- should emit `rangeChange` when min input changes.
- should emit `rangeChange` when max input changes.
- should emit `rangeChange.source` as `min` for min input changes.
- should emit `rangeChange.source` as `max` for max input changes.
- should emit `rangeChange.valid` as true for a valid range.
- should emit `rangeChange.valid` as false for an invalid range.
- should emit events in a predictable order when min changes.
- should emit events in a predictable order when max changes.
- should not emit duplicate `valueChange` events for a single input event.
- should not emit duplicate `rangeChange` events for a single input event.

## Min and max attribute behavior

- should apply the configured `min` attribute to the min input.
- should apply the configured `min` attribute to the max input.
- should apply the configured `max` attribute to the min input.
- should apply the configured `max` attribute to the max input.
- should remove the `min` attribute when min input is null.
- should remove the `max` attribute when max input is null.
- should update the native min attribute when input min changes.
- should update the native max attribute when input max changes.
- should support negative configured min.
- should support decimal configured min.
- should support negative configured max.
- should support decimal configured max.

## Step behavior

- should apply numeric step to both inputs.
- should apply `step="any"` to both inputs.
- should remove the step attribute when no step is configured.
- should update step attribute when step input changes.
- should support decimal step values.
- should not block user input when value does not match step.
- should rely on native number input behavior for step mismatch.

## Placeholder behavior

- should render default min placeholder when provided.
- should render default max placeholder when provided.
- should update min placeholder when input changes.
- should update max placeholder when input changes.
- should allow empty min placeholder.
- should allow empty max placeholder.
- should not use placeholder as accessible label by default.

## Validation: range order

- should be valid when both values are null.
- should be valid when only min is set.
- should be valid when only max is set.
- should be valid when min is less than max.
- should be valid when min equals max.
- should be invalid when min is greater than max.
- should become valid again when min is corrected below max.
- should become valid again when max is corrected above min.
- should become valid when min is cleared from an invalid range.
- should become valid when max is cleared from an invalid range.
- should not prevent typing a min value greater than max.
- should not prevent typing a max value less than min.

## Validation: configured boundaries

- should be valid when min value equals configured lower boundary.
- should be valid when min value is greater than configured lower boundary.
- should be invalid when min value is less than configured lower boundary.
- should be valid when max value equals configured upper boundary.
- should be valid when max value is less than configured upper boundary.
- should be invalid when max value is greater than configured upper boundary.
- should become valid when out-of-bound min is corrected.
- should become valid when out-of-bound max is corrected.
- should allow null min even when lower boundary is configured.
- should allow null max even when upper boundary is configured.
- should recalculate validity when configured lower boundary changes.
- should recalculate validity when configured upper boundary changes.

## External invalid state

- should be invalid when external `invalid` input is true.
- should be valid when external `invalid` input is false and internal validation passes.
- should reflect invalid state on root when external invalid is true.
- should reflect invalid state on min input when external invalid is true.
- should reflect invalid state on max input when external invalid is true.
- should combine external invalid state with internal range-order invalid state.
- should combine external invalid state with internal boundary invalid state.

## Required behavior

- should apply required to min input when required is true.
- should apply required to max input when required is true.
- should remove required from min input when required is false.
- should remove required from max input when required is false.
- should keep null values allowed at the component value level while native required is applied.
- should update required attributes when required input changes.

## Disabled behavior

- should disable both inputs when disabled is true.
- should enable both inputs when disabled is false.
- should reflect disabled state on the root container.
- should prevent min user changes when disabled.
- should prevent max user changes when disabled.
- should not emit `valueChange` when disabled input event is ignored.
- should not emit `rangeChange` when disabled input event is ignored.
- should update disabled state when input changes.
- should keep disabled state in sync with CVA `setDisabledState`.

## Readonly behavior

- should mark both inputs readonly when readonly is true.
- should remove readonly from both inputs when readonly is false.
- should reflect readonly state on the root container.
- should allow focus on readonly min input.
- should allow focus on readonly max input.
- should prevent min value editing when readonly.
- should prevent max value editing when readonly.
- should not emit `valueChange` when readonly input event is ignored.
- should not emit `rangeChange` when readonly input event is ignored.
- should update readonly state when input changes.

## Accessibility: group semantics

- should set `role="group"` on the root/group element.
- should apply `aria-label` to the group when `ariaLabel` is provided.
- should apply `aria-labelledby` to the group when `ariaLabelledby` is provided.
- should not set empty `aria-label`.
- should not set empty `aria-labelledby`.
- should prefer explicit labelledby when provided by the consumer.
- should keep the separator `aria-hidden="true"`.
- should not expose separator text as an accessible name.
- should keep group semantics stable after value changes.

## Accessibility: input labels

- should apply min input accessible label from `minAriaLabel`.
- should apply max input accessible label from `maxAriaLabel`.
- should provide sensible default min input aria label if none is provided.
- should provide sensible default max input aria label if none is provided.
- should update min input aria label when input changes.
- should update max input aria label when input changes.
- should not rely only on placeholder for input names.
- should keep min and max input names distinct.

## Accessibility: invalid state

- should set `aria-invalid="true"` on min input when range is invalid.
- should set `aria-invalid="true"` on max input when range is invalid.
- should remove `aria-invalid` from min input when range is valid.
- should remove `aria-invalid` from max input when range is valid.
- should update `aria-invalid` when range order becomes invalid.
- should update `aria-invalid` when boundaries become invalid.
- should update `aria-invalid` when external invalid changes.
- should reflect invalid state on the root with a data attribute.

## Keyboard behavior

- should allow native typing in the min input.
- should allow native typing in the max input.
- should allow Tab to move from min input to max input.
- should allow Shift+Tab to move from max input to min input.
- should not prevent default Tab behavior.
- should allow ArrowUp native number behavior on min input.
- should allow ArrowDown native number behavior on min input.
- should allow ArrowUp native number behavior on max input.
- should allow ArrowDown native number behavior on max input.
- should not add custom keyboard handling that breaks native number inputs.
- should not trap focus inside the component.

## Focus and blur behavior

- should allow focusing the min input.
- should allow focusing the max input.
- should call touched callback when min input blurs.
- should call touched callback when max input blurs.
- should not call touched callback before blur.
- should not call touched callback multiple times unnecessarily.
- should preserve value when focus moves from min to max.
- should preserve value when focus leaves the component.

## ControlValueAccessor

- should implement `writeValue`.
- should implement `registerOnChange`.
- should implement `registerOnTouched`.
- should implement `setDisabledState`.
- should write min and max values from form control.
- should write null form value as `{ min: null, max: null }`.
- should normalize missing min to null in `writeValue`.
- should normalize missing max to null in `writeValue`.
- should call registered onChange when min changes.
- should call registered onChange when max changes.
- should call registered onTouched when min blurs.
- should call registered onTouched when max blurs.
- should disable both inputs when form control is disabled.
- should enable both inputs when form control is enabled.
- should update form control value with full range object.
- should work with reactive forms.
- should work with template-driven forms if supported by the project.

## Reactive forms integration

- should initialize from a reactive form control value.
- should update the form control when min changes.
- should update the form control when max changes.
- should mark form control as dirty after user change.
- should mark form control as touched after blur.
- should respect disabled form control state.
- should reset inputs when form control resets to null.
- should reset inputs when form control resets to `{ min: null, max: null }`.
- should preserve partial form values.
- should support validators attached to the parent form control.

## Host attributes and data attributes

- should expose disabled state through a data attribute.
- should expose readonly state through a data attribute.
- should expose invalid state through a data attribute.
- should not render false string values for boolean data attributes.
- should remove state data attributes when state is false.
- should keep host classes stable across state changes.
- should support custom class on host element.
- should not overwrite consumer-provided host classes.

## Slot/class customization

- should apply root slot class when provided.
- should apply group slot class when provided.
- should apply min input slot class when provided.
- should apply max input slot class when provided.
- should apply separator slot class when provided.
- should merge slot classes with default classes.
- should not remove default classes when slot classes are provided.
- should update slot classes when slot input changes.
- should tolerate missing slot map.
- should ignore unknown slot keys safely.

## Styling

- should render inline-flex layout by default.
- should align inputs and separator vertically.
- should not hardcode theme-specific colors except through semantic tokens.
- should visually reflect disabled state.
- should visually reflect invalid state.
- should allow consumer styles to override width.
- should not impose an unnecessary max-width.
- should allow compact usage inside table filter popovers.
- should support use inside `tng-form-field`.

## Edge cases

- should handle very large min values.
- should handle very large max values.
- should handle very small decimal values.
- should handle negative ranges.
- should handle min and max both set to zero.
- should handle min and max both set to the same value.
- should handle rapid min input changes.
- should handle rapid max input changes.
- should handle clearing both inputs.
- should handle value object with undefined min by normalizing to null.
- should handle value object with undefined max by normalizing to null.
- should handle external value update while focused.
- should handle external value reset while focused.
- should not throw when event target is not an input.
- should not throw when controlled value is null.
- should not throw when default value is null.
- should not emit stale values after consecutive changes.

## Type safety

- should expose `TngNumberRangeValue` type.
- should expose `TngNumberRangeChangeEvent` type.
- should expose `TngNumberRangeSource` type.
- should expose `TngNumberRangeSlots` type.
- should type `valueChange` as `TngNumberRangeValue`.
- should type `rangeChange` as `TngNumberRangeChangeEvent`.
- should avoid `any` in public APIs.
- should avoid unnecessary type assertions.
- should satisfy project lint rules.
- should compile under strict TypeScript settings.

## Public API exports

- should export the component from the library entry point.
- should export the value type from the library entry point.
- should export the change event type from the library entry point.
- should export the slot type from the library entry point.
- should not export internal helper functions unless intentionally public.
- should keep public API names consistent with TailNG naming conventions.

## Documentation examples

- should document basic number range usage.
- should document controlled signal usage.
- should document reactive forms usage.
- should document disabled state usage.
- should document readonly state usage.
- should document min/max boundary usage.
- should document step usage.
- should document table filter usage.
- should document accessibility labels.
- should document invalid range behavior.

## Regression tests

- should not break existing `tng-input type="number"` tests.
- should not require changes to existing input APIs.
- should not change existing form field behavior.
- should not change existing package exports unexpectedly.
- should not introduce Angular module requirements.
- should not introduce dependency on Angular Material.
- should not introduce dependency on Tailwind runtime.
- should not introduce browser-only globals that break tests.

---

## Suggested Implementation Order for Codex

1. Add types.
2. Add component skeleton.
3. Add template and styles.
4. Add value parsing and formatting helpers.
5. Add controlled/uncontrolled value handling.
6. Add value and range event emission.
7. Add validation computed values.
8. Add accessibility attributes.
9. Add disabled and readonly handling.
10. Add CVA implementation.
11. Add public exports.
12. Add tests category by category.
13. Run lint, typecheck, and tests.
14. Fix any test or typing issues.
15. Add demo/docs examples if the repo has a docs/playground area.

---

## Acceptance Criteria

- `tng-number-range` renders two number inputs.
- It supports `{ min, max }` value shape.
- Empty fields become `null`.
- Partial values are allowed.
- Invalid range order is reported, not blocked.
- Boundary validation works.
- Disabled and readonly states work.
- Accessibility labels and invalid state are correct.
- CVA works with Angular reactive forms.
- Public API is exported.
- Unit tests cover rendering, API, validation, forms, accessibility, styling hooks, and edge cases.
- Existing `tng-input` behavior remains unchanged.
