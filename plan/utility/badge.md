# Badge

Headless badge primitive for notification indicator (dot or count) on a host element.

## Overview

Badge is a headless utility that displays a small overlay on an element (e.g. icon, avatar, nav item) to indicate notifications or status. It can show a dot (no number) or a count; optional max count (e.g. "99+"). Positioned relative to the host (corner or edge). Must have an accessible label for screen readers when it conveys meaning. Composes with avatar, icon button, or nav item.

This component should expose count/dot, position, size, visibility (hidden), and accessibility while leaving visual style (variant, tone) to the consumer.

## Supported states

- Visible / hidden (e.g. when count is 0 or hidden=true)
- Count (number) or dot (no number)
- Position: top-end, top-start, bottom-end, bottom-start (or similar)
- Size: sm, md, lg (or custom)
- Disabled (optional; e.g. dimmed or not shown)
- Variant/tone: component or styling (e.g. danger, success, neutral)

## Common use cases

- Notification count on icon or avatar
- Status dot (online, busy) on avatar
- Optional max count (99+)
- Positioned at corner or edge of host
- Accessible label for screen readers
- Composes with avatar, icon button, or nav item

## Headless component goals

- Provide badge overlay relative to host element (position, offset)
- Support count (number) or dot (boolean)
- Support hidden state (count 0 or explicit hidden)
- Support max count (e.g. 99 → "99+")
- Expose position, size, variant/tone for styling (data-position, data-size, data-tone, data-variant)
- Accessible: aria-label or live region for count/status when meaningful
- Optional: disabled state (visual or hide)

## Required headless features

### Core behavior

- Badge host (element that carries the badge directive; e.g. button, avatar)
- Badge content: count (number) or dot (boolean)
- When count > 0 or dot=true and not hidden: show badge
- When count=0 and not dot: optionally hide or show "0" per design
- Max count: cap display (e.g. 99+)
- Position: placement relative to host (top-end, top-start, bottom-end, bottom-start)
- Offset: optional x/y offset for fine-tuning
- Hidden: force hide badge (e.g. when user dismisses notifications)

### Accessibility

- Badge that conveys information (e.g. "3 notifications") must have accessible text: aria-label on badge element or host, or live region
- Decorative badge (e.g. status dot with no semantic meaning): aria-hidden="true"
- When badge is count, ensure screen reader can hear count or "X notifications" as appropriate
- Optional: announce count change (live region) when count updates

### Composition

- Badge directive on host (button, span, avatar, etc.)
- Badge is typically a separate element (e.g. span) rendered or projected relative to host; position/offset from directive
- Composes with avatar, icon button, nav item

### State exposure

- data-placement / data-position (top-end, etc.)
- data-size (sm, md, lg)
- data-variant, data-tone (when in scope)
- data-dot when dot mode
- data-disabled, data-hidden when applicable
- Optional: data-count for styling (e.g. single digit vs. double)

## Suggested primitives / parts

- `Badge` (directive on host; renders or coordinates badge element with position/size/content)
- Optional: BadgeContent (the actual badge element with count or dot)

## Suggested APIs

### Badge (directive)

- `tngBadge?: number | string | null` (count; null/0 and dot=false may hide)
- `tngBadgeDot?: boolean` (dot only, no number)
- `tngBadgeMax?: number` (e.g. 99 for "99+")
- `tngBadgeHidden?: boolean` (force hide)
- `tngBadgePosition?: 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start'` (or similar)
- `tngBadgeSize?: 'sm' | 'md' | 'lg'`
- `tngBadgeOffsetX?`, `tngBadgeOffsetY?` (optional)
- `tngBadgeVariant?`, `tngBadgeTone?` (styling)
- `tngBadgeDisabled?: boolean`
- `tngBadgeClass?`, `tngBadgeStyle?` (optional)
- Accessible label: from host aria-label or dedicated badge aria-label (e.g. "3 notifications")
- Badge element: may be created by directive (e.g. in overlay or after host) or projected; content = count or empty (dot)

### Angular API contract (required)

- tngBadge directive: inputs as above; badge element with correct position, size, and content (count or dot)
- When badge conveys info, ensure aria-label or equivalent for screen readers
- Dot mode: no text content; circle indicator only
- Max: when count > max, display "max+" or "99+" per design

## Keyboard interaction

- Badge itself is not focusable; host (button, link) is focusable
- No direct keyboard behavior on badge

## Accessibility notes

- Notification/count badge: provide accessible name (e.g. "3 unread" on host or badge)
- Decorative status dot: aria-hidden on badge
- Position is visual only; order in DOM should not affect screen reader flow (badge after host or inside host)

## Open design decisions

- Badge element: created by directive (programmatic) vs. projected (consumer provides element)
- Whether 0 count shows "0" or hides badge
- Tone/variant in headless vs. component only

## Test checklist

### Rendering

- [x] Renders badge when count > 0 or dot=true and not hidden
- [x] Hides or shows "0" when count=0 per design
- [x] Applies max (e.g. 99+) when count > max
- [x] Renders dot (no number) when dot=true
- [x] Positions correctly (top-end, etc.) with optional offset
- [ ] Applies data-position, data-size, data-dot, data-disabled, data-hidden
- [x] Respects tngBadgeHidden

### Accessibility

- [ ] Badge or host has accessible label when badge conveys info
- [x] Decorative badge has aria-hidden
- [ ] Count announced or readable by AT when meaningful

### Data attributes

- [ ] Applies data-placement/data-position, data-size, data-variant, data-tone, data-dot, data-disabled, data-hidden

### J) Positioning runtime behavior (optional)

- [x] Repositions badge when the anchor host resizes (ResizeObserver path, if supported)
- [x] Repositions badge when the badge element itself resizes (if supported)
- [x] Repositions badge on window resize (fallback path when ResizeObserver is unavailable)
- [x] Disconnects runtime observers/listeners and stops repositioning after destroy

## Implementation Steps

1. [x] Headless component created in `primitives`
2. [x] Test cases created for headless (behavior spec)
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style badge component/directive in `components`
6. [x] Test cases created for badge component
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add badge`)
14. [ ] `tailng-cli` command generation added for badge artifacts
15. [ ] CLI integration tests added for `tailng add badge`

## Links

- Playground: `/badge`
