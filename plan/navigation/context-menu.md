# Context Menu

Headless context menu primitive for context-triggered actions anchored to pointer position, trigger element, or virtual target.

## Overview

Context Menu is a headless menu surface used to expose contextual actions for a target element, region, row, cell, file, canvas object, or custom interaction surface.
It is typically opened by right-click, context-menu key, long press, or other platform-specific context affordances, and should position itself relative to the pointer location or logical target.

This component should provide accessibility, pointer and keyboard interaction, layered positioning, dismissal behavior, Angular forms-adjacent interaction compatibility where relevant, and signal-first Angular 21+ compatible APIs, while leaving rendering and styling to the consumer or to a higher-level styled component.

## Supported states

- `closed`
- `open`
- `opening`
- `closing`
- `disabled`
- `focused`
- `focus-visible`
- `submenu-open`

## Common use cases

- File or folder action menus
- Table row or cell actions
- Canvas or design-surface actions
- Message or comment item actions
- Editor selection actions
- Tree, list, and explorer item actions

## Headless component goals

- Provide accessible context menu semantics
- Support pointer-triggered contextual opening
- Support keyboard-triggered opening from focused target
- Support nested submenu composition
- Support controlled and uncontrolled open state APIs
- Support signal-first Angular 21+ component APIs
- Support layered positioning and collision handling
- Support dismiss behavior for escape, outside click, blur, and submenu transitions
- Expose state for custom rendering and styling

## Required headless features

### Core behavior

- Open on `contextmenu` event
- Optional open on keyboard context-menu key or `Shift+F10`
- Optional long-press support for touch environments where desired
- Support controlled open state
- Support uncontrolled open state
- Support contextual positioning from pointer coordinates
- Support positioning from virtual anchor / target rect
- Support nested submenus
- Support disabled items
- Support item groups, labels, and separators
- Preserve open state rules during submenu traversal

### Accessibility

- `role="menu"` support for menu surface
- `role="menuitem"` support for standard items
- `role="menuitemcheckbox"` support where applicable
- `role="menuitemradio"` support where applicable
- `aria-haspopup` for submenu triggers
- `aria-expanded` for submenu triggers when open
- `aria-disabled`
- Label association through `aria-label` or `aria-labelledby`
- Support correct menu and menuitem focus semantics
- Correct screen reader announcement for submenu state and disabled items

### Interaction

- Right-click or equivalent opens menu
- Context-menu key opens menu for focused target
- Arrow key navigation between items
- Enter or Space activates focused item where appropriate
- ArrowRight opens submenu in applicable orientation
- ArrowLeft closes submenu and returns focus to parent item
- Escape closes current menu layer
- Outside click or pointer down dismisses menu
- Focus management support
- Focus-visible state exposure
- Typeahead support where desired

### Positioning and layering

- Position menu at pointer coordinates
- Collision detection against viewport edges
- Flip or shift when insufficient space is available
- Support portal / overlay rendering
- Support nested submenu alignment
- Maintain stable positioning during scroll where strategy requires it

### Composition

- Context menu root primitive
- Trigger target integration support
- Menu content primitive
- Menu item primitive
- Checkbox item primitive
- Radio group and radio item primitives
- Label primitive
- Separator primitive
- Submenu trigger primitive
- Submenu content primitive
- Portal / overlay primitive where needed

### State exposure

- `data-open`
- `data-closed`
- `data-disabled`
- `data-focused`
- `data-focus-visible`
- `data-highlighted`
- `data-submenu-open`
- `data-side`
- `data-align`

## Suggested primitives / parts

- `ContextMenuRoot`
- `ContextMenuTarget`
- `ContextMenuPortal`
- `ContextMenuPositioner`
- `ContextMenuContent`
- `ContextMenuItem`
- `ContextMenuCheckboxItem`
- `ContextMenuRadioGroup`
- `ContextMenuRadioItem`
- `ContextMenuLabel`
- `ContextMenuSeparator`
- `ContextMenuSubTrigger`
- `ContextMenuSubContent`

## Suggested APIs

### Context menu root

Framework-neutral headless contract:

- `open?: boolean`
- `defaultOpen?: boolean`
- `openChange?: (open: boolean) => void`
- `modal?: boolean`
- `disabled?: boolean`
- `closeOnSelect?: boolean`
- `loop?: boolean`
- `dir?: 'ltr' | 'rtl'`
- `typeahead?: boolean`

### Context menu target

- `disabled?: boolean`
- `contextMenuTriggerMode?: 'native' | 'custom' | 'both'`
- `longPress?: boolean`
- `longPressDelay?: number`
- `id?: string`

### Context menu content

- `side?: 'top' | 'right' | 'bottom' | 'left'`
- `align?: 'start' | 'center' | 'end'`
- `sideOffset?: number`
- `alignOffset?: number`
- `avoidCollisions?: boolean`
- `collisionPadding?: number`
- `trapFocus?: boolean`
- `restoreFocus?: boolean`
- `aria-label?: string`
- `aria-labelledby?: string`
- `positionStrategy?: 'pointer' | 'anchor' | 'virtual'`

### Context menu item

- `disabled?: boolean`
- `inset?: boolean`
- `id?: string`
- `select?: () => void`

### Context menu checkbox item

- `checked?: boolean | 'mixed'`
- `checkedChange?: (checked: boolean | 'mixed') => void`
- `disabled?: boolean`
- `id?: string`

### Context menu radio group

- `value?: string`
- `defaultValue?: string`
- `valueChange?: (value: string) => void`

### Context menu radio item

- `value: string`
- `disabled?: boolean`
- `id?: string`

## Angular API contract (required)

For TailNG signal-first Angular 21+ components, the Angular-facing primitive/component contract should align with signal APIs and modern Angular composition patterns.

### Signal-first Angular API expectations

- Use signal-based inputs for component configuration
- Use Angular-style outputs for change events
- Prefer `open` + `openChange`, `value` + `valueChange`, and `checked` + `checkedChange`
- Keep APIs compatible with two-way binding patterns where appropriate
- Avoid decorator-first legacy patterns in new component design unless needed for compatibility

### Angular integration requirements

- Support signal-based target/content composition
- Preserve stable output behavior during open and close transitions
- Expose disabled state consistently to Angular templates
- Support content projection and structural composition patterns used by Angular consumers
- Keep overlay and portal behavior compatible with SSR-safe Angular rendering strategies where relevant

## State model

### Root state

- `open=false` → menu closed
- `open=true` → menu open

### Item state

- standard item
- disabled item
- highlighted item
- submenu trigger item
- checkbox item
- radio item

## Keyboard interaction

- `ContextMenu` key or `Shift + F10`: Opens context menu for focused target where supported
- `ArrowDown`: Moves to next item
- `ArrowUp`: Moves to previous item
- `Home`: Moves to first enabled item
- `End`: Moves to last enabled item
- `Enter`: Activates focused item where appropriate
- `Space`: Activates focused item where appropriate
- `ArrowRight`: Opens submenu when focused item owns submenu
- `ArrowLeft`: Closes submenu and returns focus to parent trigger
- `Escape`: Closes current menu layer
- `Tab`: Usually dismisses menu and returns to broader page navigation depending on design

Notes:

- Keyboard behavior should align with WAI-ARIA menu expectations
- Disabled items should be skipped in roving focus and typeahead behavior where appropriate
- Submenu direction should respect text direction and collision constraints

## Behavior recommendations

- Opening from pointer should anchor the menu to the pointer location
- Opening from keyboard should anchor the menu to the focused target or its logical anchor rect
- Selecting an action item should close the active menu unless the item explicitly keeps it open
- Submenu traversal should feel stable and forgiving around pointer gaps
- Outside interaction should dismiss all open menu layers unless modal rules say otherwise

## Readonly / disabled behavior decision

Recommended behavior:

- `disabled` target should not open the context menu
- Disabled items should be focus-skipped where appropriate and must not activate
- Context menu itself usually does not need a separate readonly state, but checkbox/radio items inside it may respect readonly-like application rules if your higher-level model requires them

## Accessibility notes

- Use menu semantics only for actual command/action lists, not general content popovers
- Ensure the context menu has a clear accessible label when needed
- Submenu triggers should expose expanded state
- Checkbox and radio items should expose the correct checked state semantics
- Screen reader and keyboard users must be able to discover and dismiss the menu predictably

## Form-adjacent behavior

- Context menu is not itself a form control
- Checkbox and radio menu items may mirror application state but should not be treated as native form submission controls by default
- If form-related state is manipulated from the menu, value synchronization should be explicit and predictable

## Open design decisions

- Whether long-press support belongs in core primitive or optional utility layer
- Whether trackpad secondary click handling needs dedicated abstraction
- Whether `Tab` should dismiss immediately or keep focus trapped in modal menu mode
- Whether submenu open delay and close delay should be configurable
- Whether pointer-safe polygon logic is needed in the first version for submenu traversal

## Test checklist

### Rendering

- [ ] Renders target integration correctly
- [ ] Renders menu content only when open
- [ ] Renders standard items correctly
- [ ] Renders checkbox items correctly
- [ ] Renders radio items correctly
- [ ] Renders labels correctly
- [ ] Renders separators correctly
- [ ] Renders submenu trigger correctly
- [ ] Renders disabled state correctly

### Accessibility

- [ ] Exposes correct `role='menu'` on content
- [ ] Exposes correct `role='menuitem'` on standard items
- [ ] Exposes correct `role='menuitemcheckbox'` on checkbox items
- [ ] Exposes correct `role='menuitemradio'` on radio items
- [ ] Exposes `aria-haspopup` on submenu trigger
- [ ] Exposes `aria-expanded` when submenu is open
- [ ] Exposes `aria-disabled` on disabled items
- [ ] Computes accessible label correctly
- [ ] Preserves correct highlighted and focus semantics

### Open and close behavior

- [ ] Opens on `contextmenu` event
- [ ] Opens on keyboard context-menu shortcut where supported
- [ ] Does not open when target is disabled
- [ ] Closes on Escape
- [ ] Closes on outside interaction
- [ ] Restores focus correctly when configured
- [ ] Emits `openChange` on open
- [ ] Emits `openChange` on close

### Keyboard interaction

- [ ] Moves to next item with ArrowDown
- [ ] Moves to previous item with ArrowUp
- [ ] Moves to first enabled item with Home
- [ ] Moves to last enabled item with End
- [ ] Activates item with Enter
- [ ] Activates item with Space where appropriate
- [ ] Opens submenu with ArrowRight
- [ ] Closes submenu with ArrowLeft
- [ ] Skips disabled items during navigation

### Pointer interaction

- [ ] Positions menu at pointer location on right-click
- [ ] Activates item on pointer selection
- [ ] Opens submenu on pointer interaction where supported
- [ ] Closes menu after action selection by default
- [ ] Keeps menu open when item behavior requires it

### Controlled behavior

- [ ] Supports controlled open state
- [ ] Emits `openChange` without mutating visual state until controlled prop updates
- [ ] Supports controlled checkbox item state
- [ ] Supports controlled radio group state

### Uncontrolled behavior

- [ ] Supports `defaultOpen`
- [ ] Updates internal open state on interaction
- [ ] Supports uncontrolled checkbox item toggling where applicable
- [ ] Supports uncontrolled radio group selection where applicable

### Positioning and layering

- [ ] Avoids viewport overflow when collisions occur
- [ ] Applies side and align positioning correctly
- [ ] Supports portal rendering correctly
- [ ] Positions submenu relative to parent trigger
- [ ] Preserves stable layering for nested submenus

### Angular integration

- [ ] Works with signal-based open state binding
- [ ] Works with Angular template composition patterns
- [ ] Emits Angular-style outputs consistently
- [ ] Preserves projected content behavior correctly
- [ ] Works in SSR-safe rendering scenarios where supported

### Data attributes

- [ ] Applies `data-open` when open
- [ ] Applies `data-closed` when closed
- [ ] Applies `data-disabled` in disabled state
- [ ] Applies `data-focused` on focus
- [ ] Applies `data-focus-visible` on keyboard focus
- [ ] Applies `data-highlighted` on active item
- [ ] Applies `data-submenu-open` when submenu is open
- [ ] Applies `data-side` correctly
- [ ] Applies `data-align` correctly

## Implementation Steps

- [ ] Headless component created in `primitives`
- [ ] Test cases created for headless
- [ ] Headless example page added/updated in playground - plain CSS app
- [ ] Headless example page added/updated in playground - Tailwind app
- [ ] Minimum style `<tng-context-menu>` component created in `components`
- [ ] Test cases created for `<tng-context-menu>`
- [ ] Component example page added/updated in playground - plain CSS app
- [ ] Component example page added/updated in playground - Tailwind app
- [ ] Docs added/updated in docs project - Overview section
- [ ] Docs added/updated in docs project - API section
- [ ] Docs added/updated in docs project - Styling section
- [ ] Docs added/updated in docs project - Example section
- [ ] Registry templates added in registry
- [ ] `tailng add context-menu` command generation added
- [ ] CLI integration tests added for `tailng add context-menu`

## Links

- Playground: `/context-menu`
