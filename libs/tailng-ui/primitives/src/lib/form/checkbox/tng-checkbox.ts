import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';

type NullableBooleanInput = '' | 'false' | 'true' | boolean | null | undefined;

function normalizeStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function coerceTngCheckboxNullableBoolean(value: NullableBooleanInput): boolean | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (value === '' || value === true || value === 'true') {
    return true;
  }

  if (value === false || value === 'false') {
    return false;
  }

  return null;
}

export function resolveTngCheckboxAriaChecked(
  checked: boolean,
  indeterminate: boolean,
): 'false' | 'mixed' | 'true' {
  if (indeterminate) {
    return 'mixed';
  }

  return checked ? 'true' : 'false';
}

export function resolveTngCheckboxDataState(
  checked: boolean,
  indeterminate: boolean,
): 'checked' | 'mixed' | 'unchecked' {
  if (indeterminate) {
    return 'mixed';
  }

  return checked ? 'checked' : 'unchecked';
}

export function resolveTngCheckboxInvalidState(
  invalid: boolean | null,
  ariaInvalid: boolean | null,
): boolean {
  if (invalid !== null) {
    return invalid;
  }

  if (ariaInvalid !== null) {
    return ariaInvalid;
  }

  return false;
}

@Directive({
  selector: 'input[tngCheckbox]',
  exportAs: 'tngCheckbox',
  standalone: true,
})
export class TngCheckbox {
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private focused = false;
  private focusVisible = false;

  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngCheckboxNullableBoolean,
  });
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngCheckboxNullableBoolean,
  });
  public readonly indeterminate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string | null>(null);
  protected readonly typeAttr = 'checkbox' as const;

  @HostBinding('checked')
  protected get checkedProp(): boolean {
    return this.checked();
  }

  @HostBinding('indeterminate')
  protected get indeterminateProp(): boolean {
    return this.indeterminate();
  }

  @HostBinding('attr.aria-checked')
  protected get ariaCheckedAttr(): 'false' | 'mixed' | 'true' {
    return resolveTngCheckboxAriaChecked(this.checked(), this.indeterminate());
  }

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return normalizeStringValue(this.ariaDescribedBy());
  }

  @HostBinding('attr.aria-invalid')
  protected get ariaInvalidAttr(): 'true' | null {
    return this.isInvalid() ? 'true' : null;
  }

  @HostBinding('attr.aria-readonly')
  protected get ariaReadonlyAttr(): 'true' | null {
    return this.readonly() ? 'true' : null;
  }

  @HostBinding('attr.data-checked')
  protected get dataCheckedAttr(): '' | null {
    return this.checked() && !this.indeterminate() ? '' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-focused')
  protected get dataFocusedAttr(): '' | null {
    return this.focused ? '' : null;
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisibleAttr(): '' | null {
    return this.focusVisible ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalidAttr(): '' | null {
    return this.isInvalid() ? '' : null;
  }

  @HostBinding('attr.data-mixed')
  protected get dataMixedAttr(): '' | null {
    return this.indeterminate() ? '' : null;
  }

  @HostBinding('attr.data-readonly')
  protected get dataReadonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
  }

  @HostBinding('attr.data-required')
  protected get dataRequiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'checked' | 'mixed' | 'unchecked' {
    return resolveTngCheckboxDataState(this.checked(), this.indeterminate());
  }

  @HostBinding('attr.data-unchecked')
  protected get dataUncheckedAttr(): '' | null {
    return !this.checked() && !this.indeterminate() ? '' : null;
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.name')
  protected get nameAttr(): string | null {
    return normalizeStringValue(this.name());
  }

  @HostBinding('attr.required')
  protected get requiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.type')
  protected get hostTypeAttr(): 'checkbox' {
    return this.typeAttr;
  }

  @HostBinding('attr.value')
  protected get valueAttr(): string | null {
    return normalizeStringValue(this.value());
  }

  @HostListener('blur')
  public onBlur(): void {
    this.focused = false;
    this.focusVisible = false;
  }

  @HostListener('focus')
  public onFocus(): void {
    this.focused = true;
    this.focusVisible = this.elementRef.nativeElement.matches(':focus-visible');
  }

  @HostListener('change')
  public onReadonlyChange(): void {
    if (!this.readonly() || this.disabled()) {
      return;
    }

    const hostElement = this.elementRef.nativeElement;
    hostElement.checked = this.checked();
    hostElement.indeterminate = this.indeterminate();
  }

  private isInvalid(): boolean {
    return resolveTngCheckboxInvalidState(this.invalid(), this.ariaInvalid());
  }
}
