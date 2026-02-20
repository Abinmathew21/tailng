import {
  type TngSelectionMode,
  type TngSelectionModel,
  type TngSelectionModelOptions,
} from './selection-model.types';

function toSelectionMode(value: TngSelectionMode | undefined): TngSelectionMode {
  return value ?? 'single';
}

export function createSelectionModel<TValue>(
  options: TngSelectionModelOptions<TValue> = {},
): TngSelectionModel<TValue> {
  const mode = toSelectionMode(options.mode);
  const selectedSet = new Set(options.initialSelected ?? []);

  const clear = (): void => {
    selectedSet.clear();
  };

  const deselect = (value: TValue): void => {
    selectedSet.delete(value);
  };

  const getSelected = (): readonly TValue[] => [...selectedSet.values()];

  const isSelected = (value: TValue): boolean => selectedSet.has(value);

  const select = (value: TValue): void => {
    if (mode === 'single') {
      selectedSet.clear();
    }

    selectedSet.add(value);
  };

  const toggle = (value: TValue): void => {
    if (selectedSet.has(value)) {
      selectedSet.delete(value);
      return;
    }

    select(value);
  };

  return Object.freeze({ clear, deselect, getSelected, isSelected, select, toggle });
}
