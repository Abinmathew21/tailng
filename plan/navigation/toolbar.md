# Toolbar

Action controls grouping.

## Overview

Container that groups action buttons, toggles, or other controls (e.g. editor toolbar, table actions). Handles focus and layout.

## Key points

- Groups controls in a single focus region; arrow-key navigation between items.
- Optional separators or visual groups.
- Composes with button, toggle, dropdown menu.

## Links

- Playground: `/toolbar`

# Toolbar

Headless toolbar primitive for grouping related action controls into a single navigable command region.

## Overview

Toolbar is a headless composite container used to group related controls such as buttons, toggle buttons, dropdown triggers, separators, radio groups, and other compact action elements.
It is commonly used in editors, tables, data views, media controls, formatting surfaces, and application command bars where related actions should be organized into one logical interaction region.

This component should provide accessibility, roving focus management, keyboard interaction, Angular composition compatibility, and signal-first Angular 21+ compatible APIs, while leaving rendering and styling to the consumer or to a higher-level styled component.

## Supported states

- `idle`
- `focused`
- `focus-visible`
- `disabled`
- `horizontal`
- `vertical`

## Common use cases

- Rich text editor command bars
- Table or grid action toolbars
- Media player controls
- Filter and bulk action bars
- Drawing or design tool palettes
- Compact action groups in app headers

## Headless component goals

- Provide accessible toolbar semantics
- Support grouped command navigation with roving focus
- Support horizontal and vertical orientation
- Support controlled and uncontrolled active-focus behavior where needed
- Support signal-first Angular 21+ component APIs
- Support nested interactive items composed from other primitives
- Expose state for custom rendering and styling
- Keep toolbar semantics separate from the behavior of inner controls

## Required headless features

### Core behavior

- Toolbar container semantics
- Roving tabindex or equivalent composite focus strategy
- Support horizontal orientation
- Support vertical orientation
- Optional wrapping behavior rules where desired
- Support disabled toolbar state
- Support disabled items within toolbar
- Preserve focus movement across mixed control types
- Maintain stable item order during keyboard navigation

### Accessibility

- `role="toolbar"` support for toolbar root
- `aria-orientation`
- Label association through `aria-label` or `aria-labelledby`
- Support correct composite focus semantics
- Preserve inner control semantics for buttons, toggles, menus, and other composed items
- Correct screen reader announcement of toolbar label and orientation where applicable

### Interaction

- Arrow key navigation between enabled toolbar items
- Home moves to first enabled item
- End moves to last enabled item
- Tab enters or exits the toolbar according to normal page navigation
- Optional loop behavior for arrow navigation
- Prevent focus movement when toolbar is disabled
- Focus management support
- Focus-visible state exposure

### Composition

- Toolbar root primitive
- Toolbar item integration support
- Separator primitive
- Grouping / segment primitive where needed
- Support buttons, toggle buttons, menu triggers, radio groups, and custom action elements inside the toolbar
- Support projected content and Angular template composition

### State exposure

- `data-disabled`
- `data-focused`
- `data-focus-visible`
- `data-orientation`

## Suggested primitives / parts

- `ToolbarRoot`
- `ToolbarItem`
- `ToolbarSeparator`
- `ToolbarGroup`

## Suggested APIs

### Toolbar root

Framework-neutral headless contract:

- `orientation?: 'horizontal' | 'vertical'`
- `loop?: boolean`
- `disabled?: boolean`
- `dir?: 'ltr' | 'rtl'`
- `aria-label?: string`
- `aria-labelledby?: string`
- `rovingFocus?: boolean`

### Toolbar item

- `disabled?: boolean`
- `focusable?: boolean`
- `id?: string`

### Toolbar group

- `disabled?: boolean`
- `id?: string`
- `label?: string`

## Angular API contract (required)

For TailNG signal-first Angular 21+ components, the Angular-facing primitive/component contract should align with signal APIs and modern Angular composition patterns.

### Signal-first Angular API expectations

- Use signal-based inputs for component configuration
- Use Angular-style outputs for change events where stateful outputs are needed
- Keep APIs compatible with two-way binding patterns where appropriate
- Avoid decorator-first legacy patterns in new component design unless needed for compatibility
- Prefer composition-friendly APIs over rigid inheritance-style APIs

### Angular integration requirements

- Support signal-based item registration where needed
- Preserve stable projected content behavior for Angular templates
- Expose disabled state consistently to Angular templates
- Support nested TailNG primitives inside the toolbar without breaking focus order
- Keep behavior compatible with SSR-safe Angular rendering strategies where relevant

## State model

### Root state

- enabled toolbar
- disabled toolbar
- horizontal toolbar
- vertical toolbar

### Item state

- focusable item
- disabled item
- currently tabbable item in roving focus model

## Keyboard interaction

### Horizontal toolbar

- `ArrowRight`: Moves focus to next enabled item
- `ArrowLeft`: Moves focus to previous enabled item
- `Home`: Moves focus to first enabled item
- `End`: Moves focus to last enabled item

### Vertical toolbar

- `ArrowDown`: Moves focus to next enabled item
- `ArrowUp`: Moves focus to previous enabled item
- `Home`: Moves focus to first enabled item
- `End`: Moves focus to last enabled item

### General notes

- `Tab` should move into or out of the toolbar using standard page navigation
- Disabled items should be skipped during roving focus navigation
- Toolbar navigation must not override the native semantics of the focused inner control beyond composite focus movement
- Text direction should be respected for horizontal navigation where applicable

## Behavior recommendations

- The toolbar should manage which item is tabbable, but inner controls should retain their own activation semantics
- Focus should enter the last focused item when reasonable, otherwise the first enabled item
- Mixed control types should remain navigable without special-casing consumers
- Separators should not be focusable
- Toolbar groups should support logical segmentation without creating separate tab stops unless explicitly designed

## Readonly / disabled behavior decision

Recommended behavior:

- Disabled toolbar should prevent item focus movement managed by the toolbar
- Disabled items inside an enabled toolbar should be skipped in navigation and must not activate
- Toolbar itself usually does not need a readonly state, because readonly behavior belongs to the inner controls rather than the grouping container

## Accessibility notes

- Use `role='toolbar'` only when the grouped controls act as a meaningful command region
- Toolbar must have an accessible label when the purpose is not already obvious from surrounding context
- Inner controls must preserve their own semantics such as button, toggle button, or menu trigger
- Keyboard users must be able to enter, navigate, and exit the toolbar predictably

## Form-adjacent behavior

- Toolbar is not itself a form control
- Controls inside a toolbar may participate in forms or application state independently
- Toolbar focus management must not interfere with Angular forms behavior of nested controls

## Open design decisions

- Whether loop navigation should be enabled by default
- Whether the toolbar should remember last focused item across blur/re-entry
- Whether disabled-but-focusable items are ever needed for advanced accessibility scenarios
- Whether wrapping navigation is desirable when the toolbar visually wraps across lines
- Whether toolbar groups should expose additional labelling primitives in the first version

## Test checklist

### Rendering

- [ ] Renders toolbar root correctly
- [ ] Renders projected toolbar items correctly
- [ ] Renders separators correctly
- [ ] Renders groups correctly
- [ ] Renders disabled state correctly
- [ ] Renders horizontal orientation correctly
- [ ] Renders vertical orientation correctly

### Accessibility

- [ ] Exposes correct `role='toolbar'` on root
- [ ] Exposes `aria-orientation` correctly
- [ ] Computes accessible label correctly
- [ ] Preserves inner control semantics correctly
- [ ] Announces toolbar region correctly to assistive technology where applicable

### Keyboard interaction

- [ ] Moves to next enabled item with ArrowRight in horizontal mode
- [ ] Moves to previous enabled item with ArrowLeft in horizontal mode
- [ ] Moves to next enabled item with ArrowDown in vertical mode
- [ ] Moves to previous enabled item with ArrowUp in vertical mode
- [ ] Moves to first enabled item with Home
- [ ] Moves to last enabled item with End
- [ ] Skips disabled items during navigation
- [ ] Does not trap Tab inside the toolbar
- [ ] Respects loop navigation when `loop=true`
- [ ] Does not loop navigation when `loop=false`

### Focus management

- [ ] Sets only one item as tabbable in roving focus mode
- [ ] Moves tabbable state as focus changes
- [ ] Enters first enabled or last focused item on Tab depending on design
- [ ] Preserves stable focus order across mixed item types
- [ ] Does not focus separators
- [ ] Does not move focus when toolbar is disabled
- [ ] Applies focus-visible state after keyboard focus

### Composition behavior

- [ ] Works with button primitives inside toolbar
- [ ] Works with toggle button primitives inside toolbar
- [ ] Works with menu trigger primitives inside toolbar
- [ ] Works with radio group primitives inside toolbar where allowed
- [ ] Works with projected custom actions inside toolbar

### Angular integration

- [ ] Works with signal-based Angular composition
- [ ] Preserves projected content behavior correctly
- [ ] Exposes disabled state consistently to Angular templates
- [ ] Supports nested TailNG primitives without breaking focus order
- [ ] Works in SSR-safe rendering scenarios where supported

### Data attributes

- [ ] Applies `data-disabled` in disabled state
- [ ] Applies `data-focused` on focus
- [ ] Applies `data-focus-visible` on keyboard focus
- [ ] Applies `data-orientation` correctly

## Implementation Steps

- [ ] Headless component created in `primitives`
- [ ] Test cases created for headless
- [ ] Headless example page added/updated in playground - plain CSS app
- [ ] Headless example page added/updated in playground - Tailwind app
- [ ] Minimum style `<tng-toolbar>` component created in `components`
- [ ] Test cases created for `<tng-toolbar>`
- [ ] Component example page added/updated in playground - plain CSS app
- [ ] Component example page added/updated in playground - Tailwind app
- [ ] Docs added/updated in docs project - Overview section
- [ ] Docs added/updated in docs project - API section
- [ ] Docs added/updated in docs project - Styling section
- [ ] Docs added/updated in docs project - Example section
- [ ] Registry templates added in registry
- [ ] `tailng add toolbar` command generation added
- [ ] CLI integration tests added for `tailng add toolbar`

## Links

- Playground: `/toolbar`