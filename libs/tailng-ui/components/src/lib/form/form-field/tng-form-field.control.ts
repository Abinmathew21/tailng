import { InjectionToken } from '@angular/core';

export interface TngFormFieldControl {
  readonly id: string | null;
  readonly disabled: boolean;
  readonly focused: boolean;
  readonly invalid: boolean;
  readonly required: boolean;

  setDescribedByIds(ids: readonly string[]): void;
  setLabelledById?(id: string | null): void;
  setAriaInvalid?(invalid: boolean): void;
  setAriaRequired?(required: boolean): void;
}

export const TNG_FORM_FIELD_CONTROL = new InjectionToken<TngFormFieldControl>(
  'TNG_FORM_FIELD_CONTROL',
);

