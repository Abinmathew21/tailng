import { InjectionToken } from '@angular/core';
import type { TngListboxDirective } from './listbox.directive';

export const TNG_LISTBOX =
  new InjectionToken<TngListboxDirective<any>>('TNG_LISTBOX');

/** Optional override for listbox typeahead behavior. If provided, wins over the input(). */
export const TNG_LISTBOX_FORCE_TYPEAHEAD =
  new InjectionToken<boolean>('TNG_LISTBOX_FORCE_TYPEAHEAD');

/** Optional override for listbox multiple behavior. If provided, wins over the input(). */
export const TNG_LISTBOX_FORCE_MULTIPLE =
  new InjectionToken<boolean>('TNG_LISTBOX_FORCE_MULTIPLE');

/**
 * When true, unregistering options should not mutate the external listbox value.
 * This is useful for filterable composites where options can temporarily unmount
 * while the controlled value should remain authoritative.
 */
export const TNG_LISTBOX_PRESERVE_VALUE_ON_UNREGISTER =
  new InjectionToken<boolean>('TNG_LISTBOX_PRESERVE_VALUE_ON_UNREGISTER');
