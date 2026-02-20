export type TngListNavigationOrientation = 'both' | 'horizontal' | 'vertical';

export type TngListNavigationDirection = 'ltr' | 'rtl';

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
}>;
