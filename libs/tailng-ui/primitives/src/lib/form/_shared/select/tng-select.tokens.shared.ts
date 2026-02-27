import { InjectionToken } from '@angular/core';
import type { TngSelectHostApi } from './tng-select.host-api';

/**
 * Token for the select host API. Provided by TngSelect or TngMultiSelect.
 * Shared parts and overlay inject this.
 */
export const TNG_SELECT_HOST =
  new InjectionToken<TngSelectHostApi>('TNG_SELECT_HOST');
