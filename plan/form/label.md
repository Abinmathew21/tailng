# Label

Headless label primitive for accessible form labels.

## Overview

Label associates label text with a form control so screen readers and click-to-focus work correctly. Can wrap the control (implicit association) or use for/id linking when the control is elsewhere. One label per control; optional required indicator. Composes with input, checkbox, radio, select, and any focusable form control.

This component should expose label element (or directive) and association (for/id or wrapping) while leaving styling to the consumer.

## Supported states

- Default (no state; label is static text)
- Optional: disabled styling when associated control is disabled (via CSS or data attribute from parent)
- Optional: required indicator (asterisk or text)
- Optional: invalid styling when control is invalid

## Common use cases

- Label for text input, textarea, select
- Label for checkbox and radio (click toggles)
- One label per control; optional required indicator
- Clicking label focuses (or toggles) the linked control
- Composes with input, checkbox, radio, select

## Headless component goals

- Provide correct label-to-control association
- Support two patterns: wrap control (implicit) or for/id (explicit)
- Optional required indicator (visual only; aria-required on control)
- Ensure click on label activates control (focus or toggle)
- Expose data attributes for styling (e.g. data-required when required)
- No default styling; consumer adds visuals

## Required headless features

### Core behavior

- Label element (e.g. <label>) or directive that renders label
- Association: for attribute with control id (when control has id), or wrap control for implicit association
- Optional: required indicator (slot or prop); should not duplicate aria-required (that stays on control)
- When used with checkbox/radio: click on label toggles control (native behavior when associated)

### Accessibility

- Label must be programmatically associated with control (for/id or wrapping)
- One visible label per control; avoid duplicate labels
- Required indicator is visual; control must have aria-required
- Screen readers announce label as control name
- Clicking label must focus control (or trigger toggle for checkbox/radio)

### Interaction

- Click: focus linked control (or toggle if checkbox/radio)
- No keyboard-specific behavior on label; Tab moves to control

### Composition

- Label root (single element or directive)
- Optional: required indicator (text or slot)
- Composes with any form control that accepts id and can receive focus or be toggled

### State exposure

- data-slot="label"
- Optional: data-required when required indicator shown (for styling)
- Optional: data-disabled when control disabled (if parent exposes)
- Optional: data-invalid when control invalid (if parent exposes)

## Suggested primitives / parts

- `LabelRoot` (e.g. tngLabel directive on label, or component)
- Optional: LabelRequired (indicator)

## Suggested APIs

### Label root

- `for?: string` (id of control when not wrapping)
- When wrapping: no for needed; control must be child
- Optional: required (boolean) for showing required indicator (control still needs aria-required)
- Optional: id (for aria-labelledby from control when control references label)
- Content: label text; optional required indicator

### Angular API contract (required)

- tngLabel: directive on <label> or component; for input when control id provided
- When control and label are in same component, ensure id on control and for on label (or wrap)
- Optional: required input for asterisk/indicator; control must set aria-required
- Must not set aria-required on label; only on control

## Keyboard interaction

- Label is not focusable; Tab moves to control
- No direct keyboard behavior on label
- Activating label (click) focuses or toggles control

## Accessibility notes

- Never rely on placeholder as sole label; use explicit label
- One-to-one: one label per control
- Do not put interactive elements (buttons, links) inside label (nested activatable can cause issues)
- Required: indicate visually; control must have aria-required="true"

## Form behavior

- Label does not participate in form value; it only associates with control
- Control (input, checkbox, etc.) is what form binds to
- Label association improves form usability and a11y

## Open design decisions

- Label as directive only vs. component with projection
- Required indicator: part of label primitive vs. consumer-provided
- Whether label can receive data-disabled/data-invalid from parent control (reactive styling)

## Test checklist

### Rendering

- [x] Renders label element with correct text
- [x] for attribute matches control id when used
- [x] When wrapping, control is descendant
- [x] Optional required indicator shown when required=true
- [x] Applies data-slot; optional data-required

### Accessibility

- [x] Clicking label focuses control (when for/id or wrap)
- [x] Clicking label toggles checkbox/radio when associated
- [x] Screen reader announces label as name of control
- [x] Only one label per control in DOM

### Association

- [x] for and control id match when explicit association
- [x] Wrapped control gets implicit association
- [x] Control has aria-labelledby or is labelled by label (native)

### Data attributes

- [x] data-slot="label"; optional data-required

## Implementation Steps

1. [x] Headless component created in `primitives` (or label is component/directive in components)
2. [x] Test cases created for headless
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style label component/directive created in `components`
6. [x] Test cases created for label
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add label`)
14. [x] `tailng-cli` command generation added for label artifacts
15. [x] CLI integration tests added for `tailng add label`

## Links

- Playground: `/label`
