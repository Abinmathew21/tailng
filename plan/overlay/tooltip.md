# Tooltip

Headless tooltip primitive for short helper text on hover or focus.

## Overview

Tooltip is a headless overlay that shows a short text (or template) when the user hovers or focuses a trigger element. It dismisses when the pointer leaves or focus moves. It is used to describe icons, controls, or truncated text. Delay and placement (top, bottom, left, right) are configurable. Content should stay small; for richer content use popover instead.

This component should expose open state, trigger/content association, accessibility (role="tooltip", aria-describedby), and positioning hints while leaving animation and styling to the consumer.

## Supported states

- `open` / closed (visible / hidden)
- `disabled` (tooltip does not show)
- Placement: top | bottom | left | right
- Trigger: hover, focus, or both; optional delay open/close

## Common use cases

- Describing an icon-only button
- Explaining a control or truncated label
- Short hints on form fields
- Keyboard focus reveals tooltip for accessibility
- Avoid large content; use popover for forms or lists

## Headless component goals

- Provide accessible tooltip semantics (role="tooltip", aria-describedby on trigger)
- Support hover and/or focus trigger; configurable delay
- Support controlled and uncontrolled open state
- Support placement (side) for positioning
- Dismiss on pointer leave and focus leave
- Expose state for custom rendering and positioning
- Optional: avoid showing on touch devices or make delay longer

## Required headless features

### Core behavior

- Tooltip trigger (element that receives hover/focus)
- Tooltip content (panel with id for aria-describedby)
- Open/close on hover enter/leave and/or focus enter/leave
- Optional open delay and close delay
- Controlled: `open` + `openChange`; uncontrolled: internal state from hover/focus
- `disabled`: tooltip never shows

### Accessibility

- Content: role="tooltip", stable id for trigger’s aria-describedby
- Trigger: aria-describedby set when tooltip is open (pointing to content id)
- Do not use aria-describedby when closed (so AT doesn’t announce stale content)
- Focus on trigger shows tooltip so keyboard users get the same information
- Optional: ensure tooltip content is not focusable (tooltip is not interactive)

### Interaction

- Hover enter (and optional delay): open
- Hover leave (and optional delay): close
- Focus trigger: open
- Focus leave (blur from trigger): close (with optional delay to allow moving focus into tooltip if needed)
- Disabled: no show
- Optional: pointer down on trigger does not close (allow click then hover leave to close)

### Composition

- Tooltip trigger (directive on element)
- Tooltip content (panel with id, role="tooltip")
- Optional: provider or context that holds open state and content id for positioning service

### State exposure

- `data-state="open" | "closed"` on trigger and content
- `data-disabled` on trigger when disabled
- `data-side` on content for placement (top | bottom | left | right)
- `data-slot` for trigger and content

## Suggested primitives / parts

- `TooltipTrigger` (e.g. tngTooltipTrigger)
- `TooltipContent` (e.g. tngTooltipContent)

## Suggested APIs

### Tooltip trigger

- `open?: boolean` (controlled)
- `openChange?: (open: boolean) => void`
- `disabled?: boolean`
- `describedBy?: string | null` (content id when open; may be set by content or provider)
- Receives or provides content id for aria-describedby

### Tooltip content

- `id: string` (required; for aria-describedby)
- `open?: boolean` (visibility)
- `side?: 'top' | 'bottom' | 'left' | 'right'` (default: 'top')
- `role="tooltip"`, hidden when closed
- Optional: collision detection, offset, delay props (if in headless) or left to positioning layer

### Angular API contract (required)

- tngTooltipTrigger: inputs open, disabled; output openChange; sets aria-describedby when open
- tngTooltipContent: inputs id (required), open, side; role="tooltip"; hidden when closed
- Trigger and content must share open state (provider or parent component)
- Optional: delay open/close as inputs or via config

## Keyboard interaction

- Tooltip is not focusable. Trigger is focusable.
- Tab to trigger: focus moves to trigger; tooltip opens (if focus trigger enabled).
- Tab away: focus leaves trigger; tooltip closes.
- No keys inside tooltip (tooltip content typically not in tab order).

## Accessibility notes

- role="tooltip" on content and aria-describedby on trigger when open ensure AT announces tooltip when focus is on trigger.
- Keep tooltip content short; long content should use popover or another pattern.
- Do not put interactive content in tooltip (focus trap and keyboard semantics get complex).

## Open design decisions

- Whether tooltip can stay open when focus moves into content (e.g. for a link in tooltip); usually no.
- Delay open/close values: headless vs. positioning layer responsibility.
- Whether placement/collision is in primitive or delegated to overlay/positioning service.

## Test checklist

### Rendering

- [x] Renders trigger and content
- [x] Content has role="tooltip" and id
- [x] Content is hidden when closed (hidden attribute or visibility)
- [x] Content shows when open
- [x] Applies data-state, data-side, data-disabled, data-slot

### Accessibility

- [x] When open, trigger has aria-describedby pointing to content id
- [x] When closed, trigger has no aria-describedby (or null)
- [x] Content has role="tooltip"
- [x] Focus on trigger opens tooltip when not disabled
- [x] Blur from trigger closes tooltip

### Hover and focus

- [x] Hover enter opens tooltip (with delay if configured)
- [x] Hover leave closes tooltip (with delay if configured)
- [x] Focus trigger opens tooltip
- [x] Blur trigger closes tooltip
- [x] Disabled prevents tooltip from showing

### Controlled behavior

- [ ] Supports controlled open state
- [x] Emits openChange when opening/closing
- [ ] Does not change visibility without controlled update when controlled

### Uncontrolled behavior

- [x] Opens/closes from hover and focus when uncontrolled

### Data attributes

- [x] Applies data-state="open" | "closed" on trigger and content
- [x] Applies data-disabled on trigger
- [x] Applies data-side on content

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless
3. [x] Headless example page added/updated in playground - plain CSS app
4. [x] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-tooltip>` component created in `components`
6. [x] Test cases created for `<tng-tooltip>`
7. [x] Component example page added/updated in playground - plain CSS app
8. [x] Component example page added/updated in playground - Tailwind app
9. [x] Docs added/updated in docs project - Overview section
10. [x] Docs added/updated in docs project - API section
11. [x] Docs added/updated in docs project - Styling section
12. [x] Docs added/updated in docs project - Example section
13. [x] Registry templates added in `registry` for copy-paste mode (`tailng add tooltip`)
14. [x] `tailng-cli` command generation added for tooltip artifacts
15. [x] CLI integration tests added for `tailng add tooltip`

## Links

- Playground: `/tooltip`
