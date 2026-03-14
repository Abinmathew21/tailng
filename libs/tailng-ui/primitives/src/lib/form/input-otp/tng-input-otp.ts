import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function normalizeTngOtpLength(value: number): number {
  if (!Number.isFinite(value)) {
    return 6;
  }

  const rounded = Math.trunc(value);
  if (rounded < 1) {
    return 1;
  }

  return rounded > 12 ? 12 : rounded;
}

export type TngOtpCompletionState = 'complete' | 'empty' | 'partial';

export function normalizeTngOtpValue(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value;
}

export function clampTngOtpValue(value: string, length: number): string {
  return Array.from(value).slice(0, length).join('');
}

export function resolveTngOtpState(length: number, value: string): TngOtpCompletionState {
  const normalizedLength = normalizeTngOtpLength(length);
  const clampedValue = clampTngOtpValue(normalizeTngOtpValue(value), normalizedLength);

  if (clampedValue.length === 0) {
    return 'empty';
  }

  return clampedValue.length >= normalizedLength ? 'complete' : 'partial';
}

@Directive({
  selector: '[tngInputOtp]',
  exportAs: 'tngInputOtp',
})
export class TngInputOtp {
  public readonly length = input<number, number | string>(6, {
    transform: (value: number | string): number =>
      normalizeTngOtpLength(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<string>('');
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly focused = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly focusVisible = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly activeIndex = input<number | null>(null);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-otp' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'group' as const;

  @HostBinding('attr.data-empty')
  protected get dataEmptyAttr(): '' | null {
    return resolveTngOtpState(this.length(), this.value()) === 'empty' ? '' : null;
  }

  @HostBinding('attr.data-partial')
  protected get dataPartialAttr(): '' | null {
    return resolveTngOtpState(this.length(), this.value()) === 'partial' ? '' : null;
  }

  @HostBinding('attr.data-complete')
  protected get dataCompleteAttr(): '' | null {
    return resolveTngOtpState(this.length(), this.value()) === 'complete' ? '' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-readonly')
  protected get dataReadonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
  }

  @HostBinding('attr.data-required')
  protected get dataRequiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalidAttr(): '' | null {
    return this.invalid() ? '' : null;
  }

  @HostBinding('attr.data-focused')
  protected get dataFocusedAttr(): '' | null {
    return this.focused() ? '' : null;
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisibleAttr(): '' | null {
    return this.focusVisible() ? '' : null;
  }

  @HostBinding('attr.data-active')
  protected get dataActiveAttr(): string | null {
    const index = this.activeIndex();
    if (typeof index !== 'number' || !Number.isFinite(index)) {
      return null;
    }

    if (index < 0 || index >= this.length()) {
      return null;
    }

    return String(index);
  }
}
