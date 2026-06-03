/**
 * Class values accepted by the styling hooks.
 * Mirrors TngTableClassInput from tng-table.
 */
export type TngTreeTableClassInput =
  | string
  | readonly string[]
  | Record<string, boolean>
  | null
  | undefined;

export type TngTreeTableCellAlign = 'start' | 'center' | 'end';

export type TngTreeTableColumn<TRow = unknown> = Readonly<{
  /** Unique column id */
  key: string;
  /** Header label text */
  label: string;
  /**
   * Data accessor — either a key of TRow or a function `(row, index) => value`.
   * Falls back to `column.key` as a property name when omitted.
   */
  accessor?: keyof TRow | ((row: TRow, index: number) => unknown);
  /** Cell content alignment */
  align?: TngTreeTableCellAlign;
  /** Fixed column width (CSS value or number → px) */
  width?: string | number | null;
  minWidth?: string | number | null;
  maxWidth?: string | number | null;
  sortable?: boolean;
  sticky?: 'start' | 'end' | null;
  /**
   * When true, this column renders the indentation, expand/collapse toggle,
   * and tree content for hierarchical rows.
   */
  treeToggle?: boolean;
  headerClass?: TngTreeTableClassInput;
  cellClass?: TngTreeTableClassInput | ((row: TRow) => TngTreeTableClassInput);
}>;

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

/** Normalizes any TngTreeTableClassInput to a single class string. */
export function normalizeTngTreeTableClassValue(value: TngTreeTableClassInput): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return (value as readonly string[])
      .filter((t): t is string => typeof t === 'string')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .join(' ');
  }

  return Object.entries(value as Record<string, boolean>)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([t]) => t.trim())
    .filter((t) => t.length > 0)
    .join(' ');
}

/** Normalizes a CSS length number or string to a `px`-suffixed string or null. */
export function normalizeTngTreeTableCssLength(value: string | number | null | undefined): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}px`;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
