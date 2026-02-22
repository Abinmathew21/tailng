export type TngListNavigationOrientation = 'both' | 'horizontal' | 'vertical';

export type TngListNavigationDirection = 'ltr' | 'rtl';

/**
 * Pattern hint for future variations in key semantics.
 * (Default is 'listbox' when not provided.)
 */
export type TngListNavigationBehavior = 'listbox' | 'menu' | 'tabs';

export type TngListNavigationActionType =
  | 'exit'
  | 'move-first'
  | 'move-last'
  | 'move-next'
  | 'move-prev'
  | 'select-active'
  | 'select-all'
  | 'toggle-active';

export type TngListNavigationAction = Readonly<{
  extendSelection: boolean;
  preventDefault: boolean;
  type: TngListNavigationActionType;
}>;

/**
 * Keep this framework-agnostic (good).
 * Works with KeyboardEvent but also with mocked objects in tests.
 */
export type TngListNavigationKeyboardEvent = Readonly<{
  altKey?: boolean;
  ctrlKey?: boolean;
  key: string;
  metaKey?: boolean;
  shiftKey?: boolean;
}>;

export type TngListNavigationOptions = Readonly<{
  direction?: TngListNavigationDirection;
  multiSelect?: boolean;
  orientation?: TngListNavigationOrientation;

  /**
   * Optional behavior hint.
   * Additive: existing callers unaffected.
   */
  behavior?: TngListNavigationBehavior;
}>;

/**
 * Normalized options shape passed to resolvers.
 * Exported because it becomes part of the public extension API.
 */
export type TngResolvedListNavigationOptions = Readonly<{
  direction: TngListNavigationDirection;
  multiSelect: boolean;
  orientation: TngListNavigationOrientation;
  behavior: TngListNavigationBehavior;
}>;

/**
 * Public extension point: custom key resolvers.
 *
 * Contract:
 * - return null to let other resolvers try
 * - return an action to stop resolution
 */
export type TngListNavigationActionResolver = (
  event: TngListNavigationKeyboardEvent,
  options: TngResolvedListNavigationOptions,
) => TngListNavigationAction | null;