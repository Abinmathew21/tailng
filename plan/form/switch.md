# Switch

Headless switch primitive for two-state on/off control.

## Overview

Switch is a headless form control optimized for binary settings (e.g. enable/disable, dark mode). It behaves like a checkbox but is typically rendered as a toggle track with thumb. Supports controlled and uncontrolled state, disabled, and form integration. Keyboard (Space) toggles; focus-visible for accessibility.

This component should expose behavior, accessibility, and state while leaving visual styling (track/thumb) to the consumer.

## Supported states

- checked / unchecked
- disabled
- required, invalid (optional)
- focused, focus-visible

## Common use cases

- Settings toggles (notifications, theme)
- Enable/disable options in forms
- Optional on/off labels
- Composes with form and label; controlled or uncontrolled

## Headless component goals

- Provide accessible switch semantics (role="switch", aria-checked)
- Support two-state only (no mixed)
- Support controlled and uncontrolled APIs
- Support form integration (ControlValueAccessor)
- Keyboard: Space toggles; focus-visible state
- Expose state for custom track/thumb styling

## Required headless features

### Core behavior

- Switch root: checked, defaultChecked, checkedChange
- disabled, required, invalid (optional)
- Native form compatibility (name, value, form) when using hidden input or CVA
- Reset behavior with form reset

### Accessibility

- role="switch" (when not native input)
- aria-checked="true"|"false"
- aria-disabled, aria-required, aria-invalid when applicable
- Label association (label or aria-label)
- Focus-visible state exposure

### Interaction

- Space toggles
- Click (or tap on track/thumb) toggles
- Label click focuses and toggles
- Disabled prevents toggle

### Composition

- SwitchRoot (hosts control)
- Optional: SwitchThumb (visual only)
- Label via native label or aria-label

### State exposure

- data-checked, data-unchecked (or data-state)
- data-disabled, data-required, data-invalid
- data-focused, data-focus-visible

## Suggested primitives / parts

- `SwitchRoot` (e.g. button[tngSwitch])
- `SwitchThumb` (optional; for styling)

## Suggested APIs

### Switch root

- `checked?: boolean`, `defaultChecked?: boolean`
- `checkedChange?: (checked: boolean) => void`
- `disabled?: boolean`, `required?: boolean`, `invalid?: boolean`
- `name?: string`, `value?: string`, `id?: string`, `form?: string`
- `aria-label?`, `aria-labelledby?`, `aria-describedby?`

### Angular API contract (required)

- tngSwitch: inputs checked, defaultChecked, disabled, required, invalid, name, value, id, form; output checkedChange
- Should implement ControlValueAccessor for form integration
- Use native button with role="switch" or ensure equivalent semantics

## Keyboard interaction

- Tab: focus switch
- Space: toggle
- Shift+Tab: move focus away

## Accessibility notes

- role="switch" and aria-checked are required when not using native input
- Ensure track/thumb have sufficient contrast and touch target size
- Label must provide accessible name

## Form behavior

- Integrate with Angular forms (formControlName, ngModel)
- Form reset restores defaultChecked
- Optional hidden input for submission

## Open design decisions

- Native input type="checkbox" with switch styling vs. role="switch" on button
- Whether required/invalid are in scope for switch

## Test checklist

### Rendering

- [ ] Renders unchecked by default
- [ ] Renders checked when checked=true
- [ ] Renders disabled, required, invalid correctly
- [ ] Applies data-state, data-disabled, data-focused, data-focus-visible

### Accessibility

- [ ] Exposes role="switch" and aria-checked
- [ ] Exposes aria-disabled, aria-required when set
- [ ] Label association works
- [ ] Focus visible on keyboard focus

### Keyboard and pointer

- [ ] Space toggles
- [ ] Click toggles
- [ ] Disabled does not toggle

### Controlled / uncontrolled

- [ ] Supports controlled checked
- [ ] Emits checkedChange
- [ ] Supports defaultChecked and updates on interaction

### Form integration

- [ ] Works with formControl/formControlName/ngModel
- [ ] Propagates touched and disabled

### Data attributes

- [ ] Applies data-checked/data-state, data-disabled, data-focused, data-focus-visible

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-switch>` component created in `components`
6. [x] Test cases created for `<tng-switch>`
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add switch`)
14. [ ] `tailng-cli` command generation added for switch artifacts
15. [ ] CLI integration tests added for `tailng add switch`

## Links

- Docs route: `/components/form/switch`
- Playground: `/switch`
