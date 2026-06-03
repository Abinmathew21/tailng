/** Class values accepted by the styling hooks — mirrors TngTableClassInput. */
export type TngTreeTableClassInput =
  | string
  | readonly string[]
  | Record<string, boolean>
  | null
  | undefined;

/** Inline-style values accepted by the styling hooks — mirrors TngTableStyleInput. */
export type TngTreeTableStyleInput =
  | Readonly<Record<string, string | number | null | undefined>>
  | null
  | undefined;

export type TngTreeTableCellAlign = 'start' | 'center' | 'end';

// ── Leaf column ───────────────────────────────────────────────────────────────

/**
 * A visible leaf column that renders data cells and (optionally) the tree
 * toggle. Only leaf columns participate in the table body.
 */
export type TngTreeTableLeafColumn<TRow = unknown> = Readonly<{
  /** Unique column id — also used as a fallback property accessor on TRow. */
  key: string;
  /** Header label text. Falls back to `key` when omitted. */
  label?: string;
  /**
   * Data accessor — either a key of TRow or a function `(row, index) => value`.
   * Falls back to `row[column.key]` when omitted.
   */
  accessor?: keyof TRow | ((row: TRow, index: number) => unknown);
  /** Cell content alignment. */
  align?: TngTreeTableCellAlign;
  /** Fixed column width (CSS value or number → px). */
  width?: string | number | null;
  minWidth?: string | number | null;
  maxWidth?: string | number | null;
  sortable?: boolean;
  sticky?: 'start' | 'end' | null;
  /**
   * When true this column renders the indent spacer, expand/collapse button,
   * and tree cell content for each hierarchical row.
   */
  treeToggle?: boolean;
  /** Hide this column without removing it from the column definition. */
  hidden?: boolean;
  /** Static or dynamic extra classes for the header cell. */
  headerClass?: TngTreeTableClassInput;
  /** Inline styles for the header cell. */
  headerStyle?: TngTreeTableStyleInput;
  /**
   * Extra classes for body cells — static value or a per-row function
   * `(row) => ClassInput`.
   */
  cellClass?: TngTreeTableClassInput | ((row: TRow) => TngTreeTableClassInput);
  /**
   * Inline styles for body cells — static value or a per-row function
   * `(row) => StyleInput`.
   */
  cellStyle?: TngTreeTableStyleInput | ((row: TRow) => TngTreeTableStyleInput);
  /** Discriminant: leaf columns never carry children. */
  children?: never;
}>;

// ── Group column ──────────────────────────────────────────────────────────────

/**
 * A group column that renders only a header cell (with colspan) spanning its
 * child columns. It does not produce body cells.
 */
export type TngTreeTableGroupColumn<TRow = unknown> = Readonly<{
  /** Unique column id. */
  key: string;
  /** Header label text. Falls back to `key` when omitted. */
  label?: string;
  /** Hide this column (and its entire subtree) without removing it. */
  hidden?: boolean;
  /** Static or dynamic extra classes for the group header cell. */
  headerClass?: TngTreeTableClassInput;
  /** Inline styles for the group header cell. */
  headerStyle?: TngTreeTableStyleInput;
  /** Child columns — at least one child is required for this to be a group. */
  children: readonly TngTreeTableColumn<TRow>[];
}>;

// ── Union ─────────────────────────────────────────────────────────────────────

export type TngTreeTableColumn<TRow = unknown> =
  | TngTreeTableLeafColumn<TRow>
  | TngTreeTableGroupColumn<TRow>;

// ── Slot type ─────────────────────────────────────────────────────────────────

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

// ── Type guard ────────────────────────────────────────────────────────────────

/**
 * Returns true when `column` is a group column (has a non-empty `children`
 * array). Empty-children arrays are treated as leaves — consistent with tng-table.
 */
export function isTreeTableGroupColumn<TRow>(
  column: TngTreeTableColumn<TRow>,
): column is TngTreeTableGroupColumn<TRow> {
  return (
    'children' in column &&
    Array.isArray((column as TngTreeTableGroupColumn<TRow>).children) &&
    (column as TngTreeTableGroupColumn<TRow>).children.length > 0
  );
}

// ── Normalizers ───────────────────────────────────────────────────────────────

/** Flattens any TngTreeTableClassInput to a single space-separated class string. */
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

/** Normalizes a CSS length (string or number) to a px-suffixed string or null. */
export function normalizeTngTreeTableCssLength(
  value: string | number | null | undefined,
): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}px`;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
