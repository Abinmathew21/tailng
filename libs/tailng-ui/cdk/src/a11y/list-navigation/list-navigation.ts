import {
  type TngListNavigationAction,
  type TngListNavigationActionType,
  type TngListNavigationActionResolver,
  type TngListNavigationKeyboardEvent,
  type TngListNavigationOptions,
  type TngListNavigationBehavior,
} from './list-navigation.types';

const horizontalKeys = Object.freeze(['ArrowLeft', 'ArrowRight']);
const verticalKeys = Object.freeze(['ArrowDown', 'ArrowUp']);

type TngResolvedOptions = Readonly<{
  direction: 'ltr' | 'rtl';
  multiSelect: boolean;
  orientation: 'both' | 'horizontal' | 'vertical';
  behavior: TngListNavigationBehavior;
}>;

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
  if (key === 'ArrowDown') return 'move-next';
  if (key === 'ArrowUp') return 'move-prev';
  return resolveMoveActionForHorizontalKey(key, direction);
}

function hasDisallowedModifiers(event: TngListNavigationKeyboardEvent): boolean {
  const isA = event.key === 'a' || event.key === 'A';

  // alt should always bail (you can keep this strict)
  if (event.altKey === true) return true;

  // allow ⌘A, disallow other ⌘ combos
  if (event.metaKey === true && !isA) return true;

  // allow Ctrl+A, disallow other Ctrl combos
  if (event.ctrlKey === true && !isA) return true;

  return false;
}

function resolveSpaceAction(multiSelect: boolean): TngListNavigationAction {
  return multiSelect
    ? createAction('toggle-active', true)
    : createAction('select-active', true);
}

function normalizeOptions(options: TngListNavigationOptions): TngResolvedOptions {
  return {
    direction: options.direction ?? 'ltr',
    multiSelect: options.multiSelect ?? false,
    orientation: options.orientation ?? 'vertical',
    behavior: options.behavior ?? 'listbox',
  };
}

/**
 * Default resolvers (public extension point).
 * You can reuse, prepend, append, or replace these in consumers.
 */
export const defaultListNavigationResolvers: readonly TngListNavigationActionResolver[] =
  Object.freeze([
    resolveTabAction,
    resolveSelectAllAction,
    resolveBoundaryAction,
    resolveArrowAction,
    resolveActivationAction,
  ]);

function resolveTabAction(
  event: TngListNavigationKeyboardEvent,
): TngListNavigationAction | null {
  if (event.key === 'Tab') {
    return createAction('exit', false);
  }
  return null;
}

function resolveSelectAllAction(
  event: TngListNavigationKeyboardEvent,
  options: TngResolvedOptions,
): TngListNavigationAction | null {
  if (!options.multiSelect) return null;

  const isA = event.key === 'a' || event.key === 'A';
  if (
    isA &&
    (event.ctrlKey === true || event.metaKey === true) &&
    !event.altKey &&
    !event.shiftKey
  ) {
    return createAction('select-all', true);
  }

  return null;
}

function resolveBoundaryAction(
  event: TngListNavigationKeyboardEvent,
  options: TngResolvedOptions,
): TngListNavigationAction | null {
  const extendSelection = options.multiSelect && event.shiftKey === true;

  if (event.key === 'Home') return createAction('move-first', true, extendSelection);
  if (event.key === 'End') return createAction('move-last', true, extendSelection);

  return null;
}

function resolveArrowAction(
  event: TngListNavigationKeyboardEvent,
  options: TngResolvedOptions,
): TngListNavigationAction | null {
  if (!canHandleArrowKey(event.key, options.orientation)) return null;

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
  // Currently identical across behaviors.
  // Future: behavior-specific Enter/Space semantics can be introduced here
  // without affecting callers (because behavior defaults to 'listbox').

  if (event.key === ' ' || event.key === 'Spacebar') {
    return resolveSpaceAction(options.multiSelect);
  }

  if (event.key === 'Enter') {
    return createAction('select-active', true);
  }

  return null;
}

function resolveKeyAction(
  event: TngListNavigationKeyboardEvent,
  options: TngResolvedOptions,
  resolvers: readonly TngListNavigationActionResolver[],
): TngListNavigationAction | null {
  for (const resolver of resolvers) {
    const action = resolver(event, options);
    if (action !== null) return action;
  }
  return null;
}

/**
 * Backward-compatible:
 * - existing calls: resolveListNavigationKeyAction(event, options?)
 * - new calls: resolveListNavigationKeyAction(event, options?, resolvers?)
 */
export function resolveListNavigationKeyAction(
  event: TngListNavigationKeyboardEvent,
  options: TngListNavigationOptions = {},
  resolvers: readonly TngListNavigationActionResolver[] = defaultListNavigationResolvers,
): TngListNavigationAction | null {
  const normalizedOptions = normalizeOptions(options);

  if (hasDisallowedModifiers(event)) {
    return null;
  }

  return resolveKeyAction(event, normalizedOptions, resolvers);
}