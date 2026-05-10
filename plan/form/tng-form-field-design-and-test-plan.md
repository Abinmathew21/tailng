# TailNG `tng-form-field` Design and Test Plan

## 1. Purpose

`tng-form-field` should be a common wrapper for field-style form controls in TailNG.

It should provide consistent layout, accessibility wiring, state styling, and composition for controls such as:

- `input[tngInput]`
- `textarea[tngTextarea]`
- `tng-select`
- `tng-autocomplete`
- `tng-combobox`
- `tng-datepicker`
- `tng-timepicker`
- `tng-input-otp`
- `tng-file-input`

The main goal is not to copy Angular Material exactly. The goal is to provide a TailNG-native field wrapper that is lightweight, composable, accessible, and optional.

---

## 2. Recommended Classification

`tng-form-field` should be a **styled component**, not a purely headless primitive.

However, the integration contract between `tng-form-field` and form controls should be headless.

### Recommended package split

```txt
@tailng-ui/cdk
  form-field-control contract
  describedby utility
  id generation utility
  form-control state helpers

@tailng-ui/components
  tng-form-field
  tng-label
  tng-hint
  tng-error
  tng-input-group
  tng-prefix
  tng-suffix
```

### Why `tng-form-field` is a component

`tng-form-field` is mostly responsible for presentation and layout:

| Responsibility | Type |
|---|---|
| Label layout | Visual / structural |
| Input spacing | Visual |
| Hint and error placement | Visual / structural |
| Focused state styling | Visual state |
| Invalid state styling | Visual state |
| Disabled state styling | Visual state |
| Required marker display | Visual + accessibility |
| Prefix and suffix alignment | Visual / structural |
| `aria-describedby` wiring | Accessibility behavior |

Because most of its value is visual and compositional, it belongs in `@tailng-ui/components`.

### What is headless

The control integration protocol should be headless.

This lets custom controls integrate with `tng-form-field` without depending on TailNG styling.

Example contract:

```ts
export interface TngFormFieldControl {
  id: string;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  focused: boolean;

  setDescribedByIds(ids: string[]): void;
}
```

This contract can live in `@tailng-ui/cdk` or `@tailng-ui/primitives`.

---

## 3. Design Principle

The recommended mental model is:

```txt
tngInput / tngSelect / tngAutocomplete
  Owns the control behavior and value.

tng-form-field
  Owns the field layout, label, hint, error, and state presentation.

TngFormFieldControl contract
  Connects field wrapper and control in an accessible way.
```

This keeps the system flexible.

A user should be able to use a plain TailNG input without a form field:

```html
<input tngInput />
```

And also use it inside a form field:

```html
<tng-form-field>
  <label tngLabel>Email</label>
  <input tngInput />
  <p tngHint>Use your work email.</p>
  <p tngError>Email is required.</p>
</tng-form-field>
```

---

## 4. Which Controls Should Work Inside `tng-form-field`

### Strong fit

These controls should be officially supported inside `tng-form-field`:

| Control | Reason |
|---|---|
| `input[tngInput]` | Basic text-like control |
| `textarea[tngTextarea]` | Same field layout pattern |
| `tng-select` | Field-like selection control |
| `tng-autocomplete` | Input-like field with popup |
| `tng-combobox` | Input-like field with listbox behavior |
| `tng-datepicker` | Field-like date selection |
| `tng-timepicker` | Field-like time selection |
| `tng-input-otp` | Field-like grouped input |
| `tng-file-input` | Can behave like an input field |
| `tng-number-input` | Field-like numeric control |
| `tng-password-input` | Field-like text control |

### Possible but not default

These can be supported manually, but should not be the main design target:

| Control | Reason |
|---|---|
| `tng-slider` | It often has a different layout pattern |
| `tng-rating` | Usually not field-shaped |
| `tng-color-picker` | Depends on final UI design |

### Better outside `tng-form-field`

These usually deserve their own layout pattern:

| Control | Reason |
|---|---|
| `tng-checkbox` | Label usually appears beside the control |
| `tng-radio-group` | Group/fieldset semantics are more important |
| `tng-switch` | Label usually appears beside the switch |
| `tng-toggle-group` | Group selection pattern |

For these, a separate wrapper may be better later:

```html
<tng-choice-field>
  <tng-checkbox />
  <tng-label>Accept terms</tng-label>
  <tng-hint>You must accept before continuing.</tng-hint>
</tng-choice-field>
```

---

## 5. Recommended Public API

### Basic usage

```html
<tng-form-field>
  <label tngLabel for="email">Email</label>

  <input
    tngInput
    id="email"
    type="email"
    placeholder="Enter email"
  />

  <p tngHint>Use your work email.</p>
  <p tngError>Email is required.</p>
</tng-form-field>
```

### Select usage

```html
<tng-form-field>
  <label tngLabel>Country</label>

  <tng-select
    [items]="countries"
    placeholder="Select country"
  />

  <p tngHint>Select your billing country.</p>
  <p tngError>Country is required.</p>
</tng-form-field>
```

### Autocomplete usage

```html
<tng-form-field>
  <label tngLabel>City</label>

  <tng-autocomplete
    [options]="cities"
    placeholder="Search city"
  />

  <p tngHint>Start typing to search.</p>
  <p tngError>City is required.</p>
</tng-form-field>
```

### Datepicker usage

```html
<tng-form-field>
  <label tngLabel>Start date</label>

  <tng-datepicker placeholder="Select start date" />

  <p tngHint>Used for report filtering.</p>
  <p tngError>Start date is required.</p>
</tng-form-field>
```

### Prefix and suffix usage

```html
<tng-form-field>
  <label tngLabel>Amount</label>

  <div tngInputGroup>
    <span tngPrefix>₹</span>
    <input tngInput type="number" />
    <span tngSuffix>INR</span>
  </div>

  <p tngHint>Enter amount before tax.</p>
</tng-form-field>
```

---

## 6. Recommended Building Blocks

### Components / directives

```txt
TngFormField
TngLabel
TngHint
TngError
TngInputGroup
TngPrefix
TngSuffix
```

### Optional future additions

```txt
TngFormFieldHeader
TngFormFieldFooter
TngFormFieldDescription
TngFormFieldCounter
```

---

## 7. Recommended Inputs

### `TngFormField`

| Input | Type | Default | Description |
|---|---|---:|---|
| `appearance` | `'outline' \| 'filled' \| 'plain'` | `'outline'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Field size |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Label/control layout |
| `requiredMarker` | `boolean` | `true` | Whether required marker is shown |
| `hideHintWhenError` | `boolean` | `false` | Whether hints are hidden when errors are visible |
| `disabled` | `boolean` | derived | Optional forced disabled state |
| `invalid` | `boolean` | derived | Optional forced invalid state |
| `slot` | `TngSlotMap` | `{}` | Slot-based micro styling |

### `TngHint`

| Input | Type | Default | Description |
|---|---|---:|---|
| `id` | `string` | generated | Hint id used by `aria-describedby` |
| `align` | `'start' \| 'end'` | `'start'` | Hint alignment |

### `TngError`

| Input | Type | Default | Description |
|---|---|---:|---|
| `id` | `string` | generated | Error id used by `aria-describedby` |
| `show` | `boolean` | `true` | Whether the error is visible |
| `align` | `'start' \| 'end'` | `'start'` | Error alignment |

---

## 8. State Model

`tng-form-field` should expose state using classes or data attributes.

Recommended data attributes:

```html
<tng-form-field
  data-focused="true"
  data-invalid="false"
  data-disabled="false"
  data-required="true"
  data-size="md"
  data-appearance="outline"
>
</tng-form-field>
```

Recommended host classes may also be generated internally:

```txt
.tng-form-field
.tng-form-field--focused
.tng-form-field--invalid
.tng-form-field--disabled
.tng-form-field--required
.tng-form-field--appearance-outline
.tng-form-field--size-md
```

For TailNG, data attributes are useful because they work well with plain CSS and Tailwind variants.

---

## 9. Accessibility Design

### Label association

For native controls, label association can use `for` and `id`:

```html
<label tngLabel for="email">Email</label>
<input tngInput id="email" />
```

For custom controls such as `tng-select`, the control should expose a stable id through the `TngFormFieldControl` contract.

The form field can then connect the projected label to that control.

### `aria-describedby`

`tng-form-field` should collect visible hints and errors, then pass their ids to the control:

```ts
control.setDescribedByIds(['email-hint', 'email-error']);
```

The control should apply:

```html
<input aria-describedby="email-hint email-error" />
```

For custom controls:

```html
<div role="combobox" aria-describedby="city-hint city-error"></div>
```

### Error semantics

Visible error text should be announced properly.

Recommended behavior:

- Error element should have an id.
- The control should include error id in `aria-describedby`.
- The control should set `aria-invalid="true"` when invalid.
- Error text can use `role="alert"` only when live announcement is intentionally needed.
- Avoid overusing `role="alert"` because it can create noisy screen reader behavior.

### Required state

Required state should be reflected both visually and semantically:

```html
<input required aria-required="true" />
```

For custom controls:

```html
<div role="combobox" aria-required="true"></div>
```

---

## 10. Styling Contract

TailNG should keep styling simple and predictable.

Recommended structure:

```html
<tng-form-field class="tng-form-field">
  <div class="tng-form-field__label">
    <ng-content select="[tngLabel], tng-label"></ng-content>
  </div>

  <div class="tng-form-field__control">
    <ng-content></ng-content>
  </div>

  <div class="tng-form-field__messages">
    <ng-content select="[tngHint], tng-hint"></ng-content>
    <ng-content select="[tngError], tng-error"></ng-content>
  </div>
</tng-form-field>
```

Recommended slots:

```ts
type TngFormFieldSlot =
  | 'root'
  | 'label'
  | 'control'
  | 'messages'
  | 'hint'
  | 'error'
  | 'requiredMarker'
  | 'prefix'
  | 'suffix';
```

Example:

```html
<tng-form-field
  [slot]="{
    root: 'gap-2',
    label: 'text-sm font-medium',
    error: 'text-danger'
  }"
>
  ...
</tng-form-field>
```

---

## 11. Important Design Decisions

### Do not make `tng-form-field` mandatory

This should work:

```html
<input tngInput />
```

This should also work:

```html
<tng-form-field>
  <label tngLabel>Name</label>
  <input tngInput />
</tng-form-field>
```

### Do not tightly couple it to one control type

`tng-form-field` should not know whether the control is an input, select, autocomplete, or datepicker.

It should communicate only through the shared `TngFormFieldControl` contract.

### Do not make it a validation engine

Validation should remain with Angular forms, signal forms, or user application logic.

`tng-form-field` should only display invalid state and error content.

### Avoid Material-level complexity initially

Features such as floating labels, subscript sizing, custom error matchers, and deep control injection can be added later if required.

The first version should be small, predictable, and easy to test.

---

# Feature-wise Test Cases

## 12. Basic Rendering

### `TngFormField`

- Should render the form field host.
- Should project label content.
- Should project native input content.
- Should project custom control content.
- Should project hint content.
- Should project error content.
- Should render label area before control area in vertical orientation.
- Should render message area after control area.
- Should not require a label.
- Should not require a hint.
- Should not require an error.
- Should support multiple projected child nodes.
- Should preserve projected content order where appropriate.
- Should not throw when no compatible control is projected.
- Should render with default appearance.
- Should render with default size.
- Should apply base form-field class or data attribute.

---

## 13. Control Registration

- Should register a native `input[tngInput]` as the form-field control.
- Should register a native `textarea[tngTextarea]` as the form-field control.
- Should register `tng-select` as the form-field control.
- Should register `tng-autocomplete` as the form-field control.
- Should register `tng-combobox` as the form-field control.
- Should register `tng-datepicker` as the form-field control.
- Should register `tng-input-otp` as the form-field control.
- Should use the first compatible control when only one control is expected.
- Should warn or fail gracefully when multiple controls are projected.
- Should not break when unsupported projected content exists.
- Should clean up registration when a control is destroyed.
- Should update registration when projected control changes dynamically.
- Should not leak subscriptions or effects after control destruction.

---

## 14. Label Behavior

- Should associate `tngLabel` with native input using `for` and `id`.
- Should generate a control id when the native input has no id.
- Should not overwrite a user-provided input id.
- Should connect label to custom control through the form-field control contract.
- Should expose required marker when the control is required.
- Should hide required marker when `requiredMarker` is false.
- Should not show required marker when the control is not required.
- Should support label text projection.
- Should support complex label content projection.
- Should support a disabled label style when the control is disabled.
- Should support invalid label style when the control is invalid.
- Should support focused label style when the control is focused.
- Should update label state when control state changes.
- Should not duplicate ids when multiple form fields are rendered.

---

## 15. Hint Behavior

- Should project one hint.
- Should project multiple hints if allowed.
- Should generate an id for a hint when no id is provided.
- Should preserve a user-provided hint id.
- Should add visible hint id to the control `aria-describedby`.
- Should remove hint id from `aria-describedby` when hint is destroyed.
- Should update `aria-describedby` when hints change dynamically.
- Should support start-aligned hint.
- Should support end-aligned hint.
- Should support hint text projection.
- Should support complex hint content projection.
- Should hide hint when `hideHintWhenError` is true and an error is visible.
- Should keep hint visible when `hideHintWhenError` is false and an error is visible.
- Should not add hidden hint ids to `aria-describedby` unless intentionally configured.

---

## 16. Error Behavior

- Should project one error.
- Should project multiple errors if allowed.
- Should generate an id for an error when no id is provided.
- Should preserve a user-provided error id.
- Should add visible error id to the control `aria-describedby`.
- Should remove error id from `aria-describedby` when error is destroyed.
- Should update `aria-describedby` when errors change dynamically.
- Should show error only when error content is projected and visible.
- Should support conditional error rendering.
- Should set form-field invalid state when control is invalid.
- Should reflect invalid state using `data-invalid`.
- Should apply invalid class or style hook.
- Should set `aria-invalid="true"` on compatible controls when invalid.
- Should remove `aria-invalid` or set it to false when valid.
- Should not announce hidden errors.
- Should support `role="alert"` only when configured or required.
- Should not force application validation rules.

---

## 17. `aria-describedby` Integration

- Should call `setDescribedByIds` on the registered control.
- Should include hint ids in described-by ids.
- Should include error ids in described-by ids.
- Should preserve custom described-by ids already set on the control if supported.
- Should avoid duplicate ids in `aria-describedby`.
- Should maintain stable ordering of described-by ids.
- Should update described-by ids when hint visibility changes.
- Should update described-by ids when error visibility changes.
- Should update described-by ids when control changes.
- Should clear described-by ids when the form field is destroyed.
- Should work for native input.
- Should work for textarea.
- Should work for custom combobox/select-like controls.
- Should work when hints/errors are added asynchronously.
- Should work when hints/errors are removed asynchronously.

---

## 18. Required State

- Should detect required state from native input `required` attribute.
- Should detect required state from custom control contract.
- Should reflect required state using `data-required`.
- Should apply required class or style hook.
- Should render required marker by default.
- Should not render required marker when `requiredMarker` is false.
- Should update required state dynamically.
- Should set `aria-required` for custom controls when required.
- Should not set duplicate required markers.
- Should support custom required marker styling through slot.
- Should not treat optional fields as required.

---

## 19. Disabled State

- Should detect disabled state from native control.
- Should detect disabled state from custom control contract.
- Should reflect disabled state using `data-disabled`.
- Should apply disabled class or style hook.
- Should style label as disabled.
- Should style hint as disabled where appropriate.
- Should style error as disabled only if design requires it.
- Should update disabled state dynamically.
- Should not mark enabled controls as disabled.
- Should support forced disabled state on the form field if provided.
- Should avoid conflicting disabled state between wrapper and control.

---

## 20. Focus State

- Should detect focus from native input.
- Should detect focus from textarea.
- Should detect focus from custom control contract.
- Should reflect focused state using `data-focused`.
- Should apply focused class or style hook.
- Should update focus state on focusin.
- Should update focus state on focusout.
- Should keep focused state when focus moves within a composite control.
- Should remove focused state when focus leaves the entire control.
- Should not incorrectly remove focused state when interacting with prefix/suffix buttons.
- Should not trap focus.
- Should not prevent native Tab behavior.
- Should support focus styling for custom controls.

---

## 21. Appearance Variants

- Should render default appearance.
- Should support `appearance="outline"`.
- Should support `appearance="filled"`.
- Should support `appearance="plain"`.
- Should reflect appearance using `data-appearance`.
- Should apply appearance-specific class or style hook.
- Should update appearance dynamically.
- Should not break projected content when appearance changes.
- Should preserve accessibility attributes across appearance changes.

---

## 22. Size Variants

- Should render default size.
- Should support `size="sm"`.
- Should support `size="md"`.
- Should support `size="lg"`.
- Should reflect size using `data-size`.
- Should apply size-specific class or style hook.
- Should update size dynamically.
- Should size label, control, hint, and error consistently.
- Should not break custom controls when size changes.
- Should allow custom controls to consume inherited size if supported.

---

## 23. Orientation

- Should render vertical orientation by default.
- Should support `orientation="vertical"`.
- Should support `orientation="horizontal"`.
- Should reflect orientation using `data-orientation`.
- Should apply orientation-specific class or style hook.
- Should place label and control in a row for horizontal orientation.
- Should keep hint/error aligned correctly in horizontal orientation.
- Should update orientation dynamically.
- Should preserve accessibility wiring across orientation changes.

---

## 24. Prefix and Suffix

- Should render prefix before the control.
- Should render suffix after the control.
- Should support text prefix.
- Should support icon prefix.
- Should support button suffix.
- Should support multiple prefix/suffix items if allowed.
- Should apply prefix style hook.
- Should apply suffix style hook.
- Should not include decorative prefix/suffix text in the label automatically.
- Should not break `aria-describedby`.
- Should not steal focus from the input unless interactive.
- Should allow interactive suffix buttons to receive focus.
- Should preserve form-field focused state when suffix button is focused.
- Should not submit forms accidentally when suffix button has no explicit type.
- Should document that suffix buttons should use `type="button"`.

---

## 25. Input Group

- Should render input group wrapper.
- Should align prefix, control, and suffix correctly.
- Should support native input inside input group.
- Should support custom controls inside input group if designed.
- Should apply group invalid state.
- Should apply group focused state.
- Should apply group disabled state.
- Should not duplicate border styles when input is inside group.
- Should support slot styling for group.
- Should not require input group for simple fields.

---

## 26. Slot-based Micro Styling

- Should accept `slot` input.
- Should apply root slot classes to root element.
- Should apply label slot classes to label area.
- Should apply control slot classes to control area.
- Should apply messages slot classes to messages area.
- Should apply hint slot classes to hint content.
- Should apply error slot classes to error content.
- Should apply prefix slot classes to prefix.
- Should apply suffix slot classes to suffix.
- Should apply required marker slot classes to required marker.
- Should merge user slot classes with default classes.
- Should not remove accessibility attributes when slot classes change.
- Should update slot classes dynamically.
- Should ignore unknown slot keys safely.

---

## 27. Native Input Integration

- Should work with `input[type="text"]`.
- Should work with `input[type="email"]`.
- Should work with `input[type="password"]`.
- Should work with `input[type="number"]`.
- Should work with `input[type="search"]`.
- Should work with `input[type="tel"]`.
- Should work with `input[type="url"]`.
- Should work with `input[type="date"]` if native date input is supported.
- Should work with `textarea`.
- Should preserve native form behavior.
- Should not interfere with Angular forms.
- Should not interfere with signal forms.
- Should support reactive forms.
- Should support template-driven forms if TailNG chooses to support them.
- Should update invalid state from Angular control status if integrated.
- Should update disabled state from Angular control status if integrated.

---

## 28. Custom Control Integration

- Should work with a custom control implementing `TngFormFieldControl`.
- Should call the custom control's `setDescribedByIds`.
- Should read the custom control's id.
- Should read the custom control's focused state.
- Should read the custom control's invalid state.
- Should read the custom control's disabled state.
- Should read the custom control's required state.
- Should update form-field state when custom control state changes.
- Should support custom controls created after initial render.
- Should support custom controls destroyed after initial render.
- Should not require custom control to be a specific component class.
- Should work through an injection token.

---

## 29. Angular Forms Integration

- Should reflect invalid state from `NgControl` when available.
- Should reflect touched/dirty state according to chosen policy.
- Should not show errors before the configured error visibility condition.
- Should support reactive form controls.
- Should support disabled state from reactive forms.
- Should support required validators where detectable.
- Should not mutate form control values.
- Should not trigger validation unexpectedly.
- Should not subscribe without cleanup.
- Should work with async validators.
- Should update error visibility after async validation resolves.
- Should work when control is reset.
- Should work when control is dynamically enabled or disabled.

---

## 30. Signal Forms Integration

- Should allow signal-driven invalid state.
- Should allow signal-driven disabled state.
- Should allow signal-driven required state.
- Should update UI when signals change.
- Should not require Angular reactive forms.
- Should not require `ControlValueAccessor` for all cases.
- Should work with standalone signal-based controls.
- Should keep form-field contract independent from one form library.

---

## 31. Dynamic Content

- Should support hint added after initial render.
- Should support hint removed after initial render.
- Should support error added after initial render.
- Should support error removed after initial render.
- Should support label added after initial render.
- Should support control added after initial render.
- Should support control removed after initial render.
- Should update ids when content changes.
- Should update described-by ids when content changes.
- Should not throw during conditional rendering.
- Should not keep stale ids after projected content is removed.

---

## 32. Multiple Form Fields

- Should render multiple form fields on the same page.
- Should generate unique ids for each field.
- Should not mix hint ids across fields.
- Should not mix error ids across fields.
- Should not mix label associations across fields.
- Should isolate focused state per field.
- Should isolate invalid state per field.
- Should isolate disabled state per field.
- Should isolate required state per field.
- Should support repeated rendering inside `@for`.
- Should clean up when repeated fields are removed.

---

## 33. Server-side Rendering and Hydration

- Should render stable ids during SSR if id generation strategy supports it.
- Should avoid hydration mismatch from non-deterministic ids where possible.
- Should not access `window` during construction.
- Should not access `document` during construction unless guarded.
- Should hydrate projected label correctly.
- Should hydrate hints and errors correctly.
- Should preserve accessibility attributes after hydration.
- Should support client-only dynamic updates after hydration.

---

## 34. Keyboard and Focus Accessibility

- Should not intercept keyboard events unnecessarily.
- Should not prevent Tab from leaving the field.
- Should not prevent Shift+Tab from leaving the field.
- Should not interfere with native input keyboard behavior.
- Should not interfere with select/autocomplete keyboard behavior.
- Should preserve focus visibility.
- Should allow focus on suffix buttons.
- Should preserve focus state when focus is inside a composite field.
- Should not create hidden focus traps.
- Should work with screen readers using label and description.

---

## 35. RTL Support

- Should support RTL layout.
- Should place prefix and suffix correctly in RTL if design requires mirroring.
- Should keep label alignment correct in RTL.
- Should keep hint/error alignment correct in RTL.
- Should not break `aria-describedby` in RTL.
- Should support horizontal orientation in RTL.
- Should update layout when direction changes dynamically if supported.

---

## 36. Theming

- Should use semantic CSS variables.
- Should not hard-code Tailwind palette colors in component internals.
- Should support light mode.
- Should support dark mode.
- Should support custom themes.
- Should expose state-based styling hooks.
- Should support invalid color token.
- Should support disabled color token.
- Should support focus ring token.
- Should support background token.
- Should support border token.
- Should support text token.
- Should not require Tailwind for base styling.
- Should work with Tailwind utility overrides through slots.

---

## 37. Error Visibility Policy

- Should allow error always visible when projected.
- Should allow error visible only when control is touched if configured.
- Should allow error visible only when control is dirty if configured.
- Should allow application-controlled error visibility.
- Should not impose a Material-style error matcher by default.
- Should support custom error visibility strategy later if needed.
- Should update hint visibility when error visibility changes.
- Should update described-by ids when error visibility changes.

---

## 38. Performance

- Should avoid unnecessary change detection work.
- Should use signals/computed state where possible.
- Should avoid querying DOM repeatedly.
- Should avoid expensive effects per keystroke.
- Should clean up effects/subscriptions.
- Should handle many form fields on a page.
- Should avoid layout thrashing.
- Should avoid recreating ids unnecessarily.
- Should avoid unnecessary class recomputation.

---

## 39. Developer Experience

- Should have a simple import path.
- Should work with standalone Angular components.
- Should have minimal required markup.
- Should provide clear examples for native input.
- Should provide clear examples for select.
- Should provide clear examples for autocomplete.
- Should provide clear examples for datepicker.
- Should provide clear examples for prefix/suffix.
- Should document when not to use `tng-form-field`.
- Should document checkbox/radio/switch alternatives.
- Should document accessibility behavior.
- Should document slot names.
- Should document data attributes.
- Should document custom control integration.

---

## 40. Negative / Edge Cases

- Should not throw when no control exists.
- Should not throw when no label exists.
- Should not throw when no hint exists.
- Should not throw when no error exists.
- Should not duplicate `aria-describedby` ids.
- Should not overwrite user-provided ids.
- Should not generate unstable ids on every render.
- Should not show required marker for optional controls.
- Should not show invalid state for valid controls.
- Should not keep focused state after blur.
- Should not keep disabled state after control is enabled.
- Should not keep stale error ids after error removal.
- Should not break when projected content is reordered.
- Should not break when field is conditionally rendered.
- Should not break when control is conditionally rendered.
- Should not interfere with form submission.

---

## 41. Recommended Initial Implementation Scope

For version 1, keep the scope small.

### Include in v1

- `TngFormField`
- `TngLabel`
- `TngHint`
- `TngError`
- `TngInputGroup`
- `TngPrefix`
- `TngSuffix`
- `TngFormFieldControl` contract
- Native input integration
- Textarea integration
- Custom control integration through injection token
- `aria-describedby` management
- focused/invalid/disabled/required states
- appearance and size
- slot-based styling

### Defer to later

- Floating label
- Complex error matcher
- Character counter
- Fieldset/radio group wrapper
- Choice-field wrapper
- Advanced subscript sizing
- Full Material-like appearance system

---

## 42. Final Recommendation

Create `tng-form-field` as a styled component in `@tailng-ui/components`.

Keep the control contract headless in `@tailng-ui/cdk` or `@tailng-ui/primitives`.

The best design rule is:

```txt
tng-form-field is optional.
tng-form-field is composable.
tng-form-field supports all input-like controls.
Choice controls can use a different layout pattern.
The integration contract is headless.
The wrapper itself is a component.
```

This gives TailNG a clean, scalable form architecture without inheriting Angular Material's complexity.
