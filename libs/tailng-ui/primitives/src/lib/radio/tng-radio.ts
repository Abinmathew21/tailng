import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function normalizeTngRadioStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

@Directive({
  selector: 'input[tngRadio]',
  exportAs: 'tngRadio',
})
export class TngRadio {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string | null>(null);

  @HostBinding('checked')
  protected get checkedProp(): boolean {
    return this.checked();
  }

  @HostBinding('attr.aria-checked')
  protected get ariaCheckedAttr(): 'false' | 'true' {
    return this.checked() ? 'true' : 'false';
  }

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return normalizeTngRadioStringValue(this.ariaDescribedBy());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
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
  protected get typeAttr(): 'radio' {
    return 'radio';
  }

  @HostBinding('attr.value')
  protected get valueAttr(): string | null {
    return normalizeTngRadioStringValue(this.value());
  }
}
