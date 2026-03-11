# Stepper

Headless stepper primitive for multi-step linear flows (e.g. wizards, checkout).

## Overview

Stepper is a headless layout component that shows steps in a linear flow. Each step can show label, optional description, and completion state; the current step is indicated. Steps may be clickable for navigation; layout can be horizontal or vertical. It composes with form sections or route-based step content.

This component exposes step structure, current index, completion state, and optional navigation behavior while leaving visual design to the consumer.

## Supported states

- Current step index (active step)
- Per step: completed, optional, disabled, error (optional)
- Orientation: horizontal | vertical
- Linear vs. non-linear (whether user can jump to any step or must go in order)

## Common use cases

- Checkout or signup wizard
- Multi-step forms
- Linear onboarding
- Route-based steps with back/next
- Optional step labels and connectors

## Headless component goals

- Provide accessible stepper semantics (role, aria-current, step position)
- Support horizontal and vertical layout
- Support current step, completed, optional (and optionally error) state
- Support keyboard and pointer navigation between steps
- Compose with form or route content per step

## Required headless features

### Core behavior

- Stepper root with list of steps
- Step item: label, optional description, state (current, completed, optional, disabled, error)
- Controlled current step (index or value)
- Optional: step change output for navigation
- Linear vs. non-linear mode (optional)

### Accessibility

- Root: role="group" or list semantics; aria-label
- Step: aria-current="step" for current; aria-selected or similar where applicable
- Step position and total (e.g. "Step 2 of 4") for screen readers
- Optional step state announced (completed, optional)

### Interaction

- Click on step (if not linear or if allowed) to navigate
- Keyboard: Tab to focus steps; Enter/Space to activate; arrows optional for step focus
- Disabled steps not clickable

### Composition

- Stepper root
- Step item (trigger/indicator + optional label/description)
- Step content (projected per step or external)
- Optional connector between steps

### State exposure

- data-state (current, completed, optional, disabled, error) per step
- data-orientation on root
- data-step-index or similar

## Suggested primitives / parts

- `StepperRoot`
- `StepperStep` / `StepperItem`
- `StepperTrigger` (clickable step indicator)
- `StepperLabel`, `StepperDescription`
- `StepperConnector` (optional)

## Suggested APIs

### Stepper root

- `value?: number | string` (current step index or id)
- `defaultValue?: number | string`
- `valueChange?: (value: number | string) => void`
- `orientation?: 'horizontal' | 'vertical'`
- `linear?: boolean` (must complete in order)
- `ariaLabel?: string`

### Stepper step

- `value: number | string` (step id or index)
- `completed?: boolean`
- `optional?: boolean`
- `disabled?: boolean`
- `error?: boolean`
- `label`, `description` (optional)

### Angular API contract (required)

- Stepper root: inputs value, defaultValue, orientation, linear; output valueChange
- Step: inputs value, completed, optional, disabled, error, label, description
- Step trigger should be focusable and keyboard activatable

## Keyboard interaction

- Tab: move focus between step triggers and step content
- Enter / Space: activate step (navigate to that step if allowed)
- Arrows (optional): move focus between step indicators in orientation direction

## Accessibility notes

- aria-current="step" on the current step
- Expose step position and total (e.g. "Step 2 of 4") for AT
- Completed and optional state should be clear to screen readers

## Open design decisions

- Step identification: index vs. string id
- Whether step content is projected inside stepper or managed externally (e.g. by route)
- Connector as primitive or purely presentational

## Test checklist

### Rendering

- [ ] Renders stepper root with correct orientation
- [ ] Renders all steps with labels/state
- [ ] Renders current step with aria-current
- [ ] Renders completed, optional, disabled, error states
- [ ] Applies data attributes (data-state, data-orientation)

### Accessibility

- [ ] Root has aria-label
- [ ] Current step has aria-current="step"
- [ ] Step position/total exposed for AT
- [ ] Step triggers are focusable

### Keyboard and pointer

- [ ] Tab focuses step triggers and content
- [ ] Enter/Space activate step when allowed
- [ ] Click navigates to step when allowed
- [ ] Disabled steps not activatable

### Controlled behavior

- [ ] Supports controlled value (current step)
- [ ] Emits valueChange when step changes
- [ ] Does not change step without controlled update when controlled

### Data attributes

- [ ] Applies data-state, data-orientation, data-step-index (or equivalent)

## Implementation Steps

1. [ ] Headless component created in `primitives` (minimal root may exist; full stepper TBD)
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [ ] Minimum style `<tng-stepper>` component created in `components`
6. [ ] Test cases created for `<tng-stepper>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add stepper`)
14. [ ] `tailng-cli` command generation added for stepper artifacts
15. [ ] CLI integration tests added for `tailng add stepper`

## Links

- Playground: `/stepper`
