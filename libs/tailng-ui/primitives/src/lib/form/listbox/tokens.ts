import { InjectionToken } from '@angular/core';
import type { TngListboxDirective } from './listbox.directive';

export const TNG_LISTBOX =
  new InjectionToken<TngListboxDirective<any>>('TNG_LISTBOX');
