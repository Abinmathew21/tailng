import { Directive, HostBinding, booleanAttribute, input, numberAttribute } from '@angular/core';

type NullableBooleanInput = boolean | null | string | undefined;

export function coerceTngTextareaNullableBoolean(value: NullableBooleanInput): boolean | null {
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

export function normalizeTngTextareaRows(value: number): number {
  if (!Number.isFinite(value)) {
    return 3;
  }

  return Math.max(1, Math.trunc(value));
}

function normalizeStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toAriaBoolean(value: boolean | null): 'false' | 'true' | null {
  if (value === null) {
    return null;
  }

  return value ? 'true' : 'false';
}

@Directive({
  selector: 'textarea[tngTextarea]',
  exportAs: 'tngTextarea',
})
export class TngTextarea {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngTextareaNullableBoolean,
  });
  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngTextareaNullableBoolean,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly rows = input<number, number | string>(3, {
    transform: (value: number | string): number => normalizeTngTextareaRows(numberAttribute(value)),
  });

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return normalizeStringValue(this.ariaDescribedBy());
  }

  @HostBinding('attr.aria-invalid')
  protected get ariaInvalidAttr(): 'false' | 'true' | null {
    return toAriaBoolean(this.ariaInvalid());
  }

  @HostBinding('attr.aria-required')
  protected get ariaRequiredAttr(): 'false' | 'true' | null {
    if (this.required()) {
      return 'true';
    }

    return toAriaBoolean(this.ariaRequired());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalidAttr(): '' | null {
    return this.ariaInvalid() === true ? '' : null;
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.readonly')
  protected get readonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
  }

  @HostBinding('attr.required')
  protected get requiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.rows')
  protected get rowsAttr(): number {
    return this.rows();
  }
}
