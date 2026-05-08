import {
  Directive,
  ElementRef,
  HostBinding,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';

import { TngUniqueIdService } from '../_shared/id';

type NullableBooleanInput = boolean | null | string | undefined;

export type TngInputType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';

export function coerceTngInputNullableBoolean(value: NullableBooleanInput): boolean | null {
  if (value === undefined || value === null) return null;

  if (value === '' || value === true || value === 'true') return true;

  if (value === false || value === 'false') return false;

  return null;
}

function normalizeStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toAriaBoolean(value: boolean | null): 'false' | 'true' | null {
  if (value === null) return null;
  return value ? 'true' : 'false';
}

function normalizeAriaInvalidValue(value: string | null | undefined): 'false' | 'grammar' | 'spelling' | 'true' | null {
  const normalized = normalizeStringValue(value);
  if (normalized === null) return null;

  if (
    normalized === 'false' ||
    normalized === 'grammar' ||
    normalized === 'spelling' ||
    normalized === 'true'
  ) {
    return normalized;
  }

  return 'true';
}

@Directive({
  selector: 'input[tngInput], textarea[tngInput]',
  exportAs: 'tngInput',
})
export class TngInput {
  private readonly elementRef = inject(ElementRef<HTMLInputElement | HTMLTextAreaElement>);
  private readonly idService = inject(TngUniqueIdService);

  public readonly hostElement = this.elementRef.nativeElement;
  private readonly initialAriaLabel = normalizeStringValue(this.hostElement.getAttribute('aria-label'));
  private readonly initialAriaLabelledby = normalizeStringValue(this.hostElement.getAttribute('aria-labelledby'));
  private readonly initialAriaDescribedBy = normalizeStringValue(
    this.hostElement.getAttribute('aria-describedby'),
  );
  private readonly initialAriaInvalid = normalizeAriaInvalidValue(
    this.hostElement.getAttribute('aria-invalid'),
  );
  private readonly initialAriaRequired = coerceTngInputNullableBoolean(
    this.hostElement.getAttribute('aria-required'),
  );

  private readonly generatedId = this.idService.nextId('tng-input');

  /** Canonical API for aria-describedby (whitespace normalized). */
  public readonly ariaDescribedBy = input<string | null>(null);

  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);

  /** If non-null, this value overrides native validity in `isInvalid()`. */
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });

  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });

  public readonly disabled = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  public readonly readonly = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  public readonly required = input<boolean, boolean | string>(false, { transform: booleanAttribute });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input' as const;

  @HostBinding('attr.id')
  protected get idAttr(): string {
    const nativeId = normalizeStringValue(this.hostElement.getAttribute('id'));
    return nativeId ?? this.generatedId;
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    const provided = normalizeStringValue(this.ariaLabel());
    if (provided !== null) return provided;

    return this.initialAriaLabel;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledbyAttr(): string | null {
    const provided = normalizeStringValue(this.ariaLabelledby());
    if (provided !== null) return provided;

    return this.initialAriaLabelledby;
  }

  /**
   * If the consumer provided a native `aria-describedby` and the input is not set,
   * preserve it (do not clobber).
   */
  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    const provided = normalizeStringValue(this.ariaDescribedBy());
    if (provided !== null) return provided;

    return this.initialAriaDescribedBy;
  }

  /**
   * Omit `aria-invalid` unless invalid. (Avoids noisy aria-invalid="false" and
   * makes unit tests + bindings more stable.)
   */
  @HostBinding('attr.aria-invalid')
  protected get ariaInvalidAttr(): 'false' | 'grammar' | 'spelling' | 'true' | null {
    const override = this.ariaInvalid();
    if (override !== null) return override ? 'true' : null;

    if (this.initialAriaInvalid !== null) return this.initialAriaInvalid;

    return this.hostElement.matches(':invalid') ? 'true' : null;
  }

  @HostBinding('attr.aria-required')
  protected get ariaRequiredAttr(): 'false' | 'true' | null {
    if (this.required()) return 'true';
    const provided = toAriaBoolean(this.ariaRequired());
    if (provided !== null) return provided;

    return toAriaBoolean(this.initialAriaRequired);
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalidAttr(): '' | null {
    return this.isInvalid() ? '' : null;
  }

  @HostBinding('attr.data-readonly')
  protected get dataReadonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
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

  public isInvalid(): boolean {
    const override = this.ariaInvalid();
    if (override !== null) return override;

    if (this.initialAriaInvalid !== null) return this.initialAriaInvalid !== 'false';

    // jsdom may not fully implement validity; this is still correct for browsers.
    return this.hostElement.matches(':invalid');
  }
}
