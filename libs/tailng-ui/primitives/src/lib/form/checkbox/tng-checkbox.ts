import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

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

function normalizeStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

@Directive({
  selector: 'input[tngCheckbox]',
  exportAs: 'tngCheckbox',
})
export class TngCheckbox {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly indeterminate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
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

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'checked' | 'mixed' | 'unchecked' {
    return resolveTngCheckboxDataState(this.checked(), this.indeterminate());
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
}
