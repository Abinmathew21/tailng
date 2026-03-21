export type TngGridNavigationDirection = 'ltr' | 'rtl';

export type TngGridNavigationActionType =
  | 'activate'
  | 'exit'
  | 'move-down'
  | 'move-grid-end'
  | 'move-grid-start'
  | 'move-left'
  | 'move-right'
  | 'move-row-end'
  | 'move-row-start'
  | 'move-up';

export type TngGridNavigationAction = Readonly<{
  preventDefault: boolean;
  type: TngGridNavigationActionType;
}>;

export type TngGridNavigationKeyboardEvent = Readonly<{
  altKey?: boolean;
  ctrlKey?: boolean;
  key: string;
  metaKey?: boolean;
}>;

export type TngGridNavigationOptions = Readonly<{
  direction?: TngGridNavigationDirection;
}>;

export type TngGridCellPosition = Readonly<{
  col: number;
  row: number;
}>;

export type TngGridBounds = Readonly<{
  colCount: number;
  rowCount: number;
}>;

export type TngGridNavigableCell = Readonly<
  TngGridCellPosition & {
    disabled?: boolean;
  }
>;

export type TngGridCellResolutionOptions = Readonly<{
  bounds: TngGridBounds;
  cells: readonly TngGridNavigableCell[];
  wrap?: boolean;
}>;
