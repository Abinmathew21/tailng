import {
  type TngGridBounds,
  type TngGridCellPosition,
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
