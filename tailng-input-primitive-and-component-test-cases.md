# TailNG Input — Categorized Test Cases (TDD)

> Architecture assumed:
> - [ ] **Primitives (`@tailng-ui/primitives`)**
>   - [ ] `tngInput` directive (headless control behavior) for `input[tngInput], textarea[tngInput]`
>   - [ ] `tngInputGroup` component (headless structure + slot detection)
>   - [ ] `tngInputLeading` / `tngInputTrailing` directives (slot markers)
> - [ ] **Styled (`@tailng-ui/components`)**
>   - [ ] `<tng-input>` component that composes `tngInputGroup` + `tngInput` and provides styling hooks
>
> Slot naming: **leading / trailing** (no prefix/suffix).

---

## A) Primitive — `tngInput` exports & attachment
- [X] Exports the `tngInput` directive
- [X] Attaches to a native `<input tngInput>` host without errors
- [X] Attaches to a native `<textarea tngInput>` host without errors
- [X] Does not attach to unsupported hosts and fails safely (no throw)

---

## B) Primitive — native attributes & coercion (`tngInput`)
- [X] Coerces `disabled=""` to true (boolean attribute behavior)
- [X] Coerces `readonly=""` to true (if supported)
- [X] Coerces `required=""` to true (if supported)
- [X] Applies native `disabled` attribute only when `disabled=true`
- [X] Applies native `readonly` attribute only when `readonly=true`
- [X] Applies native `required` attribute only when `required=true`
- [X] Preserves consumer-provided `type`, `name`, `placeholder`, `autocomplete` attributes (no clobber)
- [X] Preserves consumer-provided `tabindex` (does not override)

---

## C) Primitive — ARIA pass-through (`tngInput`)
- [X] Reflects `ariaLabel` as `aria-label` when provided (if supported)
- [X] Reflects `ariaLabelledby` as `aria-labelledby` when provided (if supported)
- [X] Reflects `ariaDescribedby` as `aria-describedby` when provided (if supported)
- [X] Reflects `ariaInvalid=true` as `aria-invalid="true"` (if supported)
- [X] Omits ARIA attributes when inputs are null/empty per normalization contract
- [X] Does not generate invalid ARIA values for booleans (uses correct string mapping)

---

## D) Primitive — ID behavior (`tngInput`) (if you generate ids)
- [X] Preserves a user-provided `id` and does not overwrite it
- [X] Generates a stable id when none is provided
- [X] Does not generate duplicate ids across multiple input instances
- [X] Keeps generated id stable across rerenders

---

## E) Primitive — focus/interaction invariants (`tngInput`)
- [X] Does not prevent default typing or composition events
- [X] Does not interfere with `Enter` key submission on text inputs
- [X] Does not stop propagation of native `input`/`change` events
- [X] Disabled input remains non-focusable via native browser behavior (no extra tabindex hacks)

---

## F) Primitive — `tngInputGroup` exports & basic structure
- [X] Exports the `tngInputGroup` component
- [X] Renders group container without errors with only an input projected
- [X] Renders without leading/trailing slots without creating empty wrappers (per contract)
- [X] Preserves consumer-provided classes and unrelated attributes on the group host

---

## G) Primitive — slot markers (`tngInputLeading` / `tngInputTrailing`)
- [X] Exports the `tngInputLeading` directive
- [X] Exports the `tngInputTrailing` directive
- [X] Detects presence of a leading slot and sets `data-has-leading` on the group
- [X] Detects presence of a trailing slot and sets `data-has-trailing` on the group
- [X] Removing leading content at runtime clears `data-has-leading`
- [X] Removing trailing content at runtime clears `data-has-trailing`

---

## H) Primitive — group state hooks derived from the control
- [X] When the projected `tngInput` is disabled, group reflects `data-disabled`
- [X] When the projected `tngInput` is enabled, group omits `data-disabled`
- [X] When the projected `tngInput` is invalid, group reflects `data-invalid` (if supported)
- [X] Group updates state hooks when the input state changes at runtime
- [X] Group remains stable when multiple inputs are projected (fails safely or enforces single control per contract)

---

## I) Primitive — DOM order & projection contract
- [X] Renders leading slot before the control in the DOM
- [X] Renders trailing slot after the control in the DOM
- [X] Preserves projection order of nested content inside leading/trailing slots
- [X] Does not duplicate projected nodes on rerender

---

## J) Primitive — cleanup & lifecycle
- [X] Removes observers/listeners on destroy (if any are used)
- [X] Unregisters projected controls on destroy without leaving stale references
- [X] Does not throw when destroyed while inputs/slots are changing

---

## K) Styled component — `<tng-input>` smoke & composition
- [X] Renders `<tng-input>` without errors with a projected `<input tngInput>`
- [X] Renders `<tng-input>` with both leading and trailing content without errors
- [X] Applies expected base styling class hooks on the group and control (if asserted)
- [X] Does not require consumers to pass any optional styling inputs

---

## L) Styled component — design tokens & data attributes
- [ ] Applies `data-size` reflecting the `size` input
- [ ] Applies `data-variant` reflecting the `variant` input
- [ ] Applies `data-tone` reflecting the `tone` input
- [ ] Applies `data-full-width` (or class hook) when `fullWidth=true` (if supported)
- [ ] Updates token attributes when inputs change at runtime

---

## M) Styled component — interactive visual states (styling hooks)
- [ ] Disabled input produces disabled styling hooks on the wrapper (via `data-disabled`)
- [ ] Invalid input produces invalid styling hooks on the wrapper (via `data-invalid`)
- [ ] Presence of leading/trailing produces spacing hooks and does not overlap the text
- [ ] Focus-within of the control produces focus styling hook on the wrapper (if asserted)

---

## N) Styled component — accessibility basics
- [ ] Does not introduce extra tab stops beyond the actual input control
- [ ] Leading/trailing adornments are not focusable unless the consumer provides focusable content
- [ ] Icon-only adornments are marked `aria-hidden="true"` when decorative (consumer responsibility or helper contract)
- [Z] Does not apply `aria-live` or announcements by default

---

## O) Multiple instances & isolation
- [ ] Multiple `<tng-input>` instances do not leak slot detection state across siblings
- [ ] Multiple instances keep ids unique and stable (if id generation exists)
- [ ] Styling hooks remain scoped per instance and do not affect other inputs

---

## P) Edge cases
- [ ] Works with `<textarea tngInput>` inside `<tng-input>` group
- [ ] Works with `type="search"` inputs without breaking layout
- [ ] Very long placeholder/value does not break DOM structure (overflow stable)
- [ ] Rapid toggle of disabled/invalid does not leave stale attributes or classes

---
