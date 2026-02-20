export type TngRovingOrientation = 'both' | 'horizontal' | 'vertical';

export type TngRovingFocusOptions = Readonly<{
  disabledIds?: readonly string[];
  initialActiveId?: string | null;
  itemIds: readonly string[];
  loop?: boolean;
  orientation?: TngRovingOrientation;
}>;

export type TngRovingFocusController = Readonly<{
  clear: () => void;
  end: () => string | null;
  getActiveId: () => string | null;
  home: () => string | null;
  moveNext: () => string | null;
  movePrev: () => string | null;
  setActiveId: (id: string | null) => string | null;
  setDisabledIds: (ids: readonly string[]) => void;
  setItemIds: (ids: readonly string[]) => void;
}>;
