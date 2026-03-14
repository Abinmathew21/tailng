import { booleanAttribute, Directive, HostBinding, input } from '@angular/core';

function normalizeFiniteNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

export function normalizeTngProgressSpinnerMin(value: number): number {
  return normalizeFiniteNumber(value, 0);
}

export function normalizeTngProgressSpinnerMax(value: number): number {
  return normalizeFiniteNumber(value, 100);
}

export function resolveTngProgressSpinnerRange(
  min: number,
  max: number,
  value: number,
): Readonly<{
  max: number;
  min: number;
  value: number;
}> {
  const resolvedMin = normalizeTngProgressSpinnerMin(min);
  const resolvedMax = Math.max(normalizeTngProgressSpinnerMax(max), resolvedMin);
  const normalizedValue = normalizeFiniteNumber(value, resolvedMin);
  const resolvedValue = Math.min(Math.max(normalizedValue, resolvedMin), resolvedMax);

  return Object.freeze({
    max: resolvedMax,
    min: resolvedMin,
    value: resolvedValue,
  });
}

@Directive({
  selector: '[tngProgressSpinner]',
  exportAs: 'tngProgressSpinner',
})
export class TngProgressSpinner {
  public readonly indeterminate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number, number | string>(100, {
    transform: (value: number | string): number =>
      normalizeTngProgressSpinnerMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      normalizeTngProgressSpinnerMin(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      typeof value === 'number' ? value : Number(value),
  });

  @HostBinding('attr.aria-valuemax')
  protected get ariaValueMaxAttr(): string | null {
    if (this.indeterminate()) {
      return null;
    }

    return String(this.range.max);
  }

  @HostBinding('attr.aria-valuemin')
  protected get ariaValueMinAttr(): string | null {
    if (this.indeterminate()) {
      return null;
    }

    return String(this.range.min);
  }

  @HostBinding('attr.aria-valuenow')
  protected get ariaValueNowAttr(): string | null {
    if (this.indeterminate()) {
      return null;
    }

    return String(this.range.value);
  }

  @HostBinding('attr.data-indeterminate')
  protected get dataIndeterminateAttr(): '' | null {
    return this.indeterminate() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'progress-spinner' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'progressbar' as const;

  private get range(): Readonly<{
    max: number;
    min: number;
    value: number;
  }> {
    return resolveTngProgressSpinnerRange(this.min(), this.max(), this.value());
  }
}
