import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

function normalizeFiniteNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

export function normalizeTngSliderMin(value: number): number {
  return normalizeFiniteNumber(value, 0);
}

export function normalizeTngSliderMax(value: number): number {
  return normalizeFiniteNumber(value, 100);
}

export function normalizeTngSliderStep(value: number): number {
  const normalized = normalizeFiniteNumber(value, 1);
  return normalized > 0 ? normalized : 1;
}

@Directive({
  selector: 'input[tngSlider]',
  exportAs: 'tngSlider',
  standalone: true,
})
export class TngSlider {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number, number | string>(100, {
    transform: (value: number | string): number =>
      normalizeTngSliderMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      normalizeTngSliderMin(typeof value === 'number' ? value : Number(value)),
  });
  public readonly step = input<number, number | string>(1, {
    transform: (value: number | string): number =>
      normalizeTngSliderStep(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      typeof value === 'number' ? value : Number(value),
  });

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'slider' as const;

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.max')
  protected get maxAttr(): string {
    return String(this.max());
  }

  @HostBinding('attr.min')
  protected get minAttr(): string {
    return String(this.min());
  }

  @HostBinding('attr.step')
  protected get stepAttr(): string {
    return String(this.step());
  }

  @HostBinding('attr.type')
  protected readonly typeAttr = 'range' as const;

  @HostBinding('attr.value')
  protected get valueAttr(): string {
    return String(this.value());
  }
}
