# Grid

Headless grid primitive for a two-dimensional keyboard-navigable grid of cells.

## Overview

Grid is a headless layout component that presents a 2D grid of cells (e.g. calendar, data grid, date/time picker). Arrow keys move focus between cells; Enter or Space typically activate or select. Row/column span and optional selection/activation behavior are configurable. It composes with listbox or custom cell content.

This component should expose structure, keyboard navigation (roving tabindex or focus management), and optional selection/activation while leaving visual layout and cell content to the consumer.

## Supported states

- Per cell: focused, selected, activated, disabled
- Grid: rows, columns, optional row/col span
- Orientation and navigation direction
- Focus-visible for keyboard users

## Common use cases

- Calendar month view
- Data grid (keyboard nav)
- Date picker or time picker grid
- Keyboard-navigable custom grids
- Composes with listbox or custom cell content

## Headless component goals

- Provide accessible grid semantics (role="grid", role="gridcell", row/rowheader/columnheader)
- Support arrow key navigation (with optional wrap)
- Support Home, End, Page Up, Page Down where appropriate
- Support Enter/Space for activation or selection
- Support optional row/col span
- Expose state for styling and custom cell content

## Required headless features

### Core behavior

- Grid root (role="grid")
- Rows (role="row") and cells (role="gridcell" or rowheader/columnheader)
- Controlled or uncontrolled focus position (row/col index)
- Optional selection state (single cell or range)
- Optional row/column span per cell

### Accessibility

- Root: role="grid", aria-label; aria-rowcount, aria-colcount if known
- Rows: role="row"
- Cells: role="gridcell" (or rowheader/columnheader); aria-selected, aria-disabled
- Single tab stop into grid; roving tabindex or focus management
- aria-rowindex, aria-colindex for position

### Interaction

- Arrow Up/Down/Left/Right: move focus between cells (with optional wrap)
- Home/End: first/last cell in row or grid
- Page Up/Page Down: optional (e.g. next/prev row set)
- Enter/Space: activate cell or toggle selection (design-dependent)
- Click to focus and optionally select/activate

### Composition

- Grid root
- Grid row (optional component or structural)
- Grid cell (directive or component; may contain custom content)

### State exposure

- data-focused, data-selected, data-disabled, data-focus-visible per cell
- data-row-index, data-col-index (or equivalent) for styling

## Suggested primitives / parts

- `GridRoot`
- `GridRow`
- `GridCell` / `GridCellHeader`

## Suggested APIs

### Grid root

- `ariaLabel?: string`
- `ariaRowcount?: number`, `ariaColcount?: number`
- `orientation?: 'vertical' | 'horizontal'` (keyboard flow)
- `wrap?: boolean` (arrow wrap)
- `focusRow?: number`, `focusCol?: number` (controlled focus)
- `focusRowChange?`, `focusColChange?` (outputs)
- Optional selection: value, valueChange for selected cell(s)

### Grid cell

- `rowIndex: number`, `colIndex: number`
- `rowSpan?: number`, `colSpan?: number`
- `disabled?: boolean`
- `selected?: boolean` (when selection is used)
- Header: role="rowheader" or "columnheader" when applicable

### Angular API contract (required)

- Grid root: inputs for aria, orientation, wrap, focus position, selection; outputs for focus/selection change
- Grid cell: inputs for rowIndex, colIndex, rowSpan, colSpan, disabled, selected
- Cell must integrate with grid focus and selection state (inject grid or use provider)

## Keyboard interaction

- Arrows: move focus; wrap if configured
- Home: first cell in row or first cell in grid
- End: last cell in row or last cell in grid
- Page Up/Page Down: optional
- Enter/Space: activate or select per design
- Type-ahead: optional (e.g. jump to cell by label)

## Accessibility notes

- Follow WAI-ARIA grid pattern: single tab stop, roving tabindex or managed focus
- Expose row/column count and cell position for screen readers
- Header cells should use role="rowheader" or "columnheader"

## Open design decisions

- Whether grid manages focus via roving tabindex or imperative focus (row/col index)
- Selection: single cell vs. range vs. multiple
- Whether grid is generic or specialized (e.g. calendar-only)

## Test checklist

### Rendering

- [ ] Renders grid root with role="grid"
- [ ] Renders rows and cells with correct roles
- [ ] Renders row/col span when used
- [ ] Applies data attributes (data-focused, data-selected, data-row-index, data-col-index)

### Accessibility

- [ ] Root has aria-label; optional aria-rowcount/aria-colcount
- [ ] Cells have aria-rowindex, aria-colindex
- [ ] Single tab stop; focus moves with arrows
- [ ] Header cells have correct role

### Keyboard interaction

- [ ] Arrows move focus between cells
- [ ] Home/End move as designed
- [ ] Enter/Space activate or select
- [ ] Disabled cells skipped

### Pointer interaction

- [ ] Click focuses and optionally selects/activates cell

### Controlled behavior

- [ ] Supports controlled focus position and selection
- [ ] Emits focus/selection change outputs

### Data attributes

- [ ] Applies data-focused, data-selected, data-disabled, data-focus-visible

## Implementation Steps

1. [x] Headless component created in `primitives` (minimal root exists; full grid behavior TBD)
2. [x] Test cases created for headless
3. [ ] Headless example page added/updated in playground - plain CSS app
4. [ ] Headless example page added/updated in playground - Tailwind app
5. [x] Minimum style `<tng-grid>` component created in `components`
6. [x] Test cases created for `<tng-grid>`
7. [ ] Component example page added/updated in playground - plain CSS app
8. [ ] Component example page added/updated in playground - Tailwind app
9. [ ] Docs added/updated in docs project - Overview section
10. [ ] Docs added/updated in docs project - API section
11. [ ] Docs added/updated in docs project - Styling section
12. [ ] Docs added/updated in docs project - Example section
13. [ ] Registry templates added in `registry` for copy-paste mode (`tailng add grid`)
14. [ ] `tailng-cli` command generation added for grid artifacts
15. [ ] CLI integration tests added for `tailng add grid`

## Links

- Playground: `/grid`
