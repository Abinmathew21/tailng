# Textarea

Headless textarea primitive for multiline text input.

## Overview

Textarea is a headless form control for multi-line text: native &lt;textarea&gt; with optional resize (none, vertical, both), min/max rows or height, and placeholder. Same accessibility patterns as input: label and hint association, required, disabled, invalid. Composes with form layout and validation messaging. Optional character count.

This component should expose textarea directive (or wrapper with slots), resize behavior, and label/hint association while leaving styling to the consumer.

## Supported states

- Default / focused / focus-visible
- disabled, readonly
- required, invalid
- Resize: none | vertical | both | horizontal (browser-dependent)
- With/without label, hint, character count

## Common use cases

- Long-form text (description, comment, bio)
- Optional resize (none, vertical, both); row/col or min-height
- Label and hint association; optional character count
- Composes with form layout and validation messaging
- Same patterns as input for a11y

## Headless component goals

- Provide textarea control with optional wrapper (label, hint)
- Support resize (CSS or attribute); rows, cols, min/max
- Associate label and hint (for/id, aria-describedby)
- Support required, disabled, invalid, readonly
- Expose data attributes for state and styling
- Optional: character count (maxlength, current length) for display/aria
- ControlValueAccessor for form integration

## Required headless features

### Core behavior

- Textarea directive on native &lt;textarea&gt; or wrapper with label/hint slots
- id, aria-label, aria-labelledby, aria-describedby, aria-required, aria-invalid
- resize: none | vertical | both (or horizontal where supported)
- rows, cols; optional min-height/max-height via CSS or attributes
- placeholder, disabled, readonly
- Optional: maxlength and character count display
- Value and events from native textarea

### Accessibility

- Label associated with textarea (for/id or aria-labelledby)
- Hint/error in aria-describedby
- required, disabled, invalid on textarea
- If character count: announce remaining or current/max (e.g. aria-describedby or live region)
- Focus-visible for keyboard users

### Interaction

- Native textarea behavior (type, focus, blur, resize)
- Label click focuses textarea
- Disabled and readonly prevent edit

### Composition

- Textarea root (optional wrapper with label, hint)
- Textarea control (directive on textarea)
- Optional: label, hint, character count
- Composes with form and validation

### State exposure

- data-disabled, data-required, data-invalid, data-readonly
- data-resize (none, vertical, both)
- data-focused, data-focus-visible
- data-slot
- Optional: data-count (for character count styling)

## Suggested primitives / parts

- `TextareaRoot` (optional wrapper; like input root)
- `TextareaControl` (preferred: textarea[tngInput]; compatibility alias: textarea[tngTextarea])
- `TextareaLabel`, `TextareaHint` (optional)
- Optional: TextareaCount (character count)

## Suggested APIs

### Textarea root

- Optional wrapper: size, disabled, required, invalid
- Projects label, control, hint, count
- Same pattern as input root

### Textarea control

- Directive on &lt;textarea&gt;
- id, aria-*, placeholder, rows, cols, resize (style or attribute), minlength, maxlength
- disabled, readonly, required
- Value and (valueChange or ngModel/formControl) from native
- Optional: maxlength for character count

### Angular API contract (required)

- Prefer `tngInput` on textarea for shared ARIA/state behavior parity with input
- Optional `tngTextarea` compatibility alias on textarea for rows/resize ergonomics
- Optional tng-textarea component with label/hint/count like input
- ControlValueAccessor for form integration
- Optional character count component/directive when maxlength set

## Keyboard interaction

- Tab: focus textarea
- Native textarea keys (arrows, Enter, backspace, etc.)
- Label click focuses textarea
- No special keys in primitive

## Accessibility notes

- Same as input: label and hint association
- resize: ensure minimum size so content is usable
- Character count: expose to screen readers (e.g. in aria-describedby or live region)
- Ensure sufficient contrast and line height for readability

## Form behavior

- Integrates with Angular forms (formControlName, ngModel)
- name, value for submission
- minlength, maxlength for validation
- Touched, dirty, disabled from forms API

## Open design decisions

- Textarea as directive-only vs. component with label/hint like input
- Character count in primitive vs. separate component
- Auto-resize (grow with content) vs. fixed rows

## Test checklist

### Rendering

- [ ] Renders textarea (and optional label, hint)
- [ ] resize applied (none, vertical, both)
- [ ] rows, cols, placeholder work
- [ ] disabled, required, invalid applied
- [ ] Optional character count when maxlength set
- [ ] Applies data-disabled, data-required, data-invalid, data-resize, data-slot

### Accessibility

- [ ] Label and hint associated
- [ ] required, disabled, invalid on textarea
- [ ] Focus and focus-visible
- [ ] Character count announced when implemented

### Form integration

- [ ] Works with formControlName, ngModel
- [ ] minlength, maxlength validation
- [ ] Touched, dirty, disabled propagate

### Data attributes

- [ ] data-disabled, data-required, data-invalid, data-focused, data-focus-visible, data-slot

## Implementation Steps

1. [ ] Headless component created in `primitives` (textarea directive)
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [ ] Minimum style `<tng-textarea>` component created in `components`
6. [ ] Test cases created for `<tng-textarea>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add textarea`)
14. [ ] `tailng-cli` command generation added for textarea artifacts
15. [ ] CLI integration tests added for `tailng add textarea`

## Links

- Playground: `/textarea`
