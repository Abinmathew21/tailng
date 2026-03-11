# Tree

Headless tree primitive for hierarchical expandable lists (e.g. file explorer, category tree).

## Overview

Tree is a headless layout/selection component that displays hierarchical data. Nodes can expand and collapse; selection can be single or multiple depending on design. Keyboard navigation (arrow keys, Enter, Space) and optional lazy loading of children are expected. It is used for file explorers, category trees, and nested navigation.

This component should expose structure, expand/collapse state, selection state, and keyboard behavior while leaving visual styling to the consumer.

## Supported states

- Per node: expanded / collapsed, selected (single or multi), disabled, focused
- Tree root: orientation, selection mode (single/multiple/none), optional keyboard nav state
- Focus-visible for keyboard users

## Common use cases

- File or folder explorer
- Category or taxonomy tree
- Nested navigation menus
- Lazy-loaded children
- Optional checkboxes or selection highlight per node

## Headless component goals

- Provide accessible tree semantics (role="tree", role="treeitem", aria-expanded, aria-selected)
- Support parent/child structure and expand/collapse
- Support keyboard navigation (arrows, Home, End, Enter, Space)
- Support optional selection (single or multiple)
- Support lazy loading of children
- Expose state for custom rendering and styling

## Required headless features

### Core behavior

- Tree root container (role="tree" or "treegrid" if grid-like)
- Tree nodes (role="treeitem") with expand/collapse
- Child nodes grouped under parent; parent has aria-expanded
- Controlled or uncontrolled expanded state; controlled or uncontrolled selection
- Optional: lazy load children on expand

### Accessibility

- Root: role="tree", aria-label or aria-labelledby
- Items: role="treeitem", aria-expanded for expandable items, aria-selected when selectable
- aria-level, aria-setsize, aria-posinset for hierarchy and position
- Single tab stop into tree; roving tabindex or focus management within tree

### Interaction

- Arrow Left: collapse or move to parent
- Arrow Right: expand or move to first child
- Arrow Up/Down: move focus between visible items
- Home/End: first/last item
- Enter/Space: activate or toggle expand (and selection if applicable)
- Type-ahead optional
- Click to expand/collapse and optionally select

### Composition

- Tree root
- Tree item (reusable for each node; may nest tree group for children)
- Optional tree group for children list
- Optional indicator (icon) for expand/collapse

### State exposure

- data-expanded, data-selected, data-disabled, data-focused, data-focus-visible per item
- data-level or aria-level for styling indentation

## Suggested primitives / parts

- `TreeRoot`
- `TreeNode` / `TreeItem`
- `TreeGroup` (container for children)
- `TreeIndicator` (optional expand/collapse icon)

## Suggested APIs

### Tree root

- `value?: string | string[]` (selected value(s) when controlled)
- `defaultValue?: string | string[]`
- `valueChange?: (value: string | string[]) => void`
- `selectionMode?: 'single' | 'multiple' | 'none'`
- `ariaLabel?: string`, `ariaLabelledby?: string`
- `orientation?: 'vertical'` (default for tree)

### Tree item

- `value: string` (unique id)
- `expanded?: boolean`, `defaultExpanded?: boolean`
- `selected?: boolean` (if selection mode allows)
- `disabled?: boolean`
- Child items provided via content projection or TreeGroup

### Angular API contract (required)

- Tree root: inputs for value, defaultValue, selectionMode, orientation; output valueChange
- Tree item: inputs for value, expanded, defaultExpanded, selected, disabled
- Optional ControlValueAccessor for single selection when used in forms

## Keyboard interaction

- Arrow Left: collapse node if expanded; else focus parent
- Arrow Right: expand node if collapsed and has children; else focus first child
- Arrow Up: focus previous visible treeitem
- Arrow Down: focus next visible treeitem
- Home: focus first item
- End: focus last item
- Enter / Space: toggle expand; if selection mode, toggle selection
- Type-ahead: focus next item whose label starts with typed character (optional)

## Accessibility notes

- Follow WAI-ARIA tree pattern: single tab stop, roving tabindex, correct aria attributes
- Ensure aria-level, aria-setsize, aria-posinset for screen reader users
- Lazy-loaded children should not break keyboard order when loaded

## Open design decisions

- Flat data + parentId vs. nested data structure for items
- Whether selection is in scope for initial release
- Whether treegrid (grid-like) is supported in addition to tree
- Lazy loading API (callback, observable, or slot-based)

## Test checklist

### Rendering

- [ ] Renders tree root with role="tree"
- [ ] Renders tree items with role="treeitem"
- [ ] Renders expanded/collapsed state correctly
- [ ] Renders selected state when selection mode is used
- [ ] Renders disabled items correctly
- [ ] Applies data attributes per node (data-expanded, data-selected, data-disabled)

### Accessibility

- [ ] Root has aria-label or aria-labelledby
- [ ] Items have aria-expanded where applicable
- [ ] Items have aria-selected when selection mode is used
- [ ] Items have aria-level, aria-setsize, aria-posinset
- [ ] Single tab stop into tree; focus moves within tree with arrows

### Keyboard interaction

- [ ] Arrow Left collapses or moves to parent
- [ ] Arrow Right expands or moves to first child
- [ ] Arrow Up/Down move focus between items
- [ ] Home/End move to first/last item
- [ ] Enter/Space toggle expand and/or selection as designed
- [ ] Disabled items are skipped in navigation

### Pointer interaction

- [ ] Click on item or indicator toggles expand
- [ ] Click selects when selection mode is on (if designed)
- [ ] Disabled items do not respond

### Controlled / uncontrolled

- [ ] Supports controlled expanded and selection state
- [ ] Supports defaultExpanded / defaultValue and updates on interaction
- [ ] Emits valueChange when selection changes

### Data attributes

- [ ] Applies data-expanded, data-selected, data-disabled, data-focused, data-focus-visible where defined

## Implementation Steps

1. [ ] Headless component created in `primitives` (minimal root exists; full tree behavior TBD)
2. [ ] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [ ] Minimum style `<tng-tree>` component created in `components`
6. [ ] Test cases created for `<tng-tree>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add tree`)
14. [ ] `tailng-cli` command generation added for tree artifacts
15. [ ] CLI integration tests added for `tailng add tree`

## Links

- Playground: `/tree`
