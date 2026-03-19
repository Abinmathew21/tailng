import { booleanAttribute, Component, computed, input } from '@angular/core';
import {
  normalizeTngProgressSpinnerMax,
  normalizeTngProgressSpinnerMin,
  resolveTngProgressSpinnerRange,
  TngProgressSpinner as TngProgressSpinnerPrimitive,
} from '@tailng-ui/primitives';

const spinnerRadius = 18;
const spinnerCircumference = 2 * Math.PI * spinnerRadius;

function normalizePositiveNumber(value: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return value > 0 ? value : fallback;
}

export function toTngProgressSpinnerPercent(min: number, max: number, value: number): number {
  const range = resolveTngProgressSpinnerRange(min, max, value);
  const denominator = range.max - range.min;
  if (denominator <= 0) {
    return 100;
  }

  return ((range.value - range.min) / denominator) * 100;
}

export function toTngProgressSpinnerDashOffset(percent: number): number {
  return spinnerCircumference - (spinnerCircumference * percent) / 100;
}

@Component({
  standalone: true,
  selector: 'tng-progress-spinner',
  imports: [TngProgressSpinnerPrimitive],
  templateUrl: './tng-progress-spinner.component.html',
  styleUrl: './tng-progress-spinner.component.css',
})
export class TngProgressSpinnerComponent {
  public readonly ariaLabel = input<string | null>(null);
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
  public readonly size = input<number, number | string>(40, {
    transform: (value: number | string): number =>
      normalizePositiveNumber(typeof value === 'number' ? value : Number(value), 40),
  });
  public readonly strokeWidth = input<number, number | string>(4, {
    transform: (value: number | string): number =>
      normalizePositiveNumber(typeof value === 'number' ? value : Number(value), 4),
  });
  public readonly value = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      typeof value === 'number' ? value : Number(value),
  });

  protected readonly circumference = spinnerCircumference;
  protected readonly dashOffset = computed<number>(() =>
    toTngProgressSpinnerDashOffset(
      toTngProgressSpinnerPercent(this.min(), this.max(), this.value()),
    ),
  );
}
