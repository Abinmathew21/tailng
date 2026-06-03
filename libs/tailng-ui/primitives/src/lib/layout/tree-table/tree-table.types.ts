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

export interface TngTreeTableFlattenOptions<TRow> {
  data: readonly TRow[];
  expandedKeys: ReadonlySet<TngTreeTableKey>;
  selectedKeys?: ReadonlySet<TngTreeTableKey>;
  getKey: (row: TRow, indexPath: readonly number[]) => TngTreeTableKey;
  getChildren: (row: TRow) => readonly TRow[] | null | undefined;
  isDisabled?: (row: TRow) => boolean;
}

export interface TngTreeTableRowEvent<TRow> {
  row: TRow;
  key: TngTreeTableKey;
  level: number;
  originalEvent: Event;
}

export type TngTreeTableKeydownIntent =
  | 'expand'
  | 'collapse'
  | 'toggle'
  | 'select'
  | 'focusFirst'
  | 'focusLast'
  | null;

export interface TngTreeTableKeydownContext {
  expandable: boolean;
  expanded: boolean;
  selectable: boolean;
}
