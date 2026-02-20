import { booleanAttribute, Directive, HostBinding, input } from '@angular/core';

function normalizeFiniteNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

export function normalizeTngProgressBarMin(value: number): number {
  return normalizeFiniteNumber(value, 0);
}

export function normalizeTngProgressBarMax(value: number): number {
  return normalizeFiniteNumber(value, 100);
}

export function resolveTngProgressBarRange(
  min: number,
  max: number,
  value: number,
): Readonly<{
  max: number;
  min: number;
  value: number;
}> {
  const resolvedMin = normalizeTngProgressBarMin(min);
  const resolvedMax = Math.max(normalizeTngProgressBarMax(max), resolvedMin);
  const resolvedValue = Math.min(Math.max(value, resolvedMin), resolvedMax);

  return Object.freeze({
    max: resolvedMax,
    min: resolvedMin,
    value: resolvedValue,
  });
}

@Directive({
  selector: '[tngProgressBar]',
  exportAs: 'tngProgressBar',
})
export class TngProgressBar {
  public readonly indeterminate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number, number | string>(100, {
    transform: (value: number | string): number =>
      normalizeTngProgressBarMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      normalizeTngProgressBarMin(typeof value === 'number' ? value : Number(value)),
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
  protected readonly dataSlot = 'progress-bar' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'progressbar' as const;

  private get range(): Readonly<{
    max: number;
    min: number;
    value: number;
  }> {
    return resolveTngProgressBarRange(this.min(), this.max(), this.value());
  }
}

@Directive({
  selector: '[tngProgressBarIndicator]',
  exportAs: 'tngProgressBarIndicator',
})
export class TngProgressBarIndicator {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'progress-bar-indicator' as const;
}
