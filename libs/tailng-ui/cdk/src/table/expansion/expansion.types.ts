export type TngTableRowExpansionMode = 'multiple' | 'single';

export type TngTableRowExpansionState<TId> = Readonly<{
  expandedIds: readonly TId[];
  mode: TngTableRowExpansionMode;
}>;

export type TngTableRowExpansionOptions<TId> = Readonly<{
  initialExpandedIds?: readonly TId[];
  mode?: TngTableRowExpansionMode;
}>;

export type TngTableRowExpansionController<TId> = Readonly<{
  clear: () => TngTableRowExpansionState<TId>;
  collapse: (id: TId) => TngTableRowExpansionState<TId>;
  expand: (id: TId) => TngTableRowExpansionState<TId>;
  getState: () => TngTableRowExpansionState<TId>;
  isExpanded: (id: TId) => boolean;
  toggle: (id: TId) => TngTableRowExpansionState<TId>;
}>;
