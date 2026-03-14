# Accordion

Headless accordion primitive for expand/collapse panels (single or multiple open).

## Overview

Accordion is a headless layout component: a vertical list of items, each with a trigger and a panel. Clicking a trigger toggles that item’s panel open or closed. In single mode only one panel is open at a time; in multiple mode several panels can be open. It is keyboard navigable (arrows, Enter, Space) and supports controlled/uncontrolled value, disabled items, collapsible trigger (allow closing the open item), and optional lazy/keepAlive panel content.

This component should expose behavior, accessibility, and state for styling; animation and visual design are left to the consumer.

## Supported states

- Per item: expanded / collapsed, disabled
- Accordion: type (single | multiple), value (open value(s))
- Trigger: focused, focus-visible
- Optional: lazy (panel content only rendered when expanded once), keepAlive (keep in DOM when closed)

## Common use cases

- FAQ sections
- Settings or documentation sections
- Single-expand (collapse others) or multi-expand
- Nested accordions (accordion inside panel)
- Optional step-like flows (linear open one at a time)

## Headless component goals

- Provide accessible accordion semantics (aria-expanded, aria-controls, role="region" for panels)
- Support single vs. multiple expanded panels
- Support controlled and uncontrolled value
- Support keyboard: arrows move focus, Enter/Space toggle
- Support disabled items and optional collapsible trigger (close open item)
- Optional lazy and keepAlive for panel content
- Expose state for custom rendering and animation

## Required headless features

### Core behavior

- Accordion root: type (single/multiple), value/defaultValue, valueChange
- Accordion item: value (string/number), disabled
- Trigger toggles panel; in single type, opening one closes others
- Optional collapsible: in single type, allow closing the open item (no panel forced open)
- Optional loop: arrow from last to first and vice versa
- Optional lazy: render panel content only after first expand
- Optional keepAlive: keep panel in DOM when closed (for animation or state preservation)

### Accessibility

- Trigger: aria-expanded, aria-controls (panel id), aria-disabled
- Panel: role="region", aria-labelledby (trigger id)
- Roving tabindex or single tab stop: only one trigger in tab order; arrows move focus
- Correct focus management when panel opens/closes

### Interaction

- Click on trigger toggles that item
- Enter/Space on trigger toggles that item
- Arrow Up/Down (or Left/Right): move focus between triggers
- Optional Home/End: first/last trigger
- Disabled trigger does not toggle

### Composition

- Accordion root
- Accordion item (wrapper for trigger + panel)
- Accordion trigger (button)
- Accordion panel (region with id)

### State exposure

- data-type (single/multiple), data-disabled on root
- data-state (open/closed), data-disabled on item and trigger
- data-slot for each part

## Suggested primitives / parts

- `AccordionRoot` (e.g. tngAccordion)
- `AccordionItem` (e.g. tngAccordionItem)
- `AccordionTrigger` (e.g. tngAccordionTrigger)
- `AccordionPanel` (e.g. tngAccordionPanel)

## Suggested APIs

### Accordion root

- `type?: 'single' | 'multiple'` (default: single)
- `value?: T | T[] | null` (open value(s) when controlled)
- `defaultValue?: T | T[] | null`
- `valueChange?: (value: T | T[] | null) => void`
- `valuesChange?: (values: readonly T[]) => void` (optional, for multiple)
- `expandedChange?: (event: { value; expanded; previousValues; values; trigger }) => void`
- `collapsible?: boolean` (in single type, allow zero open)
- `disabled?: boolean`
- `loop?: boolean` (keyboard wrap)
- `lazy?: boolean` (render panel only after first expand)
- `keepAlive?: boolean` (keep panel in DOM when closed)
- Optional: openStart, opened, closeStart, closed outputs per item

### Accordion item

- `value?: string | number` (unique id; fallback to generated)
- `disabled?: boolean`

### Accordion trigger

- Inherits state from item (aria-expanded, aria-controls, aria-disabled, tabindex from root)
- Must be button or have button semantics

### Accordion panel

- Inherits id for aria-controls; aria-labelledby to trigger
- Visibility/height controlled by root state

### Angular API contract (required)

- tngAccordion: inputs type, value, defaultValue, collapsible, disabled, loop, lazy, keepAlive; outputs valueChange, valuesChange, expandedChange, openStart, opened, closeStart, closed
- tngAccordionItem: inputs value, disabled
- tngAccordionTrigger: button semantics, receives tabindex and aria from root
- tngAccordionPanel: role="region", id, aria-labelledby

## Keyboard interaction

- Tab: focus accordion (one trigger in tab order)
- Arrow Down/Right: next trigger
- Arrow Up/Left: previous trigger
- Home/End: first/last trigger (optional)
- Enter/Space: toggle focused item
- Loop: wrap at first/last if loop=true

## Accessibility notes

- Only one trigger in tab order (roving tabindex); arrows move focus
- aria-expanded and aria-controls must stay in sync with open state
- Panel role="region" and aria-labelledby ensure association with trigger

## Open design decisions

- Whether nested accordions are fully supported (multiple roots)
- Exact event payload for expandedChange (value, expanded, previousValues, values, trigger source)
- Whether type can change at runtime

## Test checklist

### Rendering

- [x] Renders accordion root with correct data-type
- [x] Renders items with trigger and panel
- [x] Renders open/closed state per item
- [x] Renders disabled state correctly
- [x] Applies data-state, data-disabled, data-slot

### Accessibility

- [x] Trigger has aria-expanded matching open state
- [x] Trigger has aria-controls pointing to panel id
- [x] Panel has role="region" and aria-labelledby
- [x] Only one trigger in tab order; arrows move focus
- [x] Disabled trigger has aria-disabled

### Keyboard interaction

- [x] Arrow Down/Up (or Right/Left) move focus between triggers
- [x] Enter/Space toggle focused item
- [x] Does not toggle when item disabled
- [x] Loop wraps when loop=true
- [x] Home/End when implemented

### Pointer interaction

- [x] Click on trigger toggles item
- [x] Does not toggle when disabled
- [x] In single type, opening one closes others (when designed)

### Controlled behavior

- [x] Supports controlled value (single and multiple)
- [x] Emits valueChange / expandedChange
- [x] Does not change open state without controlled update

### Uncontrolled behavior

- [x] Supports defaultValue and updates on user interaction
- [x] Single type: only one open; multiple type: multiple open

### Data attributes

- [x] Applies data-type, data-state, data-disabled, data-slot on root, item, trigger, panel

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-accordion>` component created in `components`
6. [x] Test cases created for `<tng-accordion>`
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add accordion`)
14. [x] `tailng-cli` command generation added for accordion artifacts
15. [x] CLI integration tests added for `tailng add accordion`

## Links

- Playground: `/accordion`
