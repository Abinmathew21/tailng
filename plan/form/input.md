# Input

Headless input primitive for text fields, adornments, and layout patterns.

## Overview

Input is a headless form control that wraps a native text control (input or textarea) with a consistent layout: optional label, hint (description or error), and leading/trailing slots for icons, buttons, or text. The actual control uses a directive (e.g. tngInput) for ARIA and behavior; the wrapper provides structure and association. Supports size (sm, md, lg), required, disabled, and validation messaging.

This component should expose structure (root, label, control, leading, trailing, hint), association (label for, aria-describedby), and state while leaving visual styling to the consumer.

## Supported states

- Default / focused / focus-visible
- disabled, readonly
- required, invalid
- Size: sm | md | lg (styling hint)
- With/without leading, trailing, hint

## Common use cases

- Text fields with optional label and hint
- Input with leading icon (search, user)
- Input with trailing (clear button, visibility toggle)
- Validation and error message below
- Composes with form layout and validation messaging
- Size variants for density

## Headless component goals

- Provide structure: root, label, control (input/textarea), leading slot, trailing slot, hint
- Associate label with control (for/id or aria-labelledby)
- Associate hint/error with control (aria-describedby)
- Support required, disabled, invalid for ARIA and styling
- Expose data attributes for size and state
- No default styling; consumer or styled component adds visuals

## Required headless features

### Core behavior

- Input root (wrapper) with slots: label, leading, control, trailing, hint
- Control directive on native input or textarea: id, aria-* pass-through
- Label: for attribute or aria-labelledby when id on control
- Hint: id and aria-describedby on control when present
- Required, disabled, invalid reflected on control and root
- Optional: size (sm, md, lg) as data attribute

### Accessibility

- Label associated with control (click focuses control)
- Hint and error linked via aria-describedby
- required → aria-required; invalid → aria-invalid; disabled → disabled
- Focus management: focus on control; focus-visible for styling
- Accessible name from label or aria-label

### Interaction

- Native input/textarea behavior (type, focus, blur)
- Label click focuses control
- Leading/trailing may contain buttons (e.g. clear); no default behavior in primitive
- Disabled and readonly prevent edit

### Composition

- Input root (wrapper)
- Input label (optional)
- Input leading (slot)
- Input control (directive on input/textarea)
- Input trailing (slot)
- Input hint / error (optional)

### State exposure

- data-disabled, data-required, data-invalid on root and/or control
- data-size (sm, md, lg)
- data-focused, data-focus-visible on control
- data-slot for each part

## Suggested primitives / parts

- `InputRoot` (wrapper; e.g. tng-input component or structural directive)
- `InputLabel`
- `InputLeading` (e.g. tngInputLeading)
- `InputControl` (e.g. tngInput on input)
- `InputTrailing` (e.g. tngInputTrailing)
- `InputHint` / `InputError`

## Suggested APIs

### Input root

- `size?: 'sm' | 'md' | 'lg'`
- `disabled?: boolean`, `required?: boolean`, `invalid?: boolean`
- Optional: id (for control if auto-generated), labelId, hintId
- Structural; passes through to control and label/hint

### Input label

- Optional for attribute (when control has id)
- Content: label text; optional required indicator

### Input control

- Native input/textarea with directive
- id, aria-label, aria-labelledby, aria-describedby, aria-required, aria-invalid, disabled, readonly
- Value binding and events from native element
- Optional: form, name, type, placeholder, etc.

### Input hint

- id for aria-describedby
- Content: helper text or error message
- Optional: data-invalid when error

### Angular API contract (required)

- tng-input (component or host): size, disabled, required, invalid; projects label, leading, control, trailing, hint
- tngInput directive on input/textarea: ARIA and id coordination
- tngInputLeading, tngInputTrailing structural or host directives
- Label and hint must associate with control (id/for and aria-describedby)
- ControlValueAccessor on control when used with forms

## Keyboard interaction

- Tab: focus control (or next focusable in trailing)
- Native text input behavior (arrows, backspace, etc.)
- Label click focuses control
- No special keys in primitive; trailing buttons have their own behavior

## Accessibility notes

- One-to-one label and control association
- Hint and error must be in aria-describedby so AT announces them
- Required and invalid must be on control for AT
- Ensure sufficient contrast and touch target for leading/trailing icons

## Form behavior

- Control integrates with Angular forms (formControlName, ngModel) when ControlValueAccessor is on the control
- name, value, form on native input for native form submission
- Disabled and touched/dirty from forms API

## Open design decisions

- Whether root is a component (tng-input) or only directives
- Auto-generated id for control vs. consumer-provided
- Hint vs. error: single slot with state or separate slots

## Test checklist

### Rendering

- [x] Renders root with label, control, leading, trailing, hint when provided
- [x] Control has correct id and type
- [x] Size and state (disabled, required, invalid) applied
- [x] Applies data-size, data-disabled, data-required, data-invalid, data-slot

### Accessibility

- [x] Label associates with control (for/id or aria-labelledby)
- [x] Hint/error in aria-describedby
- [x] required, disabled, invalid on control
- [x] Focus moves to control on label click
- [x] Focus-visible on control

### Form integration

- [x] Works with formControlName, ngModel
- [x] Disabled and touched propagate

### Data attributes

- [x] data-size, data-disabled, data-required, data-invalid, data-focused, data-focus-visible, data-slot

## Implementation Steps

1. [x] Headless component created in `primitives` (tngInput, tngInputLeading, tngInputTrailing)
2. [x] Test cases created for headless (ARIA spec)
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-input>` component created in `components`
6. [x] Test cases created for `<tng-input>`
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add input`)
14. [x] `tailng-cli` command generation added for input artifacts
15. [x] CLI integration tests added for `tailng add input`

## Links

- Docs route: `/components/form/input`
- Playground: `/input` (if present)
