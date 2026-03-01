import { InjectionToken } from '@angular/core';
import type { TngListboxDirective } from './listbox.directive';

export const TNG_LISTBOX =
  new InjectionToken<TngListboxDirective<any>>('TNG_LISTBOX');

/** Optional override for listbox typeahead behavior. If provided, wins over the input(). */
export const TNG_LISTBOX_FORCE_TYPEAHEAD =
  new InjectionToken<boolean>('TNG_LISTBOX_FORCE_TYPEAHEAD');