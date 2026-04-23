export type TngTableSelectionMode = 'multiple' | 'single';

export type TngTableRowSelectionState<TId> = Readonly<{
  anchorId: TId | null;
  mode: TngTableSelectionMode;
  selectedIds: readonly TId[];
}>;

export type TngTableRowSelectionOptions<TId> = Readonly<{
  disabledIds?: readonly TId[];
  initialAnchorId?: TId | null;
  initialSelectedIds?: readonly TId[];
  mode?: TngTableSelectionMode;
}>;

export type TngTableRowSelectionController<TId> = Readonly<{
  clear: () => TngTableRowSelectionState<TId>;
  deselect: (id: TId) => TngTableRowSelectionState<TId>;
  getState: () => TngTableRowSelectionState<TId>;
  isDisabled: (id: TId) => boolean;
  isSelected: (id: TId) => boolean;
  replace: (id: TId) => TngTableRowSelectionState<TId>;
  select: (id: TId) => TngTableRowSelectionState<TId>;
  selectAll: (ids: readonly TId[]) => TngTableRowSelectionState<TId>;
  selectRange: (
    from: TId,
    to: TId,
    orderedIds: readonly TId[],
  ) => TngTableRowSelectionState<TId>;
  toggle: (id: TId) => TngTableRowSelectionState<TId>;
}>;
