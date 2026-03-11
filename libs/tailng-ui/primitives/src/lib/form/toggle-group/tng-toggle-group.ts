import {
  Directive,
  HostBinding,
  OnInit,
  booleanAttribute,
  input,
  output,
  signal,
} from '@angular/core';

type TngToggleGroupSelectionMode = 'multiple' | 'single';

function coerceSelectionMode(value: unknown): TngToggleGroupSelectionMode {
  return value === 'single' ? 'single' : 'multiple';
}

function normalizeStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeStringArray(value: readonly string[] | null | undefined): readonly string[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [];
  }

  const normalized: string[] = [];
  for (const item of value) {
    const normalizedItem = normalizeStringValue(item);
    if (normalizedItem === null || normalized.includes(normalizedItem)) {
      continue;
    }

    normalized.push(normalizedItem);
  }

  return normalized;
}

@Directive({
  selector: '[tngToggleGroup]',
  exportAs: 'tngToggleGroup',
})
export class TngToggleGroup implements OnInit {
  private readonly internalSingleValue = signal<string | null>(null);
  private readonly internalMultipleValues = signal<readonly string[]>([]);

  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  public readonly selectionMode = input<TngToggleGroupSelectionMode, unknown>('multiple', {
    transform: coerceSelectionMode,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string | null | undefined>(undefined);
  public readonly values = input<readonly string[] | undefined>(undefined);
  public readonly defaultValue = input<string | null>(null);
  public readonly defaultValues = input<readonly string[]>([]);

  public readonly valueChange = output<string | null>();
  public readonly valuesChange = output<readonly string[]>();

  public ngOnInit(): void {
    this.internalSingleValue.set(normalizeStringValue(this.defaultValue()));
    this.internalMultipleValues.set(normalizeStringArray(this.defaultValues()));
  }

  public isGroupDisabled(): boolean {
    return this.disabled();
  }

  public isItemSelected(itemValue: string): boolean {
    if (this.selectionMode() === 'single') {
      return this.resolveSingleValue() === itemValue;
    }

    return this.resolveMultipleValues().includes(itemValue);
  }

  public toggleItem(itemValue: string): boolean {
    if (this.disabled()) {
      return this.isItemSelected(itemValue);
    }

    if (this.selectionMode() === 'single') {
      const currentValue = this.resolveSingleValue();
      const nextValue = currentValue === itemValue ? null : itemValue;

      if (!this.isSingleControlled()) {
        this.internalSingleValue.set(nextValue);
      }

      if (nextValue !== currentValue) {
        this.valueChange.emit(nextValue);
      }

      return nextValue === itemValue;
    }

    const currentValues = this.resolveMultipleValues();
    const isSelected = currentValues.includes(itemValue);
    const nextValues = isSelected
      ? currentValues.filter((value) => value !== itemValue)
      : [...currentValues, itemValue];

    if (!this.isMultipleControlled()) {
      this.internalMultipleValues.set(nextValues);
    }

    if (nextValues.length !== currentValues.length || !isSelected) {
      this.valuesChange.emit(nextValues);
    }

    return !isSelected;
  }

  private isSingleControlled(): boolean {
    return this.value() !== undefined;
  }

  private isMultipleControlled(): boolean {
    return this.values() !== undefined;
  }

  private resolveSingleValue(): string | null {
    if (this.isSingleControlled()) {
      return normalizeStringValue(this.value() ?? null);
    }

    return this.internalSingleValue();
  }

  private resolveMultipleValues(): readonly string[] {
    if (this.isMultipleControlled()) {
      return normalizeStringArray(this.values());
    }

    return this.internalMultipleValues();
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    return normalizeStringValue(this.ariaLabel());
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledbyAttr(): string | null {
    return normalizeStringValue(this.ariaLabelledby());
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabledAttr(): 'true' | null {
    return this.disabled() ? 'true' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-orientation')
  protected get dataOrientationAttr(): 'horizontal' | 'vertical' {
    return this.orientation();
  }

  @HostBinding('attr.data-selection-mode')
  protected get dataSelectionModeAttr(): TngToggleGroupSelectionMode {
    return this.selectionMode();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toggle-group' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'group' as const;
}
