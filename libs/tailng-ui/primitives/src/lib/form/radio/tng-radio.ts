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

export function normalizeTngRadioStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function coerceTngRadioNullableBoolean(value: NullableBooleanInput): boolean | null {
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

export function resolveTngRadioDataState(checked: boolean): 'checked' | 'unchecked' {
  return checked ? 'checked' : 'unchecked';
}

export function resolveTngRadioInvalidState(
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
  selector: 'input[tngRadio]',
  exportAs: 'tngRadio',
})
export class TngRadio {
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private focused = false;
  private focusVisible = false;

  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngRadioNullableBoolean,
  });
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngRadioNullableBoolean,
  });
  public readonly name = input<string | null>(null);
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string | null>(null);
  protected readonly typeAttr = 'radio' as const;

  @HostBinding('checked')
  protected get checkedProp(): boolean {
    return this.checked();
  }

  @HostBinding('attr.aria-checked')
  protected get ariaCheckedAttr(): 'false' | 'true' {
    return this.checked() ? 'true' : 'false';
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabledAttr(): 'true' | null {
    return this.disabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return normalizeTngRadioStringValue(this.ariaDescribedBy());
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
    return this.checked() ? '' : null;
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

  @HostBinding('attr.data-readonly')
  protected get dataReadonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
  }

  @HostBinding('attr.data-required')
  protected get dataRequiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'checked' | 'unchecked' {
    return resolveTngRadioDataState(this.checked());
  }

  @HostBinding('attr.data-unchecked')
  protected get dataUncheckedAttr(): '' | null {
    return this.checked() ? null : '';
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.name')
  protected get nameAttr(): string | null {
    return normalizeTngRadioStringValue(this.name());
  }

  @HostBinding('attr.required')
  protected get requiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.type')
  protected get hostTypeAttr(): 'radio' {
    return this.typeAttr;
  }

  @HostBinding('attr.value')
  protected get valueAttr(): string | null {
    return normalizeTngRadioStringValue(this.value());
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

    this.elementRef.nativeElement.checked = this.checked();
  }

  private isInvalid(): boolean {
    return resolveTngRadioInvalidState(this.invalid(), this.ariaInvalid());
  }
}
