// libs/tailng-ui/primitives/src/lib/form/multi-autocomplete/tng-multi-autocomplete.listbox.ts
import {
  DestroyRef,
  Directive,
  HostBinding,
  HostListener,
  effect,
  inject,
  untracked,
} from '@angular/core';

import { createTngIdFactory } from '@tailng-ui/cdk';
import {
  TNG_LISTBOX_FORCE_TYPEAHEAD,
  TNG_LISTBOX_FORCE_MULTIPLE,
  TNG_LISTBOX_PRESERVE_VALUE_ON_UNREGISTER,
  TngListboxDirective,
  TngOptionDirective,
} from '@tailng-ui/primitives';

import { TNG_MULTI_AUTOCOMPLETE } from './tng-multi-autocomplete.tokens';
import type { TngMultiAutocomplete } from './tng-multi-autocomplete';
import { TNG_MULTI_AUTOCOMPLETE_LISTBOX } from './tng-multi-autocomplete.listbox.tokens';
import type { TngMultiAutocompleteListboxApi } from './tng-multi-autocomplete.listbox.types';

const createListboxId = createTngIdFactory('tng-multi-autocomplete-listbox');

@Directive({
  selector: '[tngMultiAutocompleteListbox]',
  providers: [
    { provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useExisting: TngMultiAutocompleteListbox },
    // Multi-autocomplete typing happens in the input. Listbox must NOT typeahead.
    { provide: TNG_LISTBOX_FORCE_TYPEAHEAD, useValue: false },
    { provide: TNG_LISTBOX_FORCE_MULTIPLE, useValue: true },
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

    // External multi.value -> listbox.value (keeps selection UI in sync)
    effect(() => {
      const v = this.multi.value(); // readonly T[]
      const current = untracked(() => this.listbox.value()); // ListboxValue<T>
      const currentArr = Array.isArray(current)
        ? (current as readonly T[])
        : current === null
          ? ([] as readonly T[])
          : ([current as T] as const);

      // compare by order + Object.is (good enough for now)
      if (
        currentArr.length === v.length &&
        v.every((val, i) => Object.is(val, currentArr[i]))
      ) {
        return;
      }

      this.listbox.value.set([...v] as readonly T[]);

      // External controlled value changes while closed should reset filtering state.
      if (!this.multi.open()) {
        this.multi.query.set('');
        this.multi.queryChange.emit('');
      }
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
    this.multi.toggle(value as T);
    this.listbox.setActiveId(null);
    this.multi.query.set('');
    this.multi.queryChange.emit('');
  }

  @HostListener('valueChange', ['$event'])
  protected onListboxValueChange(value: T | readonly T[] | null): void {
    if (this.multi.disabled()) return;

    const arr = value === null ? [] : Array.isArray(value) ? value : [value];

    // Option unregister/re-register during filtering can cause listbox to emit a fresh
    // array instance even when the logical selection did not change. Treat that as a
    // no-op so typing does not clear the controlled query.
    const current = this.multi.value();
    if (
      current.length === arr.length &&
      arr.every((val, i) => Object.is(val, current[i]))
    ) {
      return;
    }

    this.multi.value.set([...arr] as readonly T[]);
    this.listbox.setActiveId(null);
    this.multi.query.set('');
    this.multi.queryChange.emit('');
  }

  getValue?(): readonly T[] {
    const v = this.listbox.value();
    if (v === null) return [];
    return Array.isArray(v) ? (v as readonly T[]) : ([v as T] as const);
  }
}

@Directive({
  selector: '[tngMultiAutocompleteOption]',
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
