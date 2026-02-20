import {
  type TngGridBounds,
  type TngGridCellPosition,
  type TngGridNavigationAction,
  type TngGridNavigationActionType,
  type TngGridNavigationKeyboardEvent,
  type TngGridNavigationOptions,
} from './grid-navigation.types';

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
  event: TngGridNavigationKeyboardEvent,
  direction: 'ltr' | 'rtl',
): TngGridNavigationAction | null {
  if (event.key === 'ArrowLeft') {
    return createAction(direction === 'rtl' ? 'move-right' : 'move-left', true);
  }

  if (event.key === 'ArrowRight') {
    return createAction(direction === 'rtl' ? 'move-left' : 'move-right', true);
  }

  return null;
}

function resolveHomeEndAction(
  event: TngGridNavigationKeyboardEvent,
): TngGridNavigationAction | null {
  if (event.key === 'Home') {
    return createAction(event.ctrlKey === true ? 'move-grid-start' : 'move-row-start', true);
  }

  if (event.key === 'End') {
    return createAction(event.ctrlKey === true ? 'move-grid-end' : 'move-row-end', true);
  }

  return null;
}

export function resolveGridNavigationKeyAction(
  event: TngGridNavigationKeyboardEvent,
  options: TngGridNavigationOptions = {},
): TngGridNavigationAction | null {
  if (hasDisallowedModifiers(event)) {
    return null;
  }

  const direction = options.direction ?? 'ltr';

  if (event.key === 'Tab') {
    return createAction('exit', false);
  }

  if (event.key === 'ArrowUp') {
    return createAction('move-up', true);
  }

  if (event.key === 'ArrowDown') {
    return createAction('move-down', true);
  }

  const horizontalAction = resolveHorizontalAction(event, direction);
  if (horizontalAction !== null) {
    return horizontalAction;
  }

  const homeEndAction = resolveHomeEndAction(event);
  if (homeEndAction !== null) {
    return homeEndAction;
  }

  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
    return createAction('activate', true);
  }

  return null;
}

function sanitizeBounds(bounds: TngGridBounds): TngGridBounds {
  return {
    colCount: Math.max(1, bounds.colCount),
    rowCount: Math.max(1, bounds.rowCount),
  };
}

export function moveGridCell(
  position: TngGridCellPosition,
  actionType: TngGridNavigationActionType,
  boundsInput: TngGridBounds,
): TngGridCellPosition {
  const bounds = sanitizeBounds(boundsInput);
  const maxCol = bounds.colCount - 1;
  const maxRow = bounds.rowCount - 1;
  const start: TngGridCellPosition = {
    col: clamp(position.col, 0, maxCol),
    row: clamp(position.row, 0, maxRow),
  };

  switch (actionType) {
    case 'move-up':
      return { ...start, row: clamp(start.row - 1, 0, maxRow) };
    case 'move-down':
      return { ...start, row: clamp(start.row + 1, 0, maxRow) };
    case 'move-left':
      return { ...start, col: clamp(start.col - 1, 0, maxCol) };
    case 'move-right':
      return { ...start, col: clamp(start.col + 1, 0, maxCol) };
    case 'move-row-start':
      return { ...start, col: 0 };
    case 'move-row-end':
      return { ...start, col: maxCol };
    case 'move-grid-start':
      return { col: 0, row: 0 };
    case 'move-grid-end':
      return { col: maxCol, row: maxRow };
    default:
      return start;
  }
}
