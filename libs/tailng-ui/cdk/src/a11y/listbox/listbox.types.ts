import type {
  TngListNavigationAction,
  TngListNavigationDirection,
  TngListNavigationOrientation,
  TngListNavigationKeyboardEvent,
} from '../list-navigation/list-navigation.types';

export type TngListboxSelectionMode = 'single' | 'multiple';

export type TngListboxFocusStrategyType = 'active-descendant' | 'roving';

export type TngDomAttributes = Readonly<Record<string, string | number | boolean | null | undefined>>;

/**
 * Option registered with the Listbox controller.
 * `id` must be stable and unique within the listbox instance.
 */
export type TngListboxOption<TValue> = Readonly<{
  id: string;
  value: TValue;
  disabled?: boolean;
}>;

export type TngListboxConfig<TValue> = Readonly<{
  /**
   * Defaults to 'single'.
   */
  selectionMode?: TngListboxSelectionMode;

  /**
   * Passed through to list-navigation.
   * Defaults to 'vertical'.
   */
  orientation?: Exclude<TngListNavigationOrientation, 'both'>;

  /**
   * Passed through to list-navigation.
   * Defaults to 'ltr'.
   */
  direction?: TngListNavigationDirection;

  /**
   * Wrap active navigation at ends.
   * Defaults to true.
   */
  wrap?: boolean;

  /**
   * If true, arrow navigation with shiftKey (extendSelection) will select range.
   * Defaults to true for multi, false for single (computed).
   */
  enableRangeSelection?: boolean;

  /**
   * Focus strategy used by the pattern. Defaults to 'active-descendant'.
   * Listbox itself does not implement DOM focus; it exposes ARIA attributes.
   */
  focusStrategy?: TngListboxFocusStrategyType;

  /**
   * Optional id for the listbox host (useful for scoping option ids).
   */
  id?: string;

  /**
   * Disable interactions.
   */
  disabled?: boolean;
}>;

export type TngListboxState = Readonly<{
  disabled: boolean;
  activeId: string | null;
  orderedIds: readonly string[];
  disabledIds: ReadonlySet<string>;
}>;

export type TngListboxAction =
  | Readonly<{ type: 'register-option'; option: { id: string; disabled: boolean } }>
  | Readonly<{ type: 'unregister-option'; id: string }>
  | Readonly<{ type: 'set-disabled'; disabled: boolean }>
  | Readonly<{ type: 'set-active'; id: string | null }>
  | Readonly<{ type: 'nav'; action: TngListNavigationAction; event: TngListNavigationKeyboardEvent }>
  | Readonly<{ type: 'click-option'; id: string; extendSelection: boolean }>;

export type TngListboxOutputs<TValue> = Readonly<{
  /**
   * Selected values (in insertion order of selection model).
   */
  selectedValues: readonly TValue[];
  /**
   * Selected option ids (in insertion order of selection model).
   */
  selectedIds: readonly string[];
  activeId: string | null;
}>;

/**
 * Focus strategy adapter. Your existing active-descendant / roving-focus controllers
 * can be adapted to this interface.
 */
export type TngListboxFocusAdapter = Readonly<{
  /**
   * Returns host attributes related to focus strategy (e.g. tabindex, aria-activedescendant).
   */
  getHostAttributes(params: { activeId: string | null; disabled: boolean }): TngDomAttributes;

  /**
   * Returns option attributes related to focus strategy (e.g. tabindex for roving).
   */
  getOptionAttributes(params: { id: string; isActive: boolean; disabled: boolean }): TngDomAttributes;
}>;

export type TngListboxController<TValue> = Readonly<{
  getState(): TngListboxState;
  getOutputs(): TngListboxOutputs<TValue>;

  registerOption(option: TngListboxOption<TValue>): void;
  unregisterOption(id: string): void;

  handleKeyDown(event: TngListNavigationKeyboardEvent): TngListNavigationAction | null;
  handleClick(id: string, event?: Pick<TngListNavigationKeyboardEvent, 'shiftKey'>): void;

  getHostAttributes(): TngDomAttributes;
  getOptionAttributes(id: string): TngDomAttributes;
}>;
