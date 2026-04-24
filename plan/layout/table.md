# TailNG Table — Plan (API, Feature Design, Test Matrix)

> Goal: **table primitives first (headless)** with strong accessibility + state hooks, and optional styled wrappers later.
> The Table **does not own** Empty/Loading UI — it exposes **slots + state attributes** so consumers can plug in existing components.

---

## 0) Naming & positioning

### Recommended naming (Angular Material–ish)
- **Primitive (headless):**
  - `tngTable` (directive) for `<table>`
  - `tngTableHeader`, `tngTableBody`, `tngTableFooter` (slot directives)
  - `tngTableRow`, `tngTableCell`, `tngTableHeaderCell` (optional helpers)
- **Composed wrapper (optional, later):**
  - `<tng-table>` as a convenience wrapper that renders a `<table tngTable>` internally (only if you decide to ship a wrapper).

### Scope of v1
- Semantic HTML table first (`<table>`, `<thead>`, `<tbody>`, `<tfoot>`).
- Feature controllers are **framework-agnostic TS** where possible.
- DOM bindings are thin directives and rely on **data-slot** and **data-* state attrs** for styling.

---

## 1) Table primitives (headless) — DOM contract

### 1.1 Core directive: `tngTable`
Attach to a native table:

```html
<table tngTable>
  <thead tngTableHeader>...</thead>
  <tbody tngTableBody>...</tbody>
  <tfoot tngTableFooter>...</tfoot>
</table>
```

#### Inputs (minimal v1)
- `items?: readonly T[]` (optional convenience for state computation; can be omitted if you prefer pure-slot contract)
- `loading?: boolean` (default `false`)
- `rowId?: (row: T, index: number) => string` (optional; used for selection/expansion tracking)
- `dir?: 'ltr' | 'rtl'` (optional, for keyboard nav helpers where relevant)

#### Host state attributes (styling/test hooks)
- `data-slot="table"`
- `data-loading` (present when `loading=true`)
- `data-empty` (present when `items.length===0 && !loading`)
- `data-has-header` / `data-has-footer` (present if the slot exists)
- `data-selectable` (present when selection plugin enabled)
- `data-sortable` (present when sort enabled)
- `data-filterable` (present when filter enabled)
- `data-pageable` (present when pagination enabled)

---

### 1.2 Slot directives
- `tngTableHeader` on `<thead>` → `data-slot="table-header"`
- `tngTableBody` on `<tbody>` → `data-slot="table-body"`
- `tngTableFooter` on `<tfoot>` → `data-slot="table-footer"`

Optional utility slots (consumer-owned UI):
- `tngTableEmpty` (renders when empty)
- `tngTableLoading` (renders when loading)
- `tngTableToolbar` (filters/search/actions outside the table)
- `tngTablePagination` (paginator slot)

---

## 2) Feature plugins (headless controllers)

### 2.1 Sorting
- Pure controller: `createTngSortController()`
- Optional DOM glue: `tngSortHeader` on `<th>` with `aria-sort` + `data-sort-*` hooks.

### 2.2 Filtering
- Pure controller: `createTngFilterController()`
- Usually wired from app state; directives optional.

### 2.3 Pagination
- Pure controller: `createTngPaginationController()`
- UI is consumer-owned via `tngTablePagination` slot.

### 2.4 Selection
- Pure controller: `createTngRowSelectionController()`
- Prefer `data-selected` styling hook; avoid forcing grid ARIA.

### 2.5 Expansion
- Pure controller: expanded ids + detail-row slot.

---

## 3) Accessibility baseline
- Native `<table>` semantics.
- Sorting uses `aria-sort` on `<th>`.
- Arrow-key navigation belongs to `tngGrid`, not `tngTable`.

---

## 4) Theme contract (recommended)

### Slots
- `table`, `table-header`, `table-body`, `table-footer`
- `table-empty`, `table-loading`, `table-toolbar`, `table-pagination`

### State attrs
- `data-loading`, `data-empty`
- `data-sort-active`, `data-sort-direction`
- `data-selected`, `data-expanded`

### CSS vars (example)
- `--tng-table-radius`
- `--tng-table-border`
- `--tng-table-header-bg`
- `--tng-table-row-hover-bg`
- `--tng-table-cell-px`, `--tng-table-cell-py`

---

# Test Cases (grouped, one-line)

## A) Exports & attachment
- [x] A1 `tngTable exports` — directive is exported. `DONE`
- [x] A2 `attaches to <table tngTable>` — no runtime errors. `DONE`
- [x] A3 `slot directives export` — header/body/footer exported. `DONE`

## B) Slot + DOM contract
- [x] B1 `data-slot table` — host has `data-slot="table"`. `DONE`
- [x] B2 `slot markers thead/tbody/tfoot` — each has correct `data-slot`. `DONE`
- [x] B3 `has-header toggles` — host reflects header presence. `DONE`
- [x] B4 `has-footer toggles` — host reflects footer presence. `DONE`

## C) Empty/Loading hooks
- [x] C1 `data-loading` — set/cleared by input. `DONE`
- [x] C2 `data-empty` — set when empty & not loading. `DONE`
- [x] C3 `loading wins over empty` — empty not set when loading. `DONE`

## D) Sorting controller
- [x] D1 `toggle cycles` — asc→desc→none. `DONE`
- [x] D2 `disableClear` — asc↔desc. `DONE`
- [x] D3 `apply sorts` — accessor-based sort. `DONE`

## E) Sort header directive
- [x] E1 `click toggles` — click toggles sort. `DONE`
- [x] E2 `Enter/Space toggles` — keyboard activation works. `DONE`
- [x] E3 `aria-sort updates` — ascending/descending/none. `DONE`

## F) Filtering controller
- [x] F1 `setQuery` — updates state. `DONE`
- [x] F2 `setColumnFilter` — updates state. `DONE`
- [x] F3 `apply` — filters rows. `DONE`

## G) Pagination controller
- [x] G1 `slice` — returns correct page. `DONE`
- [x] G2 `pageCount` — correct count. `DONE`

## H) Selection controller
- [x] H1 `single` — only one selected. `DONE`
- [x] H2 `multiple` — toggles add/remove. `DONE`
- [x] H3 `selectAll` — selects all ids. `DONE`

## I) Stability
- [x] I1 `updates recompute hooks` — items/loading/header/footer runtime updates. `DONE`
- [x] I2 `destroy cleans up` — no leaks. `DONE`

---

## Suggested file layout
- `libs/tailng-ui/primitives/src/lib/layout/table/`
  - `index.ts`
  - `tng-table.ts`
  - `tng-table-render.ts`
  - `tng-table-sort.ts`
  - `__tests__/tng-table.a11y.spec.ts`
  - `__tests__/tng-table.columns.spec.ts`
  - `__tests__/tng-table.expansion.spec.ts`
  - `__tests__/tng-table.exports.spec.ts`
  - `__tests__/tng-table.dom.spec.ts`
  - `__tests__/tng-table.interaction.spec.ts`
  - `__tests__/tng-table.rendering.spec.ts`
  - `__tests__/tng-table.selection.spec.ts`
  - `__tests__/tng-table.states.spec.ts`
  - `__tests__/tng-table.sort-header.spec.ts`
  - `__tests__/tng-table.stability.spec.ts`
- `libs/tailng-ui/cdk/src/table/`
  - `index.ts`
  - `expansion/{expansion.ts, expansion.types.ts, expansion.spec.ts}`
  - `sort/{sort.ts, sort.types.ts, sort.spec.ts}`
  - `filter/{filter.ts, filter.types.ts, filter.spec.ts}`
  - `pagination/{pagination.ts, pagination.types.ts, pagination.spec.ts}`
  - `selection/{selection.ts, selection.types.ts, selection.spec.ts}`
---

## Comprehensive test cases

> One-line, category-wise. Treat these as your “lock list” for v1 (you can mark optional items later).

### A) Exports & smoke
- [x] **Exports:** Table primitives/components export without build errors. `DONE`
- [x] **Minimal render:** Renders a table with 1 column + 1 row without warnings. `DONE`
- [x] **No data render:** Renders with columns defined but zero rows (no crashes). `DONE`
- [x] **Large data render:** Renders 1k+ rows (non-virtual) without exceptions. `DONE`
- [ ] **SSR safety:** Can render on server/prerender without accessing `window`/`document`. `PENDING`

### B) DOM structure & projection contract
- [x] **Semantic tags:** Uses `<table>/<thead>/<tbody>/<tr>/<th>/<td>` correctly (when using semantic mode). `DONE`
- [ ] **Role mode:** Uses correct ARIA roles if rendered as div-based grid (if supported). `PENDING`
- [ ] **Header/body alignment:** Header cells align with body cells for all columns. `PENDING`
- [x] **Footer rendering:** Footer renders only when footer rows/slots exist. `DONE`
- [x] **Slot order:** Projected toolbar/header/footer slots appear in the documented DOM order. `DONE`
- [x] **No duplication:** Re-render does not duplicate projected nodes or rows. `DONE`

### C) Columns definition & identity
- [ ] **Stable column ids:** Column `id` is required/stable and used as key. `PENDING`
- [ ] **Duplicate ids:** Duplicate column ids warn (dev) and table remains stable. `PENDING`
- [x] **Dynamic columns:** Adding/removing columns at runtime updates header/body correctly. `DONE`
- [x] **Column reordering:** Reordering column definitions reorders cells without losing state. `DONE`
- [x] **Column visibility:** Hiding a column removes its cells from DOM and accessibility tree. `DONE`
- [ ] **Pinned columns:** Pinned start/end columns maintain correct ordering and offsets (if supported). `PENDING`

### D) Row identity & data updates
- [ ] **Stable row ids:** Row `id`/trackBy keeps row identity across updates. `PENDING`
- [x] **Insert/remove rows:** Adding/removing rows updates DOM without mis-assigning cells. `DONE`
- [x] **Row reorder:** Reordering data preserves selection/expanded state (by id). `DONE`
- [ ] **Cell value updates:** Updating a single cell updates only that cell (if signal/track optimizations exist). `PENDING`
- [x] **Null/undefined values:** Renderers handle null/undefined without throwing. `DONE`
- [x] **Mixed types:** Columns with mixed value types render safely via formatter. `DONE`

### E) Cell rendering & formatting
- [x] **Default renderer:** Renders primitive string/number/boolean values with default formatting. `DONE`
- [x] **Custom cell template:** Custom renderer/template receives correct row + column context. `DONE`
- [x] **Header template:** Custom header renderer works and receives column context. `DONE`
- [x] **Footer template:** Custom footer renderer works and receives column context. `DONE`
- [x] **Formatter errors:** Formatter throwing does not crash whole table; surfaces error boundary (if supported). `DONE`
- [x] **HTML injection:** Cell rendering escapes by default (no unsafe HTML unless explicitly allowed). `DONE`

### F) Sorting
- [x] **Sort disabled column:** Clicking sort on non-sortable column does nothing. `DONE`
- [x] **Single sort:** Sorting by one column toggles asc → desc → none (per contract). `DONE`
- [ ] **Multi sort:** Multi-column sort applies in order of activation (if supported). `PENDING`
- [x] **Stable sort:** Sorting preserves relative order of equal values (stable sort). `DONE`
- [x] **Custom comparator:** Column comparator is used when provided. `DONE`
- [x] **Sort state sync:** External sort state input updates UI indicators. `DONE`
- [x] **Keyboard sort:** Enter/Space on header triggers sort when header is focusable. `DONE`

### G) Filtering & search
- [x] **Global filter:** Global search filters rows correctly (if supported). `DONE`
- [x] **Column filter:** Column-specific filter affects only that column’s predicate. `DONE`
- [x] **Filter + sort:** Combined filter+sort produces correct results. `DONE`
- [x] **Filter reset:** Clearing filter restores full dataset. `DONE`
- [ ] **Debounced filter:** Debounced search respects delay and final value (if supported). `PENDING`
- [x] **No-match state:** “No results” empty-state shows when filters remove all rows. `DONE`

### H) Pagination
- [x] **Client pagination:** Page size + page index select the correct row slice. `DONE`
- [ ] **Page reset:** Changing filter/sort resets to page 1 (per contract). `PENDING`
- [x] **Page size change:** Changing page size keeps first visible row in view (if supported) or resets cleanly. `DONE`
- [x] **Out-of-range:** Setting page index beyond last page clamps to last page. `DONE`
- [x] **Server pagination:** Emits `pageChange` with correct params without mutating rows (if headless supports server mode). `DONE`

### I) Selection
- [x] **Single selection:** Clicking a row selects it and clears previous selection. `DONE`
- [x] **Multi selection:** Ctrl/Meta toggles selection without clearing others (if supported). `DONE`
- [x] **Range selection:** Shift-click selects a range using anchor logic (if supported). `DONE`
- [x] **Select all:** Select-all selects only eligible rows (not disabled/filtered out per contract). `DONE`
- [x] **Disabled rows:** Disabled rows cannot be selected and have correct ARIA/state hooks. `DONE`
- [x] **Selection persistence:** Selection persists across sort/filter/pagination by row id. `DONE`
- [x] **Selection events:** Emits selectionChange after internal state update (event ordering locked). `DONE`

### J) Row expansion / details
- [x] **Expand toggle:** Expand action toggles only the targeted row. `DONE`
- [x] **Single expand mode:** In single-expand mode, opening one row closes others. `DONE`
- [x] **Expanded content:** Expanded content renders with correct colspan/width. `DONE`
- [x] **Expansion persistence:** Expanded state persists across sort/filter (by id) or resets (per contract). `DONE`
- [x] **Keyboard expansion:** Enter/Space on expander triggers expand when focusable. `DONE`

### K) Row actions
- [x] **Row click:** Row click emits rowClick with row id and original event. `DONE`
- [x] **Cell click:** Cell click emits cellClick with row+column context (if supported). `DONE`
- [x] **Action stopPropagation:** Clicking action buttons inside cells does not trigger rowClick (when documented). `DONE`
- [x] **Context menu:** Right-click emits context menu event with row context (if supported). `DONE`

### L) Keyboard navigation & focus
- [x] **Tab order:** Tab moves into the table to the correct first focusable element (header/row) per contract. `DONE`
- [x] **Roving focus:** Arrow keys move focus across cells/rows without leaving the table (if supported). `DONE`
- [x] **Active-descendant:** Focus stays on container with aria-activedescendant updates (if using that strategy). `DONE (N/A: roving tabindex strategy is implemented instead)`
- [x] **Home/End:** Home/End jump to first/last cell/row in the current scope. `DONE`
- [x] **PageUp/PageDown:** Moves by viewport/page chunk (if supported). `DONE`
- [x] **Escape:** Escape exits interactive mode / closes open popovers (if supported). `DONE`
- [x] **Focus restore:** On destroy, focus restores to trigger element if table opened as overlay (if relevant). `DONE`

### M) Accessibility semantics
- [x] **Header association:** Data cells are associated with headers (`scope`, `headers`, or role semantics). `DONE`
- [x] **Sort aria:** Sortable headers expose correct `aria-sort` values. `DONE`
- [x] **Selection aria:** Selected rows/cells expose correct `aria-selected` values. `DONE`
- [x] **Disabled aria:** Disabled rows/cells expose correct `aria-disabled` values. `DONE`
- [ ] **Announce changes:** Sorting/filtering changes emit optional live-region announcements only if enabled (no default spam). `PENDING`
- [x] **Labeling:** Table has an accessible name via `aria-label`/`aria-labelledby` (or caption). `DONE`

### N) Layout features
- [x] **Fixed layout:** `table-layout: fixed` mode truncates/ellipsis correctly (if supported). `DONE`
- [x] **Auto layout:** Auto layout respects content widths. `DONE`
- [x] **Sticky header:** Sticky header stays pinned during scroll (if supported). `DONE`
- [x] **Sticky footer:** Sticky footer stays pinned (if supported). `DONE`
- [x] **Sticky columns:** Sticky columns remain visible and don’t overlap content. `DONE`
- [x] **Responsive:** Horizontal overflow shows scroll container without breaking header alignment. `DONE`

### O) Column sizing & resizing
- [x] **Default widths:** Column width defaults apply and can be overridden. `DONE`
- [x] **Resize drag:** Dragging resizer updates column width live (if supported). `DONE`
- [x] **Min/max clamp:** Resizing clamps to min/max widths. `DONE`
- [x] **Persist widths:** Persisted widths restore correctly on reload (if supported). `DONE`
- [x] **RTL resizing:** Resizing works in RTL (drag direction + pinned sides correctness). `DONE`

### P) Virtualization
- [ ] **Virtual window:** Only visible rows render when virtualization enabled. `PENDING`
- [ ] **Scroll sync:** Scrolling updates rendered row window without blank gaps. `PENDING`
- [ ] **Sticky + virtual:** Sticky header works with virtualization. `PENDING`
- [ ] **Selection + virtual:** Selecting an offscreen row persists and renders selected state when it appears. `PENDING`

### Q) States: loading / empty / error
- [ ] **Loading row:** Loading state shows skeleton/progress row component without layout shift. `PENDING`
- [x] **Empty state:** Empty state renders when rows length is 0 (and not loading). `DONE`
- [x] **No-results state:** No-results renders when filters remove all rows. `DONE`
- [x] **Error state:** Error state renders when data source fails (if supported) and keeps table stable. `DONE`

### R) Theming hooks & data attributes
- [x] **Data attributes:** Emits `data-*` hooks for state (focused, invalid, selected, disabled, etc.) per contract. `DONE`
- [x] **Token changes:** Token-related attributes update when inputs change at runtime. `DONE`
- [ ] **No tag selectors:** Theme contract can style purely via slots + state attrs (verified by CSS audit). `PENDING`

### S) RTL / i18n / localization
- [ ] **RTL layout:** Column pinning and scroll direction behave correctly in RTL. `PENDING`
- [ ] **Number/date formatting:** Locale-aware formatting works via provided formatter/adapter. `PENDING`
- [x] **Text direction switch:** Runtime dir change (ltr ↔ rtl) preserves state and recalculates pinned offsets (if supported). `DONE`

### T) Performance & memory
- [x] **No leaks:** Destroying table releases observers/listeners (no retained references). `DONE`
- [ ] **Batch updates:** Bulk row updates do not cause O(n²) behaviors in sorting/filtering (smoke perf check). `PENDING`
- [ ] **Event throttling:** Scroll/resize handlers are throttled/debounced when appropriate (if supported). `PENDING`

### U) Integration contracts
- [ ] **Router links:** Cells containing router links work without prevented defaults. `PENDING`
- [ ] **Forms in cells:** Inputs/selects inside cells remain usable; table doesn’t steal keyboard events unexpectedly. `PENDING`
- [ ] **Overlay in cells:** Menus/popovers inside cells position correctly and don’t get clipped (if overlay layer used). `PENDING`
- [ ] **External state control:** Controlled mode (external sort/filter/page) works without internal divergence. `PENDING`
