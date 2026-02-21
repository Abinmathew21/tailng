import {
  type TngListNavigationAction,
  type TngListNavigationActionType,
  type TngListNavigationKeyboardEvent,
  type TngListNavigationOptions,
} from './list-navigation.types';

const horizontalKeys = Object.freeze(['ArrowLeft', 'ArrowRight']);
const verticalKeys = Object.freeze(['ArrowDown', 'ArrowUp']);

type TngResolvedOptions = Readonly<{
  direction: 'ltr' | 'rtl';
  multiSelect: boolean;
  orientation: 'both' | 'horizontal' | 'vertical';
}>;

type TngActionResolver = (
  event: TngListNavigationKeyboardEvent,
  options: TngResolvedOptions,
) => TngListNavigationAction | null;

function createAction(
  type: TngListNavigationActionType,
  preventDefault: boolean,
  extendSelection = false,
): TngListNavigationAction {
  return Object.freeze({ extendSelection, preventDefault, type });
}

function resolveMoveActionForHorizontalKey(
  key: string,
  direction: 'ltr' | 'rtl',
): TngListNavigationActionType {
  if (key === 'ArrowRight') {
    return direction === 'rtl' ? 'move-prev' : 'move-next';
  }

  return direction === 'rtl' ? 'move-next' : 'move-prev';
}

function canHandleArrowKey(
  key: string,
  orientation: 'both' | 'horizontal' | 'vertical',
): boolean {
  if (orientation === 'both') {
    return horizontalKeys.includes(key) || verticalKeys.includes(key);
  }

  if (orientation === 'horizontal') {
    return horizontalKeys.includes(key);
  }

  return verticalKeys.includes(key);
}

function resolveArrowActionType(
  key: string,
  direction: 'ltr' | 'rtl',
): TngListNavigationActionType {
  if (key === 'ArrowDown') {
    return 'move-next';
  }

  if (key === 'ArrowUp') {
    return 'move-prev';
  }

  return resolveMoveActionForHorizontalKey(key, direction);
}

function hasDisallowedModifiers(event: TngListNavigationKeyboardEvent): boolean {
  if (event.altKey === true || event.metaKey === true) {
    return true;
  }

  if (event.ctrlKey === true && event.key !== 'a' && event.key !== 'A') {
    return true;
  }

  return false;
}

function resolveSpaceAction(
  multiSelect: boolean,
): TngListNavigationAction {
  return multiSelect
    ? createAction('toggle-active', true)
    : createAction('select-active', true);
}

function normalizeOptions(options: TngListNavigationOptions): TngResolvedOptions {
  return {
    direction: options.direction ?? 'ltr',
    multiSelect: options.multiSelect ?? false,
    orientation: options.orientation ?? 'vertical',
  };
}

function resolveTabAction(event: TngListNavigationKeyboardEvent): TngListNavigationAction | null {
  if (event.key === 'Tab') {
    return createAction('exit', false);
  }

  return null;
}

function resolveSelectAllAction(
  event: TngListNavigationKeyboardEvent,
  options: TngResolvedOptions,
): TngListNavigationAction | null {
  if (!options.multiSelect) {
    return null;
  }

  if (event.ctrlKey === true && (event.key === 'a' || event.key === 'A')) {
    return createAction('select-all', true);
  }

  return null;
}

function resolveBoundaryAction(
  event: TngListNavigationKeyboardEvent,
  options: TngResolvedOptions,
): TngListNavigationAction | null {
  const extendSelection = options.multiSelect && event.shiftKey === true;
  if (event.key === 'Home') {
    return createAction('move-first', true, extendSelection);
  }

  if (event.key === 'End') {
    return createAction('move-last', true, extendSelection);
  }

  return null;
}

function resolveArrowAction(
  event: TngListNavigationKeyboardEvent,
  options: TngResolvedOptions,
): TngListNavigationAction | null {
  if (!canHandleArrowKey(event.key, options.orientation)) {
    return null;
  }

  return createAction(
    resolveArrowActionType(event.key, options.direction),
    true,
    options.multiSelect && event.shiftKey === true,
  );
}

function resolveActivationAction(
  event: TngListNavigationKeyboardEvent,
  options: TngResolvedOptions,
): TngListNavigationAction | null {
  if (event.key === ' ' || event.key === 'Spacebar') {
    return resolveSpaceAction(options.multiSelect);
  }

  if (event.key === 'Enter') {
    return createAction('select-active', true);
  }

  return null;
}

const keyResolvers: readonly TngActionResolver[] = Object.freeze([
  resolveTabAction,
  resolveSelectAllAction,
  resolveBoundaryAction,
  resolveArrowAction,
  resolveActivationAction,
]);

function resolveKeyAction(
  event: TngListNavigationKeyboardEvent,
  options: TngResolvedOptions,
): TngListNavigationAction | null {
  for (const resolver of keyResolvers) {
    const action = resolver(event, options);
    if (action !== null) {
      return action;
    }
  }

  return null;
}

export function resolveListNavigationKeyAction(
  event: TngListNavigationKeyboardEvent,
  options: TngListNavigationOptions = {},
): TngListNavigationAction | null {
  const normalizedOptions = normalizeOptions(options);

  if (hasDisallowedModifiers(event)) {
    return null;
  }

  return resolveKeyAction(event, normalizedOptions);
}
