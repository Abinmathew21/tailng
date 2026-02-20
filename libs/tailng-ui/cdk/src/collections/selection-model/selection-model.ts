import {
  type TngSelectionMode,
  type TngSelectionModel,
  type TngSelectionModelOptions,
  type TngSelectionRangeOptions,
  type TngSelectionRangeMode,
} from './selection-model.types';

function toSelectionMode(value: TngSelectionMode | undefined): TngSelectionMode {
  return value ?? 'single';
}

function findRangeValues<TValue>(
  from: TValue,
  to: TValue,
  orderedValues: readonly TValue[],
): readonly TValue[] {
  const startIndex = orderedValues.indexOf(from);
  const endIndex = orderedValues.indexOf(to);
  if (startIndex < 0 || endIndex < 0) {
    return [];
  }

  const rangeStart = Math.min(startIndex, endIndex);
  const rangeEnd = Math.max(startIndex, endIndex);
  return orderedValues.slice(rangeStart, rangeEnd + 1);
}

class SelectionModel<TValue> implements TngSelectionModel<TValue> {
  private anchor: TValue | null;
  private readonly mode: TngSelectionMode;
  private readonly selectedSet: Set<TValue>;

  public constructor(options: TngSelectionModelOptions<TValue>) {
    this.mode = toSelectionMode(options.mode);
    this.selectedSet = new Set(options.initialSelected ?? []);
    this.anchor = options.initialAnchor ?? (options.initialSelected?.[0] ?? null);
  }

  public clear(): void {
    this.selectedSet.clear();
    this.anchor = null;
  }

  public deselect(value: TValue): void {
    this.selectedSet.delete(value);
    if (this.selectedSet.size === 0 && this.anchor === value) {
      this.anchor = null;
    }
  }

  public getAnchor(): TValue | null {
    return this.anchor;
  }

  public getSelected(): readonly TValue[] {
    return [...this.selectedSet.values()];
  }

  public isSelected(value: TValue): boolean {
    return this.selectedSet.has(value);
  }

  public select(value: TValue): void {
    if (this.mode === 'single') {
      this.selectedSet.clear();
    }

    this.selectedSet.add(value);
    this.anchor = value;
  }

  public selectRange(
    from: TValue,
    to: TValue,
    options: TngSelectionRangeOptions<TValue>,
  ): readonly TValue[] {
    const rangeMode: TngSelectionRangeMode = options.rangeMode ?? 'replace';
    this.anchor = from;
    if (this.mode === 'single') {
      this.select(to);
      return this.getSelected();
    }

    const rangeValues = findRangeValues(from, to, options.orderedValues);
    if (rangeValues.length === 0) {
      return this.getSelected();
    }

    this.mergeRangeValues(rangeValues, rangeMode);
    return this.getSelected();
  }

  public setAnchor(value: TValue | null): void {
    this.anchor = value;
  }

  public toggle(value: TValue): void {
    if (this.selectedSet.has(value)) {
      this.selectedSet.delete(value);
      if (this.selectedSet.size === 0) {
        this.anchor = null;
      }
      return;
    }

    this.select(value);
  }

  private mergeRangeValues(
    rangeValues: readonly TValue[],
    rangeMode: TngSelectionRangeMode,
  ): void {
    if (rangeMode === 'replace') {
      this.selectedSet.clear();
    }

    for (const value of rangeValues) {
      this.selectedSet.add(value);
    }
  }
}

export function createSelectionModel<TValue>(
  options: TngSelectionModelOptions<TValue> = {},
): TngSelectionModel<TValue> {
  return new SelectionModel(options);
}
