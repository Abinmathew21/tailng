Below is a detailed prompt you can give to the component developer agent.

# Task: Create `tng-tree-table` for TailNG
We are building TailNG, an Angular UI component library.
TailNG package structure:
- `@tailng-ui/primitives`
  - Headless logic and reusable behavior.
  - No styled UI rendering.
- `@tailng-ui/components`
  - Styled components built on top of primitives.
  - Uses Angular signal-first APIs.
  - Uses TailNG slot/class styling approach.
  - Avoid Angular Material.
  - Tailwind may be used in examples, but the component should not depend on Tailwind.
Existing relevant components:
- `tng-table`
  - Flat table component.
  - Supports column definitions, row rendering, empty/loading states, selection/sort if already available.
- `tng-tree`
  - Hierarchical tree component.
  - Supports expand/collapse and tree-like navigation.
## Goal
Create a separate `tng-tree-table` component.
Do **not** overload the existing `tng-table` with tree mode.
The final architecture should be:
```txt
tng-table       → flat tabular data
tng-tree        → hierarchical navigation / tree view
tng-tree-table  → hierarchical rows inside a table

tng-tree-table should reuse ideas/utilities from tng-table and tng-tree, but should be a separate component with its own clear API.

⸻

Recommended folder structure

Primitives

Create reusable headless tree-table logic here:

libs/tailng-ui/primitives/src/lib/tree-table

Suggested files:

tree-table.types.ts
tree-table-flattener.ts
tree-table-expansion.ts
tree-table-selection.ts
tree-table-keyboard.ts
index.ts

Also export from the primitives public API if appropriate.

Components

Create the styled component here:

libs/tailng-ui/components/src/lib/data/tree-table

Suggested files:

tng-tree-table.component.ts
tng-tree-table-column.type.ts
tng-tree-table.tokens.ts
tng-tree-table.component.spec.ts
index.ts

Also export from the components public API.

⸻

Component name

Use:

tng-tree-table

Selector:

selector: 'tng-tree-table'

Class:

TngTreeTableComponent

⸻

Design principle

tng-tree-table is a styled data component backed by headless primitives.

The primitive layer should not render UI.

The component layer should handle:

* HTML table rendering
* headers
* cells
* indentation
* expand/collapse icon placement
* row/cell CSS classes
* ARIA attributes
* empty/loading rows
* events

⸻

Primitive model

Create a flexible model that does not force users to wrap their data.

Suggested types:

export type TngTreeTableKey = string | number;
export interface TngTreeTableNodeContext<TRow> {
  row: TRow;
  key: TngTreeTableKey;
  level: number;
  expandable: boolean;
  expanded: boolean;
  selected: boolean;
  disabled: boolean;
  parentKey: TngTreeTableKey | null;
}
export interface TngTreeTableFlatRow<TRow> {
  row: TRow;
  key: TngTreeTableKey;
  level: number;
  expandable: boolean;
  expanded: boolean;
  selected: boolean;
  disabled: boolean;
  visible: boolean;
  parentKey: TngTreeTableKey | null;
  path: readonly TngTreeTableKey[];
}

Primitive options:

export interface TngTreeTableFlattenOptions<TRow> {
  data: readonly TRow[];
  expandedKeys: ReadonlySet<TngTreeTableKey>;
  selectedKeys?: ReadonlySet<TngTreeTableKey>;
  getKey: (row: TRow, indexPath: readonly number[]) => TngTreeTableKey;
  getChildren: (row: TRow) => readonly TRow[] | null | undefined;
  isDisabled?: (row: TRow) => boolean;
}

Create a pure utility:

export function flattenTreeTableRows<TRow>(
  options: TngTreeTableFlattenOptions<TRow>,
): readonly TngTreeTableFlatRow<TRow>[];

Rules:

* Root rows have level = 0.
* Child rows increment level by 1.
* A row is expandable if it has children.
* If a parent is collapsed, its children should not appear in the flattened result.
* Use immutable output.
* Do not mutate the input data.
* Keep this function framework-independent if possible.

⸻

Expansion primitive

Create helpers for expansion state.

Suggested functions:

export function toggleExpandedKey(
  expandedKeys: ReadonlySet<TngTreeTableKey>,
  key: TngTreeTableKey,
): ReadonlySet<TngTreeTableKey>;
export function expandKey(
  expandedKeys: ReadonlySet<TngTreeTableKey>,
  key: TngTreeTableKey,
): ReadonlySet<TngTreeTableKey>;
export function collapseKey(
  expandedKeys: ReadonlySet<TngTreeTableKey>,
  key: TngTreeTableKey,
): ReadonlySet<TngTreeTableKey>;

Rules:

* Return a new Set.
* Do not mutate existing state.

⸻

Component API

Use Angular signal inputs/outputs.

Suggested inputs:

data = input<readonly TRow[]>([]);
columns = input.required<readonly TngTreeTableColumn<TRow>[]>();
getKey = input<(row: TRow, indexPath: readonly number[]) => TngTreeTableKey>();
getChildren = input<(row: TRow) => readonly TRow[] | null | undefined>();
expandedKeys = input<readonly TngTreeTableKey[]>([]);
selectedKeys = input<readonly TngTreeTableKey[]>([]);
loading = input(false, { transform: booleanAttribute });
disabled = input(false, { transform: booleanAttribute });
emptyText = input('No records found');
loadingText = input('Loading...');
expandOnRowClick = input(false, { transform: booleanAttribute });
selectable = input(false, { transform: booleanAttribute });
treeColumnKey = input<string | null>(null);
indentSize = input<number>(20);

Suggested outputs:

expandedKeysChange = output<readonly TngTreeTableKey[]>();
selectedKeysChange = output<readonly TngTreeTableKey[]>();
rowClick = output<TngTreeTableRowEvent<TRow>>();
rowExpand = output<TngTreeTableRowEvent<TRow>>();
rowCollapse = output<TngTreeTableRowEvent<TRow>>();

Event type:

export interface TngTreeTableRowEvent<TRow> {
  row: TRow;
  key: TngTreeTableKey;
  level: number;
  originalEvent: Event;
}

⸻

Column API

Create a tree-table column type.

export interface TngTreeTableColumn<TRow> {
  key: string;
  label: string;
  value?: (row: TRow) => unknown;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sticky?: 'start' | 'end';
  treeToggle?: boolean;
  headerClass?: string | readonly string[];
  cellClass?: string | readonly string[] | ((row: TRow) => string | readonly string[]);
}

Rules:

* treeToggle: true indicates the column where indentation and expand/collapse button are rendered.
* If no column has treeToggle: true, use:
    1. column matching treeColumnKey
    2. first column as fallback

⸻

Rendering behavior

Render as a semantic table.

Basic structure:

<table role="treegrid">
  <thead>
    <tr>
      <th>...</th>
    </tr>
  </thead>
  <tbody>
    <tr role="row">
      <td role="gridcell">...</td>
    </tr>
  </tbody>
</table>

For tree rows:

* The tree toggle cell should include:
    * indentation spacer
    * expand/collapse button if row is expandable
    * placeholder spacer if not expandable
    * cell content

ARIA rules:

* Table should use role="treegrid".
* Rows should expose:
    * aria-level
    * aria-expanded only when expandable
    * aria-selected when selectable
    * aria-disabled when disabled
* Expand/collapse button should have meaningful aria-label:
    * Expand row
    * Collapse row

Suggested row rendering:

<tr
  role="row"
  [attr.aria-level]="flatRow.level + 1"
  [attr.aria-expanded]="flatRow.expandable ? flatRow.expanded : null"
  [attr.aria-selected]="selectable() ? flatRow.selected : null"
>
  ...
</tr>

⸻

Keyboard behavior

Implement basic keyboard behavior for treegrid rows.

Minimum behavior:

* ArrowRight
    * If row is expandable and collapsed, expand it.
* ArrowLeft
    * If row is expandable and expanded, collapse it.
* Enter
    * Toggle expansion if row is expandable.
* Space
    * If selectable, toggle selection.
    * Prevent page scroll.
* Home
    * Move focus to first visible row.
* End
    * Move focus to last visible row.

Keep keyboard logic simple and testable.

If there is existing keyboard logic in tng-tree, reuse or adapt it.

⸻

Selection behavior

For MVP:

* Support simple row selection by key.
* Do not implement recursive parent-child selection unless already easy.
* Do not implement tri-state selection in first version.

Rules:

* Selection should work only when selectable is true.
* Disabled rows should not be selected.
* Emit selectedKeysChange.

⸻

Empty and loading states

When loading:

<tr>
  <td [attr.colspan]="columns.length">
    Loading...
  </td>
</tr>

When empty:

<tr>
  <td [attr.colspan]="columns.length">
    No records found
  </td>
</tr>

Rules:

* Loading state takes priority over empty state.
* Colspan should match visible columns count.
* Empty/loading rows should not be treegrid rows.

⸻

Styling / slots

Follow the TailNG component styling pattern.

Provide sensible slot/class names.

Suggested slots:

export type TngTreeTableSlot =
  | 'root'
  | 'table'
  | 'thead'
  | 'tbody'
  | 'headerRow'
  | 'headerCell'
  | 'row'
  | 'cell'
  | 'treeCell'
  | 'toggle'
  | 'toggleIcon'
  | 'indent'
  | 'emptyRow'
  | 'emptyCell'
  | 'loadingRow'
  | 'loadingCell';

The component should expose class customization in the same style as existing TailNG components.

Use minimal default styles.

Do not hard-code Tailwind-specific classes as a dependency.

⸻

Public usage example

The component should support this kind of usage:

interface AccountRow {
  id: string;
  name: string;
  type: string;
  balance: number;
  children?: AccountRow[];
}
columns: TngTreeTableColumn<AccountRow>[] = [
  {
    key: 'name',
    label: 'Name',
    value: row => row.name,
    treeToggle: true,
  },
  {
    key: 'type',
    label: 'Type',
    value: row => row.type,
  },
  {
    key: 'balance',
    label: 'Balance',
    value: row => row.balance,
    align: 'right',
  },
];
data: AccountRow[] = [
  {
    id: 'assets',
    name: 'Assets',
    type: 'Group',
    balance: 10000,
    children: [
      {
        id: 'cash',
        name: 'Cash',
        type: 'Ledger',
        balance: 3000,
      },
    ],
  },
];

Template:

<tng-tree-table
  [data]="data"
  [columns]="columns"
  [getKey]="getKey"
  [getChildren]="getChildren"
  [expandedKeys]="expandedKeys"
  (expandedKeysChange)="expandedKeys = $event"
/>

Component:

getKey = (row: AccountRow) => row.id;
getChildren = (row: AccountRow) => row.children;
expandedKeys = ['assets'];

⸻

Documentation requirements

Add basic docs/demo examples if the project has a docs or playground area.

Examples to include:

1. Basic tree table
2. Controlled expanded keys
3. Selectable rows
4. Loading state
5. Empty state
6. Custom tree column

⸻

Test cases

Add tests grouped by feature.

Primitive: flattening

* Should flatten root-level rows.
* Should assign level 0 to root rows.
* Should assign incremented levels to child rows.
* Should mark rows with children as expandable.
* Should mark rows without children as non-expandable.
* Should include children when parent key is expanded.
* Should exclude children when parent key is collapsed.
* Should preserve original row references.
* Should not mutate input data.
* Should support deeply nested rows.
* Should generate correct parent key.
* Should generate correct path.
* Should handle missing children as empty.
* Should handle null children as empty.
* Should handle empty data.

Primitive: expansion

* Should expand a collapsed key.
* Should collapse an expanded key.
* Should toggle an expanded key.
* Should toggle a collapsed key.
* Should return a new Set instance.
* Should not mutate the previous expanded keys Set.
* Should preserve unrelated expanded keys.

Component: rendering

* Should render table with role="treegrid".
* Should render header cells from column definitions.
* Should render root rows.
* Should render expanded child rows.
* Should not render collapsed child rows.
* Should render correct cell values.
* Should render tree toggle in the configured tree column.
* Should use the first column as tree column fallback.
* Should render indentation based on row level.
* Should render expand button only for expandable rows.
* Should render placeholder spacing for non-expandable rows.
* Should apply column alignment.
* Should apply column width.
* Should apply custom header classes.
* Should apply custom cell classes.

Component: expansion events

* Should expand row when expand button is clicked.
* Should collapse row when collapse button is clicked.
* Should emit expandedKeysChange when row expands.
* Should emit expandedKeysChange when row collapses.
* Should emit rowExpand with row details.
* Should emit rowCollapse with row details.
* Should not expand disabled rows.
* Should expand row on row click when expandOnRowClick is true.
* Should not expand row on row click when expandOnRowClick is false.

Component: selection

* Should not select rows when selectable is false.
* Should select row when selectable is true.
* Should emit selectedKeysChange on selection.
* Should not select disabled rows.
* Should apply aria-selected when selectable.
* Should preserve selected keys when expansion changes.

Component: accessibility

* Should set aria-level for root rows as 1.
* Should set aria-level for child rows based on depth.
* Should set aria-expanded="true" for expanded expandable rows.
* Should set aria-expanded="false" for collapsed expandable rows.
* Should not set aria-expanded for non-expandable rows.
* Should set meaningful aria-label for expand button.
* Should set meaningful aria-label for collapse button.
* Should set aria-disabled for disabled rows.
* Should support keyboard expansion with ArrowRight.
* Should support keyboard collapse with ArrowLeft.
* Should support keyboard toggle with Enter.
* Should support keyboard selection with Space when selectable.
* Should prevent page scroll on Space key.
* Should move focus to first visible row on Home.
* Should move focus to last visible row on End.

Component: loading and empty states

* Should render loading row when loading is true.
* Should render loading text.
* Should render empty row when data is empty.
* Should render empty text.
* Should prioritize loading state over empty state.
* Should use correct colspan for loading row.
* Should use correct colspan for empty row.

Component: input updates

* Should update rows when data input changes.
* Should update visible rows when expanded keys input changes.
* Should update visible rows when getChildren input changes.
* Should update row keys when getKey input changes.
* Should preserve controlled expanded state from input.
* Should not mutate input expanded keys array.
* Should not mutate input selected keys array.

⸻

Implementation constraints

* Use Angular standalone component style.
* Use signal inputs and outputs.
* Avoid any; prefer generics and proper typing.
* Keep primitive utilities pure and testable.
* Avoid adding tree-table complexity into tng-table.
* Avoid adding table rendering into tng-tree.
* Reuse existing TailNG utilities where appropriate.
* Follow existing project linting and formatting.
* Add exports to public APIs.
* Add tests before considering the task complete.

⸻

Expected outcome

After implementation, users should be able to use:

<tng-tree-table
  [data]="rows"
  [columns]="columns"
  [getKey]="getKey"
  [getChildren]="getChildren"
  [expandedKeys]="expandedKeys"
  (expandedKeysChange)="expandedKeys = $event"
/>

The component should render a clean, accessible treegrid table with expandable/collapsible hierarchical rows.