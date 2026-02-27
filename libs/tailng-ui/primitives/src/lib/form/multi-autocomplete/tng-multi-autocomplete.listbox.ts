import { DestroyRef, Directive, effect, HostBinding, HostListener, inject, untracked } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import { arraysEqual, normalizeToArray } from '../../internal/combobox';
import type { ListboxValue } from '../listbox/listbox.directive';
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';
import { TNG_MULTI_AUTOCOMPLETE } from './tng-multi-autocomplete.tokens';
import type { TngMultiAutocomplete } from './tng-multi-autocomplete';
import { TngMultiAutocompleteListboxApi } from './tng-multi-autocomplete.listbox.types';
import { TNG_MULTI_AUTOCOMPLETE_LISTBOX } from './tng-multi-autocomplete.listbox.tokens';

const createListboxId = createTngIdFactory('tng-multi-autocomplete-listbox');

@Directive({
  selector: '[tngMultiAutocompleteListbox]',
  standalone: true,
  providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useExisting: TngMultiAutocompleteListbox }],
  hostDirectives: [
    {
      directive: TngListboxDirective,
      inputs: ['orientation', 'direction', 'disabled', 'loop', 'value', 'multiple'],
      outputs: ['valueChange'],
    },
  ],
})
export class TngMultiAutocompleteListbox<T = unknown> implements TngMultiAutocompleteListboxApi<T> {
  private readonly multiAutocomplete = inject<TngMultiAutocomplete<T>>(TNG_MULTI_AUTOCOMPLETE);
  private readonly destroyRef = inject(DestroyRef);
  private readonly listbox = inject(TngListboxDirective<T>, { self: true });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-listbox' as const;

  @HostBinding('attr.id')
  protected readonly id = createListboxId();

  constructor() {
    this.multiAutocomplete.setListboxId(this.id);
    this.multiAutocomplete.setListboxApi(this);

    effect(() => {
      const v = this.multiAutocomplete.value();
      if (this.multiAutocomplete.open()) return;

      if (this.multiAutocomplete._createJustEmitted) {
        this.multiAutocomplete._createJustEmitted = false;
        return;
      }

      const current = untracked(this.listbox.value);
      const arrV = v.length > 0 ? ([...v] as readonly T[]) : null;
      const arrCur = normalizeToArray(current);
      if (arraysEqual(arrV, arrCur)) return;
      this.listbox.value.set((v.length > 0 ? v : null) as ListboxValue<T>);
    });

    this.destroyRef.onDestroy(() => {
      this.multiAutocomplete.setListboxId(null);
      this.multiAutocomplete.setListboxApi(null);
    });
  }

  getHostId(): string | null {
    return this.id ?? null;
  }

  getActiveId(): string | null {
    return this.listbox.getActiveId();
  }

  ensureActive(pref?: 'first' | 'last'): void {
    this.listbox.ensureActive(pref);
  }

  handleKey(key: string, shiftKey?: boolean): boolean {
    return this.listbox.handleKeyFromCombobox(key, shiftKey);
  }

  typeahead(key: string): boolean {
    return this.listbox.typeaheadFromCombobox(key);
  }

  /** Multi: Enter toggles option, overlay stays open. */
  commitActive(): void {
    this.listbox.handleKeyFromCombobox('Enter');
  }

  @HostListener('valueChange', ['$event'])
  protected onListboxValueChange(value: T | readonly T[] | null): void {
    if (this.multiAutocomplete.disabled()) return;

    const next = normalizeToArray(value);
    const cur = this.multiAutocomplete.value();
    if (arraysEqual(next, cur.length > 0 ? cur : null)) return;

    this.multiAutocomplete.value.set(next && next.length > 0 ? [...next] : []);
    this.multiAutocomplete.query.set('');
    // Multi: overlay stays open
  }
}

@Directive({
  selector: '[tngMultiAutocompleteOption]',
  standalone: true,
  hostDirectives: [
    {
      directive: TngOptionDirective,
      inputs: ['tngValue', 'disabled'],
    },
  ],
})
export class TngMultiAutocompleteOption<T> {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-option' as const;
}
