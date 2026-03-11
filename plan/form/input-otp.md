# Input OTP

Headless segmented OTP input primitive for one-time passcodes and verification codes.

## Overview

Input OTP is a headless segmented input control used to collect one-time passwords, verification codes, confirmation codes, and similar short token-based inputs.
It supports multiple visual slots while behaving as a single logical form value.

This component should provide accessibility, keyboard behavior, paste handling, focus management, Angular forms integration, and signal-first Angular 21+ compatible APIs, while leaving rendering and styling to the consumer or to a higher-level styled component.

## Supported states

- `empty`
- `partial`
- `complete`
- `disabled`
- `readonly`
- `required`
- `invalid`
- `focused`
- `focus-visible`

## Common use cases

- SMS verification code entry
- Email verification code entry
- Two-factor authentication input
- Device confirmation flow
- Password reset confirmation code
- Payment or onboarding confirmation steps

## Headless component goals

- Provide accessible OTP / verification code entry semantics
- Support segmented visual input with a single logical value
- Support controlled and uncontrolled APIs
- Support signal-first Angular 21+ component APIs
- Support keyboard navigation across slots
- Support paste distribution across slots
- Support deletion and overwrite behavior
- Support Angular forms integration
- Support label association and description/error wiring
- Expose state for custom rendering and styling

## Required headless features

### Core behavior

- Configurable slot count
- Support numeric input mode
- Support alphanumeric input mode
- Optional custom pattern / character validation
- Controlled value support
- Uncontrolled value support
- Auto-advance to next slot after valid entry
- Backspace behavior across slots
- Delete behavior on current slot
- Replace existing character in focused slot
- Optional masking support
- Optional auto-focus support
- `disabled`, `readonly`, `required`, and `invalid` support
- Native form compatibility where applicable
- Reset behavior with HTML forms

### Input and paste behavior

- Accept single-character typing into a slot
- Distribute pasted string across remaining slots
- Ignore invalid pasted characters when validation is enabled
- Trim pasted content to slot count
- Support full-code paste from first or middle slot
- Preserve predictable cursor / focus movement after paste

### Accessibility

- Group-level accessible name support
- Group-level description and error association
- Per-slot labeling strategy where needed
- Proper invalid and required state exposure
- Support screen reader announcement of overall control purpose
- Logical focus order across slots
- Accessible completion feedback through standard validation patterns

### Interaction

- Auto-advance on valid character entry
- Arrow key navigation between slots
- Backspace moves backward when current slot is empty
- Typing into a focused slot replaces current slot value
- Home moves to first slot
- End moves to last filled slot or last slot, depending on design
- Prevent interaction when disabled
- Preserve expected readonly behavior
- Focus management support
- Focus-visible state exposure

### Composition

- Standalone OTP root primitive
- OTP slot primitive
- Hidden input support for form submission when needed
- Label integration support
- Description primitive or description ID support
- Error message primitive or error ID support

### State exposure

- `data-empty`
- `data-partial`
- `data-complete`
- `data-disabled`
- `data-readonly`
- `data-invalid`
- `data-required`
- `data-focused`
- `data-focus-visible`
- `data-active`

## Suggested primitives / parts

- `InputOtpRoot`
- `InputOtpSlot`
- `InputOtpHiddenInput`
- `InputOtpLabel`
- `InputOtpDescription`
- `InputOtpError`

## Suggested APIs

### Input OTP root

Framework-neutral headless contract:

- `value?: string`
- `defaultValue?: string`
- `valueChange?: (value: string) => void`
- `length?: number`
- `type?: 'numeric' | 'alphanumeric' | 'custom'`
- `pattern?: RegExp | string`
- `mask?: boolean`
- `placeholderChar?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean`
- `invalid?: boolean`
- `name?: string`
- `id?: string`
- `autocomplete?: string`
- `inputMode?: 'numeric' | 'text' | 'tel' | 'decimal'`
- `autoFocus?: boolean`
- `selectOnFocus?: boolean`
- `aria-label?: string`
- `aria-labelledby?: string`
- `aria-describedby?: string`
- `form?: string`

### Input OTP slot

- `index: number`
- `disabled?: boolean`
- `readonly?: boolean`
- `id?: string`

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
- Internal slot state may be segmented, but exposed control value must remain a single combined string
- `valueChange` should emit the combined OTP value
- Partial values should still be representable during editing

## State model

### Overall control

- `''` → empty
- partially filled string shorter than `length` → partial
- filled string with valid slot count → complete

### Slot model

- empty slot
- filled slot
- active slot
- focused slot

## Keyboard interaction

- `Tab`: Moves focus into or away from the OTP control according to tab order
- `Shift + Tab`: Moves focus away in reverse order
- `ArrowLeft`: Moves focus to previous slot
- `ArrowRight`: Moves focus to next slot
- `Backspace`: Clears current slot or moves to previous slot when current slot is empty
- `Delete`: Clears current slot
- `Home`: Moves focus to first slot
- `End`: Moves focus to last relevant slot
- Character keys: Fill current slot with valid character and advance

Notes:

- Tab should follow natural page navigation, not trap focus inside the control
- Invalid characters should be ignored when validation rules are active
- Overwrite behavior should be predictable and consistent

## Behavior recommendations

- Typing a valid character should replace the current slot value and move focus forward
- Backspace on a filled slot should clear that slot first
- Backspace on an empty slot should move focus backward and clear the previous slot when appropriate
- Clicking a slot should focus it without breaking the single logical value model
- Partial values should remain editable without forcing completion

## Readonly behavior decision

Recommended readonly behavior:

- Allow focus
- Allow text selection where applicable
- Prevent value changes from keyboard, paste, and pointer-assisted editing
- Preserve readonly semantics without making the control unavailable to assistive technology

## Paste behavior recommendations

- Pasting should distribute characters left to right starting from the focused slot
- Pasted input should be filtered according to type or pattern rules
- Extra characters beyond the configured slot count should be ignored
- After paste, focus should move to the next empty slot or remain on the last slot if complete
- Full-code paste should make the component complete when enough valid characters are provided

## Accessibility notes

- The OTP control should expose a clear accessible label such as “Verification code”
- The control should expose description text for help content like “Enter the 6-digit code sent to your phone”
- Invalid state should be announced through standard error association patterns
- Slot-by-slot focus must remain understandable for assistive technology users
- Prefer preserving a single logical form value even when rendering multiple visual slots
- Autocomplete hints such as `one-time-code` may be useful where supported

## Form behavior

- OTP input should integrate with native form submission
- Submitted value should be the combined OTP string
- Hidden input strategy may be required for custom headless implementations
- Form reset should restore `defaultValue` / initial state

## Open design decisions

- Whether slots are rendered as multiple real inputs or as a single hidden input with visual slots
- Whether masking should be built into the primitive or handled at styled/component level
- Whether `type='numeric'` should reject non-digits on input or sanitize them after input
- Whether paste should silently ignore invalid characters or surface validation feedback immediately
- Whether end-key behavior should move to the last slot or the last filled slot
- Whether select-on-focus should be default or opt-in

## Test checklist

### Rendering

- [ ] Renders configured number of slots
- [ ] Renders empty slots by default
- [ ] Renders filled slots from controlled value
- [ ] Renders filled slots from default value
- [ ] Renders disabled state correctly
- [ ] Renders readonly state correctly
- [ ] Renders required state correctly
- [ ] Renders invalid state correctly
- [ ] Renders associated label text correctly
- [ ] Renders associated description correctly
- [ ] Renders associated error message correctly

### Accessibility

- [ ] Exposes accessible name correctly
- [ ] Associates description through `aria-describedby`
- [ ] Associates error message through `aria-describedby`
- [ ] Exposes invalid state correctly
- [ ] Exposes required state correctly
- [ ] Maintains logical focus order across slots
- [ ] Supports autocomplete hint where configured

### Keyboard interaction

- [ ] Focuses first relevant slot with Tab
- [ ] Moves to next slot after valid character entry
- [ ] Moves to previous slot with ArrowLeft
- [ ] Moves to next slot with ArrowRight
- [ ] Clears current slot with Delete
- [ ] Clears current slot with Backspace
- [ ] Moves backward on Backspace when current slot is empty
- [ ] Moves to first slot with Home
- [ ] Moves to last relevant slot with End
- [ ] Does not trap Tab inside the control
- [ ] Does not accept invalid character input when validation is active
- [ ] Does not allow editing when disabled
- [ ] Does not allow editing when readonly
- [ ] Retains focus-visible state after keyboard focus

### Typing behavior

- [ ] Accepts numeric input in numeric mode
- [ ] Rejects alphabetic input in numeric mode
- [ ] Accepts alphanumeric input in alphanumeric mode
- [ ] Replaces existing character in focused slot
- [ ] Updates combined value correctly after each entry
- [ ] Marks control as complete when all slots are filled
- [ ] Marks control as partial when some slots are filled
- [ ] Marks control as empty when all slots are cleared

### Paste behavior

- [ ] Pastes full valid code from first slot
- [ ] Pastes full valid code from middle slot
- [ ] Distributes pasted characters across remaining slots
- [ ] Trims pasted content beyond configured length
- [ ] Filters invalid pasted characters when validation is active
- [ ] Updates combined value correctly after paste
- [ ] Moves focus to next empty slot after partial paste
- [ ] Moves focus to last slot when paste completes the control

### Controlled behavior

- [ ] Supports controlled value state
- [ ] Calls `valueChange` after typing
- [ ] Calls `valueChange` after paste
- [ ] Does not change visual state without controlled prop update

### Uncontrolled behavior

- [ ] Supports `defaultValue`
- [ ] Updates internal state on typing
- [ ] Updates internal state on paste
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

### Form integration

- [ ] Submits combined value when complete
- [ ] Submits partial combined value when partially filled if form is submitted
- [ ] Preserves name for native form submission
- [ ] Resets to initial state on form reset
- [ ] Works with hidden input strategy when custom root is used

### Data attributes

- [ ] Applies `data-empty` when no slots are filled
- [ ] Applies `data-partial` when some slots are filled
- [ ] Applies `data-complete` when all slots are filled
- [ ] Applies `data-disabled` in disabled state
- [ ] Applies `data-readonly` in readonly state
- [ ] Applies `data-invalid` in invalid state
- [ ] Applies `data-required` in required state
- [ ] Applies `data-focused` on focus
- [ ] Applies `data-focus-visible` on keyboard focus
- [ ] Applies `data-active` on active slot

## Implementation Steps

- [ ] Headless component created in `primitives`
- [ ] Test cases created for headless
- [ ] Headless example page added/updated in playground - plain CSS app
- [ ] Headless example page added/updated in playground - Tailwind app
- [ ] Minimum style `<tng-input-otp>` component created in `components`
- [ ] Test cases created for `<tng-input-otp>`
- [ ] Component example page added/updated in playground - plain CSS app
- [ ] Component example page added/updated in playground - Tailwind app
- [ ] Docs added/updated in docs project - Overview section
- [ ] Docs added/updated in docs project - API section
- [ ] Docs added/updated in docs project - Styling section
- [ ] Docs added/updated in docs project - Example section
- [ ] Registry templates added in registry
- [ ] `tailng add input-otp` command generation added
- [ ] CLI integration tests added for `tailng add input-otp`

## Links

- Playground: `/input-otp`