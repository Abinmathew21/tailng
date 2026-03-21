import {
  type TngGridBounds,
  type TngGridCellResolutionOptions,
  type TngGridCellPosition,
  type TngGridNavigableCell,
  type TngGridNavigationAction,
  type TngGridNavigationActionType,
  type TngGridNavigationKeyboardEvent,
  type TngGridNavigationOptions,
} from './grid-navigation.types';

type TngGridMovementActionType = Exclude<TngGridNavigationActionType, 'activate' | 'exit'>;

type TngGridMoveBounds = Readonly<{
  maxCol: number;
  maxRow: number;
}>;

function createAction(
  type: TngGridNavigationActionType,
  preventDefault: boolean,
): TngGridNavigationAction {
  return Object.freeze({ preventDefault, type });
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

function hasDisallowedModifiers(event: TngGridNavigationKeyboardEvent): boolean {
  if (event.altKey === true || event.metaKey === true) {
    return true;
  }

  if (event.ctrlKey === true && event.key !== 'Home' && event.key !== 'End') {
    return true;
  }

  return false;
}

function resolveHorizontalAction(
  key: string,
  direction: 'ltr' | 'rtl',
): TngGridNavigationActionType | null {
  if (key === 'ArrowLeft') {
    return direction === 'rtl' ? 'move-right' : 'move-left';
  }

  if (key === 'ArrowRight') {
    return direction === 'rtl' ? 'move-left' : 'move-right';
  }

  return null;
}

function resolveVerticalOrExitAction(key: string): TngGridNavigationActionType | null {
  if (key === 'Tab') {
    return 'exit';
  }

  if (key === 'ArrowUp') {
    return 'move-up';
  }

  if (key === 'ArrowDown') {
    return 'move-down';
  }

  return null;
}

function resolveHomeEndActionType(
  key: string,
  withCtrl: boolean,
): TngGridNavigationActionType | null {
  if (key === 'Home') {
    return withCtrl ? 'move-grid-start' : 'move-row-start';
  }

  if (key === 'End') {
    return withCtrl ? 'move-grid-end' : 'move-row-end';
  }

  return null;
}

function resolveActivateAction(key: string): TngGridNavigationActionType | null {
  if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
    return 'activate';
  }

  return null;
}

function resolveGridActionType(
  event: TngGridNavigationKeyboardEvent,
  direction: 'ltr' | 'rtl',
): TngGridNavigationActionType | null {
  return (
    resolveVerticalOrExitAction(event.key) ??
    resolveHorizontalAction(event.key, direction) ??
    resolveHomeEndActionType(event.key, event.ctrlKey === true) ??
    resolveActivateAction(event.key)
  );
}

export function resolveGridNavigationKeyAction(
  event: TngGridNavigationKeyboardEvent,
  options: TngGridNavigationOptions = {},
): TngGridNavigationAction | null {
  if (hasDisallowedModifiers(event)) {
    return null;
  }

  const actionType = resolveGridActionType(event, options.direction ?? 'ltr');
  if (actionType === null) {
    return null;
  }

  return createAction(actionType, actionType !== 'exit');
}

function sanitizeBounds(bounds: TngGridBounds): TngGridBounds {
  return {
    colCount: Math.max(1, bounds.colCount),
    rowCount: Math.max(1, bounds.rowCount),
  };
}

function toMoveBounds(bounds: TngGridBounds): TngGridMoveBounds {
  return Object.freeze({
    maxCol: bounds.colCount - 1,
    maxRow: bounds.rowCount - 1,
  });
}

function sanitizePosition(
  position: TngGridCellPosition,
  bounds: TngGridMoveBounds,
): TngGridCellPosition {
  return {
    col: clamp(position.col, 0, bounds.maxCol),
    row: clamp(position.row, 0, bounds.maxRow),
  };
}

const movementActionHandlers = Object.freeze({
  'move-down': (position: TngGridCellPosition, bounds: TngGridMoveBounds): TngGridCellPosition => {
    return { ...position, row: clamp(position.row + 1, 0, bounds.maxRow) };
  },
  'move-grid-end': (_position: TngGridCellPosition, bounds: TngGridMoveBounds): TngGridCellPosition => {
    return { col: bounds.maxCol, row: bounds.maxRow };
  },
  'move-grid-start': (): TngGridCellPosition => {
    return { col: 0, row: 0 };
  },
  'move-left': (position: TngGridCellPosition, bounds: TngGridMoveBounds): TngGridCellPosition => {
    return { ...position, col: clamp(position.col - 1, 0, bounds.maxCol) };
  },
  'move-right': (position: TngGridCellPosition, bounds: TngGridMoveBounds): TngGridCellPosition => {
    return { ...position, col: clamp(position.col + 1, 0, bounds.maxCol) };
  },
  'move-row-end': (position: TngGridCellPosition, bounds: TngGridMoveBounds): TngGridCellPosition => {
    return { ...position, col: bounds.maxCol };
  },
  'move-row-start': (position: TngGridCellPosition): TngGridCellPosition => {
    return { ...position, col: 0 };
  },
  'move-up': (position: TngGridCellPosition, bounds: TngGridMoveBounds): TngGridCellPosition => {
    return { ...position, row: clamp(position.row - 1, 0, bounds.maxRow) };
  },
}) satisfies Readonly<
  Record<
    TngGridMovementActionType,
    (position: TngGridCellPosition, bounds: TngGridMoveBounds) => TngGridCellPosition
  >
>;

function isMovementActionType(actionType: TngGridNavigationActionType): actionType is TngGridMovementActionType {
  return actionType !== 'activate' && actionType !== 'exit';
}

function compareGridCellPosition(a: TngGridCellPosition, b: TngGridCellPosition): number {
  if (a.row !== b.row) {
    return a.row - b.row;
  }

  return a.col - b.col;
}

function createCellKey(position: TngGridCellPosition): string {
  return `${position.row}:${position.col}`;
}

function sanitizeNavigableCells(
  cells: readonly TngGridNavigableCell[],
  bounds: TngGridMoveBounds,
): readonly TngGridCellPosition[] {
  const normalized: TngGridCellPosition[] = [];
  const seenKeys = new Set<string>();

  for (const cell of cells) {
    if (cell.disabled === true) {
      continue;
    }

    const position = sanitizePosition(cell, bounds);
    const key = createCellKey(position);
    if (seenKeys.has(key)) {
      continue;
    }

    seenKeys.add(key);
    normalized.push(position);
  }

  return normalized.sort(compareGridCellPosition);
}

function groupCellsByAxis(
  cells: readonly TngGridCellPosition[],
  axis: 'col' | 'row',
): ReadonlyMap<number, readonly TngGridCellPosition[]> {
  const grouped = new Map<number, TngGridCellPosition[]>();

  for (const cell of cells) {
    const key = axis === 'row' ? cell.row : cell.col;
    const bucket = grouped.get(key) ?? [];
    bucket.push(cell);
    grouped.set(key, bucket);
  }

  for (const [key, bucket] of grouped.entries()) {
    const sorted = [...bucket].sort(compareGridCellPosition);
    grouped.set(key, sorted);
  }

  return grouped;
}

function findNextCellInRow(
  cellsInRow: readonly TngGridCellPosition[],
  col: number,
  delta: -1 | 1,
  wrap: boolean,
): TngGridCellPosition | null {
  const candidates = delta > 0
    ? cellsInRow.filter((cell) => cell.col > col)
    : [...cellsInRow].reverse().filter((cell) => cell.col < col);

  if (candidates.length > 0) {
    return candidates[0] ?? null;
  }

  if (!wrap || cellsInRow.length === 0) {
    return null;
  }

  return delta > 0 ? (cellsInRow[0] ?? null) : (cellsInRow[cellsInRow.length - 1] ?? null);
}

function findNextCellInColumn(
  cellsInColumn: readonly TngGridCellPosition[],
  row: number,
  delta: -1 | 1,
  wrap: boolean,
): TngGridCellPosition | null {
  const sorted = [...cellsInColumn].sort(compareGridCellPosition);
  const candidates = delta > 0
    ? sorted.filter((cell) => cell.row > row)
    : [...sorted].reverse().filter((cell) => cell.row < row);

  if (candidates.length > 0) {
    return candidates[0] ?? null;
  }

  if (!wrap || sorted.length === 0) {
    return null;
  }

  return delta > 0 ? (sorted[0] ?? null) : (sorted[sorted.length - 1] ?? null);
}

function findRowBoundaryCell(
  cellsInRow: readonly TngGridCellPosition[] | undefined,
  boundary: 'start' | 'end',
): TngGridCellPosition | null {
  if (cellsInRow === undefined || cellsInRow.length === 0) {
    return null;
  }

  return boundary === 'start'
    ? (cellsInRow[0] ?? null)
    : (cellsInRow[cellsInRow.length - 1] ?? null);
}

export function moveGridCell(
  position: TngGridCellPosition,
  actionType: TngGridNavigationActionType,
  boundsInput: TngGridBounds,
): TngGridCellPosition {
  const bounds = toMoveBounds(sanitizeBounds(boundsInput));
  const start = sanitizePosition(position, bounds);
  if (!isMovementActionType(actionType)) {
    return start;
  }

  return movementActionHandlers[actionType](start, bounds);
}

export function resolveNavigableGridCell(
  position: TngGridCellPosition,
  actionType: TngGridNavigationActionType,
  options: TngGridCellResolutionOptions,
): TngGridCellPosition | null {
  const bounds = toMoveBounds(sanitizeBounds(options.bounds));
  const start = sanitizePosition(position, bounds);
  const enabledCells = sanitizeNavigableCells(options.cells, bounds);
  if (enabledCells.length === 0) {
    return null;
  }

  if (!isMovementActionType(actionType)) {
    return enabledCells.find((cell) => cell.row === start.row && cell.col === start.col) ?? start;
  }

  const cellsByRow = groupCellsByAxis(enabledCells, 'row');
  const cellsByColumn = groupCellsByAxis(enabledCells, 'col');
  const wrap = options.wrap ?? false;

  switch (actionType) {
    case 'move-left':
      return (
        findNextCellInRow(cellsByRow.get(start.row) ?? [], start.col, -1, wrap)
        ?? enabledCells.find((cell) => cell.row === start.row && cell.col === start.col)
        ?? start
      );
    case 'move-right':
      return (
        findNextCellInRow(cellsByRow.get(start.row) ?? [], start.col, 1, wrap)
        ?? enabledCells.find((cell) => cell.row === start.row && cell.col === start.col)
        ?? start
      );
    case 'move-up':
      return (
        findNextCellInColumn(cellsByColumn.get(start.col) ?? [], start.row, -1, wrap)
        ?? enabledCells.find((cell) => cell.row === start.row && cell.col === start.col)
        ?? start
      );
    case 'move-down':
      return (
        findNextCellInColumn(cellsByColumn.get(start.col) ?? [], start.row, 1, wrap)
        ?? enabledCells.find((cell) => cell.row === start.row && cell.col === start.col)
        ?? start
      );
    case 'move-row-start':
      return findRowBoundaryCell(cellsByRow.get(start.row), 'start')
        ?? enabledCells.find((cell) => cell.row === start.row && cell.col === start.col)
        ?? start;
    case 'move-row-end':
      return findRowBoundaryCell(cellsByRow.get(start.row), 'end')
        ?? enabledCells.find((cell) => cell.row === start.row && cell.col === start.col)
        ?? start;
    case 'move-grid-start':
      return enabledCells[0] ?? null;
    case 'move-grid-end':
      return enabledCells[enabledCells.length - 1] ?? null;
    default:
      return enabledCells.find((cell) => cell.row === start.row && cell.col === start.col) ?? start;
  }
}
