import { DestroyRef, Directive, effect, HostBinding, HostListener, inject, untracked } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import {
  TNG_LISTBOX_FORCE_TYPEAHEAD,
  TngListboxDirective,
  TngOptionDirective,
} from '@tailng-ui/primitives';

import type { TngMultiAutocomplete } from './tng-multi-autocomplete';
import { TNG_MULTI_AUTOCOMPLETE } from './tng-multi-autocomplete.tokens';
import { TNG_MULTI_AUTOCOMPLETE_LISTBOX } from './tng-multi-autocomplete.listbox.tokens';
import type { TngMultiAutocompleteListboxApi } from './tng-multi-autocomplete.listbox.types';

const createListboxId = createTngIdFactory('tng-multi-autocomplete-listbox');

@Directive({
  selector: '[tngMultiAutocompleteListbox]',
  standalone: true,
  providers: [
    { provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useExisting: TngMultiAutocompleteListbox },
    { provide: TNG_LISTBOX_FORCE_TYPEAHEAD, useValue: false },
  ],
  hostDirectives: [
    {
      directive: TngListboxDirective,
      // NOTE: we *do* expose multiple so the consumer can set [multiple]="true" for now.
      // Later we can "force multiple" via an optional token, same style as typeahead.
      inputs: ['multiple', 'orientation', 'direction', 'disabled', 'loop', 'value'],
      outputs: ['valueChange'],
    },
  ],
})
export class TngMultiAutocompleteListbox<T = unknown> implements TngMultiAutocompleteListboxApi<T> {
  private readonly multi = inject<TngMultiAutocomplete<T>>(TNG_MULTI_AUTOCOMPLETE);
  private readonly destroyRef = inject(DestroyRef);
  private readonly listbox = inject(TngListboxDirective<T>, { self: true });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-listbox' as const;

  @HostBinding('attr.id')
  protected readonly id = createListboxId();

  constructor() {
    this.multi.setListboxId(this.id);
    this.multi.setListboxApi(this);

    // ✅ key bridge: external chips selection -> listbox.value (drives aria-selected UI)
    effect(() => {
      const v = this.multi.value();
    
      // read listbox.value without tracking (prevents re-trigger loops)
      const current = untracked(this.listbox.value);
      const currentArr = Array.isArray(current) ? current : current === null ? [] : [current];
    
      if (currentArr.length === v.length && v.every((val, i) => Object.is(val, currentArr[i]))) {
        return;
      }
    
      this.listbox.value.set([...v]);
    });

    this.destroyRef.onDestroy(() => {
      this.multi.setListboxId(null);
      this.multi.setListboxApi(null);
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

  commitActive(): void {
    const value = this.listbox.getActiveValue();
    if (value === undefined) return;

    // Multi: toggle selection, keep open
    this.multi.toggle(value as T);

    // Chips UX: clear input query after a successful toggle
    this.multi.query.set('');
  }

  @HostListener('valueChange', ['$event'])
  protected onListboxValueChange(value: T | readonly T[] | null): void {
    if (this.multi.disabled()) return;

    // In multi mode, listbox emits the full selected array.
    // If null (e.g., selection dropped due to option list changes), don't wipe chips while open.
    if (value === null) return;

    const next = Array.isArray(value) ? (value as readonly T[]) : ([value as T] as const);

    // Replace selection from listbox (source of truth)
    this.multi.value.set([...next] as readonly T[]);

    // chips UX: clear the query after selection changes
    this.multi.query.set('');
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
export class TngMultiAutocompleteOption<T = unknown> {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-option' as const;
}