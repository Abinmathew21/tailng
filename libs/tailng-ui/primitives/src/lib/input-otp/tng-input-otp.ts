import { Directive, HostBinding, input } from '@angular/core';

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

@Directive({
  selector: '[tngInputOtp]',
  exportAs: 'tngInputOtp',
})
export class TngInputOtp {
  public readonly length = input<number, number | string>(6, {
    transform: (value: number | string): number =>
      normalizeTngOtpLength(typeof value === 'number' ? value : Number(value)),
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-otp' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'group' as const;
}
