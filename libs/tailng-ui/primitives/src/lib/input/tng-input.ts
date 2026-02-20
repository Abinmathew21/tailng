import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

type NullableBooleanInput = boolean | null | string | undefined;
export type TngInputType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';

export function coerceTngInputNullableBoolean(value: NullableBooleanInput): boolean | null {
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
  selector: 'input[tngInput]',
  exportAs: 'tngInput',
})
export class TngInput {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
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
  public readonly type = input<TngInputType>('text');

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

  @HostBinding('attr.type')
  protected get typeAttr(): TngInputType {
    return this.type();
  }
}
