import { DestroyRef, Directive, effect, HostBinding, HostListener, inject, untracked } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import { TngListboxDirective } from '../listbox/listbox.directive';
import { TngOptionDirective } from '../listbox/option.directive';
import {
  TNG_LISTBOX_FORCE_TYPEAHEAD,
  TNG_LISTBOX_PRESERVE_VALUE_ON_UNREGISTER,
} from '../listbox/tokens';
import { normalizeToSingle } from '../../internal/combobox';
import type { TngAutocomplete } from './tng-autocomplete';
import { TNG_AUTOCOMPLETE_LISTBOX } from './tng-autocomplete.listbox.tokens';
import { TngAutocompleteListboxApi } from './tng-autocomplete.listbox.types';
import { TNG_AUTOCOMPLETE } from './tng-autocomplete.tokens';

const createListboxId = createTngIdFactory('tng-autocomplete-listbox');

@Directive({
  selector: '[tngAutocompleteListbox]',
  providers: [
    { provide: TNG_AUTOCOMPLETE_LISTBOX, useExisting: TngAutocompleteListbox },
    { provide: TNG_LISTBOX_FORCE_TYPEAHEAD, useValue: false },
    { provide: TNG_LISTBOX_PRESERVE_VALUE_ON_UNREGISTER, useValue: true },
  ],
  hostDirectives: [
    {
      directive: TngListboxDirective,
      inputs: ['orientation', 'direction', 'disabled', 'loop', 'value'],
      outputs: ['valueChange'],
    },
  ],
})
export class TngAutocompleteListbox<T = unknown> implements TngAutocompleteListboxApi {
  private readonly autocomplete = inject<TngAutocomplete<T>>(TNG_AUTOCOMPLETE);
  private readonly destroyRef = inject(DestroyRef);
  private readonly listbox = inject(TngListboxDirective<T>, { self: true });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'autocomplete-listbox' as const;

  @HostBinding('attr.id')
  protected readonly id = createListboxId();

  constructor() {
    this.autocomplete.setListboxId(this.id);
    this.autocomplete.setListboxApi(this);

    effect(() => {
      const v = this.autocomplete.value();
      if (this.autocomplete.open()) return;

      if (this.autocomplete._createJustEmitted) {
        this.autocomplete._createJustEmitted = false;
        return;
      }

      const current = untracked(this.listbox.value);
      const currentSingle = normalizeToSingle(current);
      if (Object.is(currentSingle, v)) return;
      this.listbox.value.set(v as T | null);
    });

    this.destroyRef.onDestroy(() => {
      this.autocomplete.setListboxId(null);
      this.autocomplete.setListboxApi(null);
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
    this.autocomplete.selectValue(value as T);
  }

  @HostListener('valueChange', ['$event'])
  protected onListboxValueChange(value: T | readonly T[] | null): void {
    if (this.autocomplete.disabled()) return;

    const next = normalizeToSingle(value);
    if (Object.is(next, this.autocomplete.value())) {
      if (this.autocomplete.open() && next !== null) {
        this.autocomplete.selectValue(next as T);
      }
      return;
    }

    if (!this.autocomplete.open()) {
      this.autocomplete.value.set(next as T | null);
      return;
    }

    if (next === null) {
      // When overlay is open, null usually means the previous selection dropped out of
      // filtered options (user is typing to filter). Preserve value and stay open.
      return;
    }

    this.autocomplete.selectValue(next);
  }
}

@Directive({
  selector: '[tngAutocompleteOption]',
  hostDirectives: [
    {
      directive: TngOptionDirective,
      inputs: ['tngValue', 'disabled'],
    },
  ],
})
export class TngAutocompleteOption<T> {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'autocomplete-option' as const;
}
