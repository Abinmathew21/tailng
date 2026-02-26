import { DestroyRef, Directive, effect, HostBinding, HostListener, inject, untracked } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import {
  arraysEqual,
  normalizeToArray,
  normalizeToSingle,
} from '../../internal/combobox';
import type { ListboxValue } from '../listbox/listbox.directive';
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';
import { TNG_SELECT } from './tng-select.tokens';
import type { TngSelect } from './tng-select';
import { TngSelectListboxApi } from './tng-select.listbox.types';
import { TNG_SELECT_LISTBOX } from './tng-select.listbox.tokens';

const createListboxId = createTngIdFactory('tng-select-listbox');
@Directive({
  selector: '[tngSelectListbox]',
  standalone: true,
  providers: [{ provide: TNG_SELECT_LISTBOX, useExisting: TngSelectListbox }],
  hostDirectives: [
    {
      directive: TngListboxDirective,
      inputs: ['orientation', 'direction', 'disabled', 'loop', 'value', 'multiple'],
      outputs: ['valueChange'],
    },
  ],
})
export class TngSelectListbox<T = unknown> implements TngSelectListboxApi<T> {
  private readonly select = inject<TngSelect<T>>(TNG_SELECT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly listbox = inject(TngListboxDirective<T>, { self: true });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-listbox' = 'select-listbox';

  @HostBinding('attr.id')
  protected readonly id = createListboxId();

  constructor() {
    // register id
    this.select.setListboxId(this.id);

    // register API into select (Mode-2 bridge)
    this.select.setListboxApi(this);

    // controlled sync from Select -> Listbox
    effect(() => {
      const v = this.select.value();
      const isMulti = this.select.multiple();

      // avoid interfering during open interactions
      if (this.select.open()) return;

      const current = untracked(this.listbox.value);
      if (isMulti) {
        const arrV = normalizeToArray(v);
        const arrCur = normalizeToArray(current);
        if (arraysEqual(arrV, arrCur)) return;
        this.listbox.value.set(arrV as ListboxValue<T>);
      } else {
        const currentSingle = normalizeToSingle(current);
        if (Object.is(currentSingle, v)) return;
        this.listbox.value.set(v as T | null);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.select.setListboxId(null);
      this.select.setListboxApi(null);
    });
  }

  // ---------------- API ----------------

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

  commitActive(): void {
    if (this.select.multiple()) {
      this.listbox.handleKeyFromCombobox('Enter');
      return;
    }
    const value = this.listbox.getActiveValue();
    if (value === undefined) return;
    this.select.selectValue(value as T);
  }

  // ------------- selection sync -------------

  @HostListener('valueChange', ['$event'])
  protected onListboxValueChange(value: T | readonly T[] | null): void {
    if (this.select.disabled()) return;

    const isMulti = this.select.multiple();

    if (isMulti) {
      const next = normalizeToArray(value);
      const cur = normalizeToArray(this.select.value());
      if (arraysEqual(next, cur)) return;
      this.select.value.set(next);
      // multi-select: do not close on selection
      return;
    }

    const next = normalizeToSingle(value);
    if (Object.is(next, this.select.value())) return;

    if (!this.select.open()) {
      this.select.value.set(next as T | null);
      return;
    }

    if (next === null) {
      this.select.value.set(null);
      this.select.close();
      return;
    }

    this.select.selectValue(next);
  }
}

@Directive({
  selector: '[tngSelectOption]',
  standalone: true,
  hostDirectives: [
    {
      directive: TngOptionDirective,
      inputs: ['tngValue', 'disabled'],
    },
  ],
})
export class TngSelectOption<T> {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-option' = 'select-option';
}