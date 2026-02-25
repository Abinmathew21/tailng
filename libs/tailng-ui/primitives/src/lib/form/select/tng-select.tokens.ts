// tng-select.tokens.ts
import { InjectionToken } from '@angular/core';
import type { TngSelect } from './tng-select';

export const TNG_SELECT = new InjectionToken<TngSelect>('TNG_SELECT');

/** When provided (e.g. by TngMultiSelectComponent), forces multiple=true for the select. */
export const TNG_SELECT_FORCE_MULTIPLE = new InjectionToken<boolean>('TNG_SELECT_FORCE_MULTIPLE');