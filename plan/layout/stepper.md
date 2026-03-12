# Stepper

Headless stepper primitive for multi-step flows such as checkout, onboarding, and form wizards.

## Overview

Stepper is a headless layout primitive that models ordered progress through a list of steps.
It should expose state, navigation behavior, and accessibility semantics while leaving rendering and styling to consumers.

## Locked decisions (v1)

- Pattern: list-based stepper semantics (not tabs pattern).
- Root structure: container + ordered list of step triggers.
- Current step marker: `aria-current="step"` on exactly one trigger.
- Navigation mode:
  - `linear=false`: user can activate any enabled step.
  - `linear=true`: user can only activate current or previous completed steps.
- Focus model: roving `tabindex` across step triggers.
- Value model: `value` is a unique step id (`string | number`), not array index.
- State precedence for `data-state`:
  - `disabled` wins over all.
  - `error` wins over `completed`.
  - `current` wins over `completed`.
  - `completed` wins over `upcoming`.

## Supported states

- Root:
  - `orientation`: `horizontal | vertical`
  - `linear`: `true | false`
  - `data-orientation`
  - `data-linear`
- Per step:
  - `current`
  - `completed`
  - `optional`
  - `disabled`
  - `error`
  - `upcoming`
  - `data-state`
  - `data-optional`
  - `data-step-index`

## Common use cases

- Checkout or signup wizard
- Multi-step forms
- Guided onboarding
- Route-driven progressive flows
- Review/confirm workflows with back navigation

## Required headless features

### Core behavior

- Stepper root with ordered step registration.
- Step item with label, optional description, and state.
- Controlled API via `value` + `valueChange`.
- Uncontrolled API via `defaultValue`.
- Disabled step support.
- Optional/completed/error state support.
- Linear and non-linear activation policies.

### Accessibility

- Root has an accessible name via `aria-label` or `aria-labelledby`.
- Current step trigger has `aria-current="step"`.
- Trigger exposes position text for AT (for example `Step 2 of 5` in accessible label/description).
- Disabled trigger exposes `aria-disabled="true"`.
- Optional state is announced in accessible text.
- Error state is announced in accessible text.

### Interaction

- Pointer click activates focused/clicked step when allowed.
- `Enter`/`Space` activates focused step when allowed.
- Disabled steps are never activatable.
- In linear mode, blocked future steps do not activate.

### Composition

- `StepperRoot`
- `StepperItem`
- `StepperTrigger`
- `StepperLabel`
- `StepperDescription`
- `StepperPanel` (optional, if content is managed inside stepper)
- `StepperConnector` (presentational hook)

## Suggested APIs

### Stepper root

- `value?: string | number`
- `defaultValue?: string | number`
- `valueChange?: (value: string | number) => void`
- `orientation?: 'horizontal' | 'vertical'`
- `linear?: boolean`
- `loopFocus?: boolean` (default `true`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

### Step item

- `value: string | number` (required, unique)
- `completed?: boolean`
- `optional?: boolean`
- `disabled?: boolean`
- `error?: boolean`
- `label?: string`
- `description?: string`

### Angular API contract (required)

- Root inputs: `value`, `defaultValue`, `orientation`, `linear`, `loopFocus`, `ariaLabel`, `ariaLabelledby`
- Root output: `valueChange`
- Step inputs: `value`, `completed`, `optional`, `disabled`, `error`, `label`, `description`
- Trigger is focusable and keyboard activatable

## Keyboard interaction (locked)

- `Tab`:
  - Enters trigger row on current step trigger (or last focused trigger).
  - Leaves trigger row to next tabbable element (do not trap focus).
- `Shift+Tab`:
  - Moves out naturally in reverse order.
- Horizontal orientation:
  - LTR: `ArrowRight` next enabled trigger, `ArrowLeft` previous enabled trigger.
  - RTL: `ArrowRight` previous enabled trigger, `ArrowLeft` next enabled trigger.
- Vertical orientation:
  - `ArrowDown` next enabled trigger, `ArrowUp` previous enabled trigger.
- `Home` focuses first enabled trigger.
- `End` focuses last enabled trigger.
- `Enter`/`Space` activates focused trigger if allowed by linear/disabled rules.

## Linear mode policy (locked)

- Step ids are in visual order as registered.
- If `linear=true`:
  - Activating a future step is blocked unless marked completed by consumer policy.
  - Current and prior completed steps are activatable.
  - Blocked activation must not emit `valueChange`.
- If `linear=false`:
  - Any enabled step is activatable.

## Dynamic behavior policy (locked)

- If selected step is removed:
  - Move to nearest enabled previous step.
  - If none, move to nearest enabled next step.
  - If none, no selection.
- If selected step becomes disabled:
  - Move using same nearest-enabled rule.
- Adding/reordering steps does not reset selection when selected `value` still exists.
- Duplicate `value` registration is invalid and should warn in dev mode.

## Data attributes contract

- Root:
  - `data-slot="stepper"`
  - `data-orientation="horizontal|vertical"`
  - `data-linear`
- Item/trigger:
  - `data-slot="stepper-trigger"`
  - `data-state="current|completed|upcoming|disabled|error"`
  - `data-optional`
  - `data-step-index="<number>"`

## Open design decisions

- Whether `StepperPanel` belongs in primitive v1 or wrapper/component layer.
- Whether connectors should be explicit primitive parts or pure styling hooks.
- Whether linear policy should support an explicit `canActivate(step)` guard callback in v1.

## Test checklist

### A) Rendering and structure

- [ ] Renders root and ordered step triggers.
- [ ] Applies orientation attributes correctly.
- [ ] Exactly one step is current when value is set.
- [ ] Optional/completed/error/disabled states render correct hooks.

### B) Accessibility

- [ ] Root has accessible name (`aria-label` or `aria-labelledby`).
- [ ] Current step has `aria-current="step"`.
- [ ] Non-current steps do not have `aria-current`.
- [ ] Disabled steps expose `aria-disabled`.
- [ ] Position text (step X of Y) is exposed for AT.
- [ ] Optional/error/completed state text is announced.

### C) Focus and roving tabindex

- [ ] Only one trigger is tabbable (`tabindex=0`), others `-1`.
- [ ] Tab enters on current or last-focused trigger.
- [ ] Arrow keys move focus among enabled triggers.
- [ ] Home/End move focus to first/last enabled.
- [ ] Disabled triggers are skipped by roving focus.

### D) Activation behavior

- [ ] Click activates step when allowed.
- [ ] Enter activates focused step when allowed.
- [ ] Space activates focused step when allowed.
- [ ] Disabled step never activates via click/keyboard.

### E) Linear mode behavior

- [ ] In linear mode, future incomplete step activation is blocked.
- [ ] In linear mode, previous completed steps are activatable.
- [ ] Blocked activation does not emit `valueChange`.
- [ ] In non-linear mode, any enabled step activates.

### F) Controlled behavior

- [ ] Controlled `value` drives current step.
- [ ] User activation emits `valueChange` with next step value.
- [ ] Controlled step does not visually change until host updates input.

### G) Uncontrolled behavior

- [ ] Uses `defaultValue` as initial current step.
- [ ] Without `value/defaultValue`, selects first enabled step.
- [ ] Uncontrolled activation updates internal current step.

### H) Dynamic children

- [ ] Removing current step selects nearest enabled fallback.
- [ ] Disabling current step selects nearest enabled fallback.
- [ ] Reordering steps preserves selection by `value`.
- [ ] Duplicate values trigger dev warning.

### I) Orientation and RTL

- [ ] Horizontal LTR arrow behavior is correct.
- [ ] Horizontal RTL arrow behavior is reversed correctly.
- [ ] Vertical arrow behavior uses Up/Down only.

### J) Data attributes

- [ ] Root `data-orientation` and `data-linear` update reactively.
- [ ] Trigger `data-state` reflects state transitions.
- [ ] `data-step-index` reflects DOM order changes.

### K) Integration (if panels are included)

- [ ] Active panel tracks current step.
- [ ] Inactive panels hidden correctly.
- [ ] Panel linkage (`aria-controls` / `aria-labelledby`) is valid.

### L) Edge cases

- [ ] Zero-step scenario does not throw.
- [ ] Single-step scenario maintains stable focus and selection.
- [ ] Invalid controlled `value` falls back predictably.
- [ ] Rapid updates do not produce expression-changed errors.

## Implementation Steps

1. [x] Headless primitive created in `primitives`
2. [x] Headless tests added in `__tests__`
3. [x] Plain CSS playground demo added
4. [x] Tailwind playground demo added
5. [x] Styled `<tng-stepper>` wrapper created in `components`
6. [x] Wrapper tests added in `components/__tests__`
7. [x] Plain CSS wrapper demo added
8. [x] Tailwind wrapper demo added
9. [x] Docs overview page added/updated
10. [x] Docs API page added/updated
11. [x] Docs styling page added/updated
12. [x] Docs examples page added/updated
13. [x] Registry templates added (`tailng add stepper`)
14. [x] CLI generator wired for stepper
15. [x] CLI integration tests added

## Links

- Docs route: `/components/layout/stepper`
- Playground route: `/stepper`
