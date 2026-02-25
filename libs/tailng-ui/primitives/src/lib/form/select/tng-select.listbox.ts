import { DestroyRef, Directive, effect, HostBinding, HostListener, inject, untracked } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
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
        const arrV: readonly T[] | null = v === null ? null : (Array.isArray(v) ? v : [v]) as readonly T[] | null;
        const arrCur = current === null ? null : Array.isArray(current) ? current : [current];
        if (
          arrV === null && arrCur === null ||
          arrV !== null && arrCur !== null &&
          arrV.length === arrCur.length &&
          arrV.every((x, i) => Object.is(x, arrCur[i]))
        ) return;
        this.listbox.value.set(arrV as ListboxValue<T>);
      } else {
        const currentSingle =
          current === null ? null : Array.isArray(current) ? (current[0] ?? null) : current;
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
      const next: readonly T[] | null = (value === null ? null : Array.isArray(value) ? value : [value]) as readonly T[] | null;
      const cur = this.select.value();
      if (
        next === null && cur === null ||
        next !== null && cur !== null && Array.isArray(cur) &&
        next.length === cur.length && next.every((x, i) => Object.is(x, cur[i]))
      ) return;
      this.select.value.set(next);
      // multi-select: do not close on selection
      return;
    }

    const next = value === null ? null : Array.isArray(value) ? (value[0] ?? null) : value;
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