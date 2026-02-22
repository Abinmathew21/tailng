export type TngSelectionMode = 'multiple' | 'single';

export type TngSelectionRangeMode = 'replace' | 'add' | 'extend' | 'merge';

export type TngSelectionRangeOptions<TValue> = Readonly<{
  orderedValues: readonly TValue[];
  rangeMode?: TngSelectionRangeMode;
}>;

export type TngSelectionModelOptions<TValue> = Readonly<{
  initialAnchor?: TValue | null;
  initialSelected?: readonly TValue[];
  mode?: TngSelectionMode;
}>;

export type TngSelectionModel<TValue> = Readonly<{
  clear: () => void;
  deselect: (value: TValue) => void;
  getAnchor: () => TValue | null;
  getSelected: () => readonly TValue[];
  isSelected: (value: TValue) => boolean;
  selectRange: (
    from: TValue,
    to: TValue,
    options: TngSelectionRangeOptions<TValue>,
  ) => readonly TValue[];
  select: (value: TValue) => void;
  setAnchor: (value: TValue | null) => void;
  toggle: (value: TValue) => void;
}>;
