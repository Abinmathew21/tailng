# Breadcrumb

Headless breadcrumb primitive for hierarchical navigation paths.

## Overview

Breadcrumb is a headless navigation pattern used to show the user's current location within a hierarchy.
It typically presents a sequence such as `Home > Section > Page`, where earlier segments are links and the last segment represents the current page.

This component should provide accessibility, semantic navigation structure, optional separators, responsive overflow/collapse behavior where designed, and signal-first Angular 21+ compatible APIs, while leaving rendering and styling to the consumer or to a higher-level styled component.

## Supported states

- `idle`
- `current`
- `collapsed`
- `disabled`
- `focused`
- `focus-visible`

## Common use cases

- Site navigation trails
- Docs and knowledge-base page paths
- Dashboard section hierarchies
- File or folder path navigation
- Nested admin pages
- Mobile breadcrumb collapse patterns

## Headless component goals

- Provide accessible breadcrumb semantics
- Support hierarchical navigation display
- Support current-page indication
- Support signal-first Angular 21+ component APIs
- Support optional separators
- Support optional collapsed / overflow presentation
- Expose state for custom rendering and styling
- Preserve native link semantics where links are used

## Required headless features

### Core behavior

- Ordered breadcrumb item rendering
- Support current item as non-link or current-link pattern
- Support link items for ancestor segments
- Optional custom separator rendering
- Optional collapsed breadcrumb behavior for long paths
- Optional overflow menu integration where desired
- Support disabled breadcrumb items where applicable
- Stable item ordering from root to current location

### Accessibility

- `nav` landmark support for breadcrumb region
- Accessible label through `aria-label` or `aria-labelledby`
- Ordered list or list semantics for breadcrumb items
- `aria-current="page"` support for current item
- Preserve native anchor semantics for linked items
- Correct separator treatment so separators are not redundantly announced
- Correct screen reader announcement of current page item

### Interaction

- Tab navigation through linked breadcrumb items
- Enter activates focused link item
- Pointer click activates link item
- Prevent interaction when item is disabled
- Focus management support
- Focus-visible state exposure

### Responsive and overflow behavior

- Optional collapse of middle items
- Optional ellipsis trigger for hidden segments
- Optional menu or popup expansion for hidden segments
- Preserve current item visibility when collapsing
- Preserve root visibility where possible when collapsing

### Composition

- Breadcrumb root primitive
- Breadcrumb list primitive
- Breadcrumb item primitive
- Breadcrumb link primitive
- Breadcrumb current page primitive
- Breadcrumb separator primitive
- Optional breadcrumb ellipsis / overflow trigger primitive

### State exposure

- `data-current`
- `data-disabled`
- `data-collapsed`
- `data-focused`
- `data-focus-visible`

## Suggested primitives / parts

- `BreadcrumbRoot`
- `BreadcrumbList`
- `BreadcrumbItem`
- `BreadcrumbLink`
- `BreadcrumbCurrent`
- `BreadcrumbSeparator`
- `BreadcrumbEllipsis`

## Suggested APIs

### Breadcrumb root

Framework-neutral headless contract:

- `aria-label?: string`
- `aria-labelledby?: string`
- `collapse?: boolean`
- `maxItems?: number`
- `itemsBeforeCollapse?: number`
- `itemsAfterCollapse?: number`

### Breadcrumb item

- `current?: boolean`
- `disabled?: boolean`
- `id?: string`

### Breadcrumb link

- `href?: string`
- `target?: string`
- `rel?: string`
- `disabled?: boolean`
- `id?: string`

### Breadcrumb separator

- `decorative?: boolean`
- `id?: string`

### Breadcrumb ellipsis

- `aria-label?: string`
- `id?: string`

## Angular API contract (required)

For TailNG signal-first Angular 21+ components, the Angular-facing primitive/component contract should align with signal APIs and modern Angular composition patterns.

### Signal-first Angular API expectations

- Use signal-based inputs for component configuration
- Use Angular-style outputs for change events where stateful outputs are needed
- Keep APIs compatible with two-way binding patterns where appropriate
- Avoid decorator-first legacy patterns in new component design unless needed for compatibility
- Prefer composition-friendly APIs over rigid inheritance-style APIs

### Angular integration requirements

- Support signal-based item composition where needed
- Preserve projected content behavior for Angular templates
- Expose current and disabled states consistently to Angular templates
- Support router-link based breadcrumb links without breaking semantics
- Keep behavior compatible with SSR-safe Angular rendering strategies where relevant

## State model

### Root state

- standard breadcrumb
- collapsed breadcrumb
- labelled breadcrumb navigation region

### Item state

- linked ancestor item
- current item
- disabled item
- collapsed / hidden item represented by ellipsis

## Keyboard interaction

- `Tab`: Moves focus through interactive breadcrumb links
- `Shift + Tab`: Moves focus away in reverse order
- `Enter`: Activates focused breadcrumb link
- `Space`: Optional activation only if rendered as a non-anchor interactive element
- Ellipsis trigger, if interactive, should follow its own menu or popup keyboard model

## Behavior recommendations

- The last breadcrumb item should usually represent the current page
- The current page item should usually not be a link unless the product has a clear reason
- Separators should be decorative and should not receive focus
- If collapsing is enabled, preserve the first item and current item where possible
- If an ellipsis trigger is used, hidden segments should remain accessible through it
- Breadcrumb should reflect actual navigation hierarchy, not unrelated history state

## Readonly / disabled behavior decision

Recommended behavior:

- Breadcrumb itself does not need a readonly state
- Disabled breadcrumb items may be rendered when a segment is presentational but not actionable
- Disabled items should not activate and should not misrepresent navigability
- Non-link current item should remain perceivable but not interactive

## Accessibility notes

- Wrap breadcrumb in a labelled navigation landmark
- Prefer list semantics inside the breadcrumb
- Mark the current page item with `aria-current="page"`
- Do not let decorative separators create noisy screen reader output
- Preserve real link semantics for navigable segments
- Breadcrumb is a navigation aid, not a history trail

## Form-adjacent behavior

- Breadcrumb is not a form control
- Breadcrumb interaction should not interfere with surrounding forms or controls
- If breadcrumb links are composed inside forms, they should still behave as standard navigation links

## Open design decisions

- Whether collapsed breadcrumb behavior belongs in the first primitive version
- Whether ellipsis should open a menu, popover, or inline expansion
- Whether current item may optionally remain a link in some design-system variants
- Whether router-specific helpers should be part of the primitive or a wrapper utility
- Whether disabled breadcrumb items should remain focusable in any advanced scenario

## Test checklist

### Rendering

- [x] Renders breadcrumb root correctly
- [x] Renders breadcrumb list correctly
- [x] Renders breadcrumb items in correct order
- [x] Renders link items correctly
- [x] Renders current item correctly
- [x] Renders separators correctly
- [x] Renders disabled state correctly when used
- [x] Renders ellipsis trigger correctly when collapse is enabled

### Accessibility

- [x] Exposes breadcrumb inside a labelled navigation region
- [x] Preserves list semantics correctly
- [x] Exposes `aria-current='page'` on current item
- [x] Preserves native link semantics for linked items
- [x] Prevents decorative separators from being announced unnecessarily
- [x] Computes accessible label correctly
- [x] Preserves correct current-item semantics for assistive technology

### Keyboard interaction

- [x] Focuses linked items with Tab
- [x] Activates focused link with Enter
- [x] Skips non-interactive current item in tab order
- [x] Skips decorative separators in tab order
- [x] Does not activate disabled items
- [x] Applies focus-visible state after keyboard focus

### Pointer interaction

- [x] Activates linked breadcrumb item on click
- [x] Does not activate disabled breadcrumb item on click
- [ ] Opens ellipsis expansion on click when supported

### Collapse and overflow behavior

- [x] Collapses middle items when configured
- [x] Preserves first item visibility when collapsed
- [x] Preserves current item visibility when collapsed
- [x] Renders ellipsis when hidden segments exist
- [ ] Reveals hidden segments correctly through ellipsis interaction when supported

### Angular integration

- [x] Works with signal-based Angular composition
- [x] Preserves projected content behavior correctly
- [x] Works with Angular router link composition where supported
- [x] Exposes current and disabled state consistently to Angular templates
- [ ] Works in SSR-safe rendering scenarios where supported

### Data attributes

- [x] Applies `data-current` on current item
- [x] Applies `data-disabled` on disabled item
- [x] Applies `data-collapsed` when collapse mode is active
- [x] Applies `data-focused` on focus
- [x] Applies `data-focus-visible` on keyboard focus

## Implementation Steps

- [x] Headless component created in `primitives`
- [x] Test cases created for headless
- [x] Headless example page added/updated in playground - plain CSS app
- [x] Headless example page added/updated in playground - Tailwind app
- [x] Minimum style `<tng-breadcrumb>` component created in `components`
- [x] Test cases created for `<tng-breadcrumb>`
- [x] Component example page added/updated in playground - plain CSS app
- [x] Component example page added/updated in playground - Tailwind app
- [x] Docs added/updated in docs project - Overview section
- [x] Docs added/updated in docs project - API section
- [x] Docs added/updated in docs project - Styling section
- [x] Docs added/updated in docs project - Example section
- [x] Registry templates added in registry
- [x] `tailng add breadcrumb` command generation added
- [x] CLI integration tests added for `tailng add breadcrumb`

## Links

- Playground: `/breadcrumb`
