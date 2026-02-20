export type TngSelectionMode = 'multiple' | 'single';

export type TngSelectionModelOptions<TValue> = Readonly<{
  initialSelected?: readonly TValue[];
  mode?: TngSelectionMode;
}>;

export type TngSelectionModel<TValue> = Readonly<{
  clear: () => void;
  deselect: (value: TValue) => void;
  getSelected: () => readonly TValue[];
  isSelected: (value: TValue) => boolean;
  select: (value: TValue) => void;
  toggle: (value: TValue) => void;
}>;
