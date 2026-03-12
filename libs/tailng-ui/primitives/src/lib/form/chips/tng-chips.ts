import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  booleanAttribute,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

function normalizeString(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeValues(values: readonly unknown[] | null | undefined): readonly unknown[] {
  if (!Array.isArray(values) || values.length === 0) {
    return [];
  }

  return [...values];
}

function toDataValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
}

function removeFirstOccurrence(values: readonly unknown[], target: unknown): readonly unknown[] {
  const index = values.findIndex((item) => Object.is(item, target));
  if (index < 0) {
    return values;
  }

  return [...values.slice(0, index), ...values.slice(index + 1)];
}

@Directive({
  selector: '[tngChips]',
  exportAs: 'tngChips',
})
export class TngChips implements OnInit {
  private readonly internalValues = signal<readonly unknown[]>([]);

  public readonly values = input<readonly unknown[] | undefined>(undefined, {
    alias: 'tngChipsValues',
  });
  public readonly defaultValues = input<readonly unknown[]>([], {
    alias: 'tngChipsDefaultValues',
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    alias: 'tngChipsDisabled',
    transform: booleanAttribute,
  });
  public readonly ariaLabel = input<string | null>(null, {
    alias: 'tngChipsAriaLabel',
  });

  public readonly chipRemove = output<unknown>();
  public readonly valuesChange = output<readonly unknown[]>();

  public ngOnInit(): void {
    this.internalValues.set(normalizeValues(this.defaultValues()));
  }

  public isDisabled(): boolean {
    return this.disabled();
  }

  public removeValue(value: unknown): boolean {
    if (this.disabled()) {
      return false;
    }

    this.chipRemove.emit(value);

    const currentValues = this.resolveValues();
    const nextValues = removeFirstOccurrence(currentValues, value);
    const changed = nextValues !== currentValues;
    if (!changed) {
      return true;
    }

    if (!this.isControlled()) {
      this.internalValues.set(nextValues);
    }

    this.valuesChange.emit(nextValues);
    return true;
  }

  private isControlled(): boolean {
    return this.values() !== undefined;
  }

  private resolveValues(): readonly unknown[] {
    if (this.isControlled()) {
      return normalizeValues(this.values());
    }

    return this.internalValues();
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    return normalizeString(this.ariaLabel());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'chips' as const;

  @HostBinding('attr.role')
  protected readonly role = 'list' as const;
}

@Directive({
  selector: '[tngChip]',
  exportAs: 'tngChip',
})
export class TngChip {
  private readonly chips = inject(TngChips, { optional: true });

  public readonly value = input<unknown>(null, { alias: 'tngChipValue' });
  public readonly label = input<string | null>(null, { alias: 'tngChipLabel' });
  public readonly disabled = input<boolean, boolean | string>(false, {
    alias: 'tngChipDisabled',
    transform: booleanAttribute,
  });
  public readonly removable = input<boolean, boolean | string>(true, {
    alias: 'tngChipRemovable',
    transform: booleanAttribute,
  });

  public readonly chipRemove = output<unknown>();

  public isDisabled(): boolean {
    return this.disabled() || this.chips?.isDisabled() === true;
  }

  public isRemovable(): boolean {
    return this.removable() && !this.isDisabled();
  }

  public resolvedLabel(): string {
    const fromInput = normalizeString(this.label());
    if (fromInput !== null) {
      return fromInput;
    }

    const fromValue = toDataValue(this.value());
    return normalizeString(fromValue) ?? 'item';
  }

  public requestRemove(): boolean {
    if (!this.isRemovable()) {
      return false;
    }

    const chipValue = this.value();
    this.chipRemove.emit(chipValue);
    this.chips?.removeValue(chipValue);
    return true;
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Delete' && event.key !== 'Backspace') {
      return;
    }

    if (!this.isRemovable()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.requestRemove();
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'chip' as const;

  @HostBinding('attr.data-value')
  protected get dataValueAttr(): string | null {
    return toDataValue(this.value());
  }

  @HostBinding('attr.role')
  protected readonly role = 'listitem' as const;
}

@Directive({
  selector: '[tngChipRemove]',
  exportAs: 'tngChipRemove',
})
export class TngChipRemove {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly chip = inject(TngChip, { optional: true });
  private readonly chips = inject(TngChips, { optional: true });

  private focused = false;
  private suppressNextClick = false;

  public readonly ariaLabel = input<string | null>(null, {
    alias: 'tngChipRemoveAriaLabel',
  });

  private isDisabled(): boolean {
    return this.chip?.isDisabled() === true || this.chips?.isDisabled() === true;
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    if (this.suppressNextClick) {
      this.suppressNextClick = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.chip?.requestRemove();
  }

  @HostListener('focusin')
  protected onFocusIn(): void {
    this.focused = true;
  }

  @HostListener('focusout')
  protected onFocusOut(): void {
    this.focused = false;
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.suppressNextClick = true;
    setTimeout(() => {
      this.suppressNextClick = false;
    });

    this.chip?.requestRemove();
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string {
    const explicit = normalizeString(this.ariaLabel());
    if (explicit !== null) {
      return explicit;
    }

    const hostDefined = normalizeString(this.elementRef.nativeElement.getAttribute('aria-label'));
    if (hostDefined !== null) {
      return hostDefined;
    }

    const label = this.chip?.resolvedLabel() ?? 'item';
    return `Remove ${label}`;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.data-focused')
  protected get dataFocusedAttr(): '' | null {
    return this.focused ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'chip-remove' as const;

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.type')
  protected get typeAttr(): 'button' | null {
    return this.elementRef.nativeElement.tagName === 'BUTTON' ? 'button' : null;
  }
}
