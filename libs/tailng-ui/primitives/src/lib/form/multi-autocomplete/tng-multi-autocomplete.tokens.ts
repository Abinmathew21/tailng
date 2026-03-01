import { InjectionToken } from '@angular/core';
import type { TngMultiAutocomplete } from './tng-multi-autocomplete';

export const TNG_MULTI_AUTOCOMPLETE =
  new InjectionToken<TngMultiAutocomplete<unknown>>('TNG_MULTI_AUTOCOMPLETE');