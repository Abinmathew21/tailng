import { Directive, HostBinding, input, numberAttribute } from '@angular/core';
import { coerceTngInputNullableBoolean, TngInput } from '../input/tng-input';

type NullableBooleanInput = boolean | null | string | undefined;
export type TngTextareaResize = 'both' | 'horizontal' | 'none' | 'vertical';

/** @deprecated Use `coerceTngInputNullableBoolean` from `tng-input`. */
export function coerceTngTextareaNullableBoolean(value: NullableBooleanInput): boolean | null {
  return coerceTngInputNullableBoolean(value);
}

export function normalizeTngTextareaRows(value: number): number {
  if (!Number.isFinite(value)) {
    return 3;
  }

  return Math.max(1, Math.trunc(value));
}

export function normalizeTngTextareaResize(value: unknown): TngTextareaResize {
  if (typeof value !== 'string') {
    return 'vertical';
  }

  const normalized = value.trim().toLowerCase();
  if (
    normalized === 'none' ||
    normalized === 'vertical' ||
    normalized === 'horizontal' ||
    normalized === 'both'
  ) {
    return normalized;
  }

  return 'vertical';
}

@Directive({
  selector: 'textarea[tngTextarea]',
  exportAs: 'tngTextarea',
  standalone: true,
  hostDirectives: [
    {
      directive: TngInput,
      inputs: [
        'ariaDescribedBy',
        'ariaInvalid',
        'ariaLabel',
        'ariaLabelledby',
        'ariaRequired',
        'disabled',
        'readonly',
        'required',
      ],
    },
  ],
})
export class TngTextarea {
  public readonly resize = input<TngTextareaResize, TngTextareaResize | string>('vertical', {
    transform: normalizeTngTextareaResize,
  });
  public readonly rows = input<number, number | string>(3, {
    transform: (value: number | string): number => normalizeTngTextareaRows(numberAttribute(value)),
  });

  @HostBinding('attr.data-resize')
  protected get dataResizeAttr(): TngTextareaResize {
    return this.resize();
  }

  @HostBinding('attr.rows')
  protected get rowsAttr(): number {
    return this.rows();
  }

  @HostBinding('style.resize')
  protected get resizeStyle(): TngTextareaResize {
    return this.resize();
  }
}
