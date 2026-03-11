# Icon

Headless icon primitive for consistent icon display (Lucide or custom SVG).

## Overview

Icon is a headless utility that renders an icon by name (e.g. Lucide) or custom SVG source. Size and color come from CSS or props. Used in buttons, menus, status indicators, and inputs (leading/trailing). Must be accessible: decorative (aria-hidden) when next to text/label, or with aria-label when standalone (e.g. icon-only button). Composes with button, menu, input, badge.

This component should expose icon source (name or SVG), size, and accessibility semantics while leaving actual SVG asset loading and color to the consumer or icon library integration.

## Supported states

- Loaded / loading / error (when icon is async or from registry)
- Size: sm, md, lg (or custom)
- Decorative vs. meaningful (accessibility)
- Disabled (optional; when on disabled control)

## Common use cases

- Icon in button (leading/trailing)
- Icon in menu item or nav item
- Standalone icon button (with aria-label)
- Input leading/trailing icon
- Status or indicator icon
- Lucide or custom SVG; size and color from theme or props
- Decorative (aria-hidden) or with aria-label when standalone

## Headless component goals

- Provide icon container or inline SVG with consistent size/role
- Support icon by name (e.g. Lucide id) or by source (URL, SVG string)
- Support decorative vs. meaningful: aria-hidden when decorative, aria-label when standalone
- Expose data attributes for size and styling
- Optional: support for icon registry or lazy load
- No color in headless; color from CSS (currentColor or theme)

## Required headless features

### Core behavior

- Icon root (span or svg wrapper) with data-slot
- Icon content: from name (lookup in registry) or source (inline SVG or img)
- Size: via attribute (data-size) or CSS class for styling
- When decorative: aria-hidden="true"
- When meaningful: accessible name (aria-label on icon or parent)
- Optional: loading/error state when icon is async

### Accessibility

- Decorative: aria-hidden="true" (icon next to text that describes action)
- Meaningful/standalone: aria-label on icon or on parent (e.g. icon-only button has aria-label on button)
- Do not use title or alt on SVG for primary name; use aria-label for consistency
- Ensure icon has no focusable elements when decorative (focusable="false" on SVG if needed)

### Composition

- Icon component or directive (single element)
- Composes with button, link, menu item, input, badge
- May integrate with icon registry (Lucide, custom set)

### State exposure

- data-slot="icon"
- data-size (sm, md, lg or custom)
- Optional: data-name (icon name for styling)
- Optional: data-loading, data-error when async

## Suggested primitives / parts

- `IconRoot` (e.g. tngIcon component or directive)
- Optional: IconRegistry (service or token for name → SVG lookup)

## Suggested APIs

### Icon root

- `name?: string` (e.g. Lucide icon name) or `src?: string` (URL) or inline SVG
- `size?: 'sm' | 'md' | 'lg'` or number/custom
- `ariaHidden?: boolean` (default true when decorative)
- `ariaLabel?: string` (when standalone meaningful)
- Optional: lazy load, registry token
- Renders: inline SVG from registry or img/svg from src; or projected SVG

### Angular API contract (required)

- tng-icon component or directive: inputs name (or src), size, ariaHidden, ariaLabel
- When used inside button/link, typically ariaHidden=true (button has label)
- When icon-only button, aria-label on button, icon aria-hidden
- Size and color via CSS (e.g. width/height, color: currentColor)
- Integration with Lucide or app icon set (registry) for name → SVG

## Keyboard interaction

- Icon itself is not focusable; parent (button, link) is focusable
- No direct keyboard behavior on icon

## Accessibility notes

- Default to decorative (aria-hidden) when icon is alongside text
- Use aria-label on parent (e.g. "Close" on button) for icon-only buttons; keep icon aria-hidden
- If icon is the only content of a link/button, provide aria-label on the link/button
- SVG: focusable="false" to avoid extra tab stop when inside button

## Open design decisions

- Icon registry: app-level vs. per-component; Lucide as default set
- Size: prop vs. CSS only (e.g. --tng-icon-size)
- Whether to support img + src for external icons (alt required when meaningful)

## Test checklist

### Rendering

- [ ] Renders icon from name (registry) or src
- [ ] Renders with correct size (data-size or class)
- [ ] Renders inline SVG or img as designed
- [ ] Applies data-slot, data-size
- [ ] Optional: loading/error state when async

### Accessibility

- [ ] Decorative icon has aria-hidden="true"
- [ ] Meaningful/standalone has aria-label (on icon or parent)
- [ ] SVG has focusable="false" when inside focusable parent
- [ ] No duplicate accessible name (icon + button both with label)

### Data attributes

- [ ] Applies data-slot="icon", data-size
- [ ] Optional data-name

## Implementation Steps

1. [ ] Headless component created in `primitives` (or icon is component-only)
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [ ] Minimum style `<tng-icon>` component created in `components`
6. [ ] Test cases created for `<tng-icon>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add icon`)
14. [ ] `tailng-cli` command generation added for icon artifacts
15. [ ] CLI integration tests added for `tailng add icon`

## Links

- Playground: `/icons`
