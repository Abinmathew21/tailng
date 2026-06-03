# Implementation Plan: `tng-tree-table`

This plan adapts the original spec (`plan/layout/tree-table.md`) to the **actual** tailng3
codebase conventions. Where the original spec and the real repo diverge, the repo wins.

---

## 1. Reconciling the spec with the real codebase

The original spec was written against an assumed structure. The real repo differs in
several important ways, so the plan below corrects them:

| Original spec said | Real repo convention | Decision |
|---|---|---|
| `components/src/lib/data/tree-table` | Layout components live under `components/src/lib/layout/<name>` (`layout/table`, `layout/tree`) | Use `layout/tree-table` |
| `primitives/src/lib/tree-table` | Primitives live under `primitives/src/lib/layout/<name>` | Use `layout/tree-table` |
| Single-file component (`tng-tree-table.component.ts`) | Components split into `.component.ts` + `.component.html` + `.component.css` (see `tng-table.component.*`) | Three files, `templateUrl` + `styleUrl` |
| `tng-tree-table.tokens.ts` | No tokens file exists for table; styling uses BEM classes (`.tng-table__cell`) + CSS custom properties (`--tng-table-*` with `--tng-semantic-*` fallbacks) | Drop tokens file; use a `.css` with BEM + CSS variables |
| `TngTreeTableColumn` with `value`/`treeToggle` | `tng-table` uses `accessor`, `align`, `sticky`, `headerClass`, `cellClass` (string \| array \| fn) | Mirror `tng-table` column shape, add tree-specific `treeToggle` |
| `align: 'left' \| 'center' \| 'right'` | tailng uses `'start' \| 'center' \| 'end'` (`TngTableCellAlign`) | Use `start/center/end` |
| Pure-function primitives only | Repo has **both** pure transforms (`tng-tree.transforms.ts`, `tng-table-render.ts`) and directive primitives | Pure transforms are the right fit for flatten/expansion; no directives needed for MVP |
| Tests as `*.spec.ts` next to component | Primitives keep specs in `__tests__/`; components keep `*.component.spec.ts` beside the component; project uses **Vitest** | Follow both locations; Vitest |

Naming/style facts confirmed from the codebase:
- Standalone components, `imports: [...]`, `exportAs`, `signal` inputs/outputs (`input()`, `input.required()`, `output()`, `booleanAttribute` transform). Re-export an alias (`export { TngTreeTableComponent as TngTreeTable }`).
- Generic over `<TRow = unknown>`.
- Column class inputs support `string | readonly string[] | Record<string, boolean> | fn`; there's a `normalizeClassValue` helper pattern to copy.
- CSS variables follow `var(--tng-tree-table-*, var(--tng-semantic-*))`.

---

## 2. Target file layout

### Primitives — `libs/tailng-ui/primitives/src/lib/layout/tree-table/`
```
tree-table.types.ts          # TngTreeTableKey, NodeContext, FlatRow, FlattenOptions, RowEvent
tree-table-flattener.ts      # flattenTreeTableRows() — pure
tree-table-expansion.ts      # toggle/expand/collapseKey() — pure, immutable Sets
tree-table-selection.ts      # toggle/select/deselectKey(), isSelectable guard — pure
tree-table-keyboard.ts       # resolveTreeTableKeydown() — pure intent resolver
index.ts                     # barrel
__tests__/
  tree-table.flatten.spec.ts
  tree-table.expansion.spec.ts
  tree-table.selection.spec.ts
  tree-table.keyboard.spec.ts
```
Wire-up: add `export * from './tree-table';` to
`primitives/src/lib/layout/index.ts` (which is re-exported by `primitives/src/index.ts`).

### Components — `libs/tailng-ui/components/src/lib/layout/tree-table/`
```
tng-tree-table.component.ts      # TngTreeTableComponent<TRow>
tng-tree-table.component.html
tng-tree-table.component.css
tng-tree-table-column.type.ts    # TngTreeTableColumn<TRow>, slots, class types
tng-tree-table.component.spec.ts
index.ts
```
Wire-up: add `export * from './tree-table/tng-tree-table.component';` to
`components/src/lib/layout/index.ts`.

### Keep separate (per spec)
Do **not** add tree logic to `tng-table` or table rendering to `tng-tree`.

---

## 3. Primitive layer (headless, pure)

### 3.1 `tree-table.types.ts`
Port the spec types, aligned to tailng naming:
- `TngTreeTableKey = string | number`
- `TngTreeTableNodeContext<TRow>`, `TngTreeTableFlatRow<TRow>` (adds `visible`, `path`, `parentKey`)
- `TngTreeTableFlattenOptions<TRow>` (`data`, `expandedKeys`, `selectedKeys?`, `getKey`, `getChildren`, `isDisabled?`)
- `TngTreeTableRowEvent<TRow>` (`row`, `key`, `level`, `originalEvent`)

### 3.2 `tree-table-flattener.ts`
`flattenTreeTableRows<TRow>(options): readonly TngTreeTableFlatRow<TRow>[]`
- Depth-first walk. Root `level = 0`; children `level + 1`.
- `expandable = getChildren(row)?.length > 0`.
- Children emitted only when every ancestor key is in `expandedKeys` (collapsed parent ⇒ children excluded entirely).
- `key = getKey(row, indexPath)`; build `path` (ancestor keys + self) and `parentKey`.
- `selected = selectedKeys?.has(key) ?? false`; `disabled = isDisabled?.(row) ?? false`.
- Pure: never mutate input; freeze output rows. Handle `null`/`undefined`/missing children as empty.

### 3.3 `tree-table-expansion.ts`
`toggleExpandedKey`, `expandKey`, `collapseKey` — each returns a **new** `Set`, never mutates,
preserves unrelated keys.

### 3.4 `tree-table-selection.ts`
`toggleSelectedKey` / `selectKey` / `deselectKey` (new Set each), plus a guard so disabled rows
can't be selected. MVP: flat key selection only — **no** recursive parent/child, **no** tri-state.

### 3.5 `tree-table-keyboard.ts`
Pure resolver returning an intent (not DOM): `resolveTreeTableKeydown(key, ctx) => 'expand' |
'collapse' | 'toggle' | 'select' | 'focusFirst' | 'focusLast' | null`.
- ArrowRight ⇒ expand (if expandable & collapsed); ArrowLeft ⇒ collapse (if expandable & expanded);
  Enter ⇒ toggle; Space ⇒ select (if selectable) + preventDefault; Home ⇒ focusFirst; End ⇒ focusLast.
- Check `tng-tree`'s `tng-tree.keyboard.spec.ts` / transforms and reuse helpers where they fit.

---

## 4. Component layer (styled)

### 4.1 `tng-tree-table-column.type.ts`
```ts
export type TngTreeTableColumn<TRow = unknown> = Readonly<{
  key: string;            // column id
  label: string;
  accessor?: keyof TRow | ((row: TRow, index: number) => unknown); // mirrors tng-table
  align?: 'start' | 'center' | 'end';
  width?: string; minWidth?: string; maxWidth?: string;
  sortable?: boolean;
  sticky?: 'start' | 'end' | null;
  treeToggle?: boolean;   // tree-specific
  headerClass?: TngTreeTableClassInput;
  cellClass?: TngTreeTableClassInput | ((row: TRow) => TngTreeTableClassInput);
}>;
export type TngTreeTableSlot =
  | 'root' | 'table' | 'thead' | 'tbody' | 'headerRow' | 'headerCell'
  | 'row' | 'cell' | 'treeCell' | 'toggle' | 'toggleIcon' | 'indent'
  | 'emptyRow' | 'emptyCell' | 'loadingRow' | 'loadingCell';
```
Reuse the `TngTableClassInput` shape and a `normalizeClassValue` helper copied from `tng-table`.

### 4.2 `tng-tree-table.component.ts` — `TngTreeTableComponent<TRow = unknown>`
Selector `tng-tree-table`, `exportAs: 'tngTreeTableComponent'`, standalone.

Signal **inputs**: `data`, `columns` (`input.required`), `getKey`, `getChildren`,
`expandedKeys` (array in, controlled), `selectedKeys`, `loading`/`disabled`/`expandOnRowClick`/
`selectable` (`booleanAttribute`), `emptyText='No records found'`, `loadingText='Loading...'`,
`treeColumnKey=null`, `indentSize=20`, plus `ariaLabel`/`dir`/`density` to match `tng-table`.

Signal **outputs**: `expandedKeysChange`, `selectedKeysChange`, `rowClick`, `rowExpand`,
`rowCollapse` (`TngTreeTableRowEvent<TRow>`).

Internal `computed`:
- `expandedSet` / `selectedSet` from input arrays.
- `flatRows = flattenTreeTableRows({...})` (visible rows only after flatten).
- `treeColumn`: first column with `treeToggle:true`, else column matching `treeColumnKey()`,
  else first column.
- `colspan` = visible column count for state rows.

Handlers: `onToggle(flatRow, event)` ⇒ expansion primitive + emit `expandedKeysChange` and
`rowExpand`/`rowCollapse` (skip disabled); `onRowClick` ⇒ emit `rowClick`, toggle if
`expandOnRowClick`; `onRowKeydown` ⇒ map `resolveTreeTableKeydown` to handlers + manage focus;
`onSelect` ⇒ selection primitive when `selectable` and not disabled.

Always emit **new arrays** from new Sets — never mutate inputs.

### 4.3 `tng-tree-table.component.html`
`<table role="treegrid">` with `<thead>`/`<tbody>`. For each `flatRow`:
```html
<tr role="row"
    [attr.aria-level]="flatRow.level + 1"
    [attr.aria-expanded]="flatRow.expandable ? flatRow.expanded : null"
    [attr.aria-selected]="selectable() ? flatRow.selected : null"
    [attr.aria-disabled]="flatRow.disabled ? true : null"
    (click)="onRowClick(flatRow, $event)" (keydown)="onRowKeydown(flatRow, $event)" tabindex="0">
```
Tree-toggle cell: indent spacer (`width = level * indentSize`px), expand/collapse `<button>`
(aria-label `Expand row`/`Collapse row`) for expandable rows or an equal-width placeholder spacer
when not expandable, then cell content. Other cells render `accessor` value with align/width/classes.
State rows (`<tr><td [attr.colspan]>`) for loading/empty are **not** `role="row"`; loading wins over empty.

### 4.4 `tng-tree-table.component.css`
BEM (`.tng-tree-table__row`, `__tree-cell`, `__toggle`, `__indent`, …) using
`var(--tng-tree-table-*, var(--tng-semantic-*))`, mirroring `tng-table.component.css`. Minimal
defaults; no Tailwind dependency.

---

## 5. Public API exports
- Primitives: `index.ts` barrel + add to `primitives/src/lib/layout/index.ts`.
- Components: `index.ts` barrel + add to `components/src/lib/layout/index.ts`.
- Verify root `src/index.ts` re-exports both (it re-exports `lib/layout`). Confirm no symbol
  collisions with existing `TngTable*` exports.

---

## 6. Tests (Vitest)
Port the spec's full test matrix into:
- Primitive: `tree-table.flatten.spec.ts` (levels, expandable flags, expand/collapse visibility,
  ref preservation, no input mutation, deep nesting, parentKey/path, null/missing/empty children),
  `tree-table.expansion.spec.ts`, `tree-table.selection.spec.ts`, `tree-table.keyboard.spec.ts`.
- Component `tng-tree-table.component.spec.ts`: rendering (treegrid role, headers, root/child rows,
  collapsed hidden, values, tree-toggle placement + first-column fallback, indentation, expand button
  vs placeholder, align/width, header/cell classes), expansion events, selection, accessibility
  (aria-level/expanded/selected/disabled, button labels, keyboard Arrow/Enter/Space + scroll prevent,
  Home/End focus), loading/empty (priority, colspan), input updates (no mutation of input arrays).

Run: `npx nx test tailng-ui-primitives` and `npx nx test tailng-ui-components` (confirm exact
project names via `nx.json`/`project.json`). Lint/format must pass.

---

## 7. Documentation (phased — mirror `tng-table` docs surfaces)
`tng-table` has docs under `docs/src/app/pages/components/layout/table` with `overview`, `examples`,
`styling`, `api` sections + `routes.ts`, plus `headless/layout/table` and `ownable/layout/table`.
Replicate the **components** surface for tree-table first:
`docs/src/app/pages/components/layout/tree-table/` with sections + `routes.ts`, registered in the
docs routing/nav. Examples to ship: basic, controlled expanded keys, selectable rows, loading,
empty, custom tree column. Headless + ownable + registry (`registry/src/lib/tree-table`) are
follow-ups, not MVP blockers.

---

## 8. Suggested build order
1. Primitive types + flattener + expansion/selection/keyboard, with their `__tests__` (TDD).
2. Wire primitive barrel + public API; run primitive tests green.
3. Component column type + slots/class helpers.
4. Component `.ts` + `.html` + `.css`.
5. Component wiring + public API export.
6. Component spec; run component tests green.
7. Lint/format; full `nx test` for both libs.
8. Docs components surface + examples.
9. (Follow-up) headless/ownable docs + registry entry.

## 9. Constraints checklist
Standalone + signals; no `any` (generics + precise typing); pure, testable primitives; no
tree logic in `tng-table`, no table rendering in `tng-tree`; reuse tailng helpers
(`normalizeClassValue`, align/length normalizers, tree keyboard helpers); follow lint/format;
export to public APIs; tests required before "done".
