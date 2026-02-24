import { DestroyRef, Directive, HostBinding, HostListener, inject } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';
import { TNG_SELECT } from './tng-select.tokens';
import type { TngSelect } from './tng-select';

const createListboxId = createTngIdFactory('tng-select-listbox');

@Directive({
  selector: '[tngSelectListbox]',
  standalone: true,
  hostDirectives: [
    {
      directive: TngListboxDirective,
      inputs: ['orientation', 'direction', 'disabled', 'loop', 'value'],
      outputs: ['valueChange'],
    },
  ],
})
export class TngSelectListbox<T> {
  private readonly select = inject<TngSelect<T>>(TNG_SELECT);
  private readonly destroyRef = inject(DestroyRef);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-listbox' = 'select-listbox';

  @HostBinding('attr.id')
  protected readonly id = createListboxId();

  constructor() {
    // register listbox id so trigger can set aria-controls
    this.select.setListboxId(this.id);

    this.destroyRef.onDestroy(() => {
      this.select.setListboxId(null);
    });
  }

  @HostListener('valueChange', ['$event'])
  protected onListboxValueChange(value: T | readonly T[] | null): void {
    if (this.select.disabled()) return;

    const next =
      value === null ? null : Array.isArray(value) ? (value[0] ?? null) : value;

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