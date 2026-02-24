import { Directive, HostBinding, HostListener, inject } from '@angular/core';
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';
import { TNG_SELECT } from './tng-select.tokens';
import type { TngSelect } from './tng-select';

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

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-listbox' = 'select-listbox';

  @HostListener('valueChange', ['$event'])
  protected onListboxValueChange(value: T | readonly T[] | null): void {
    if (this.select.disabled()) return;

    const next =
      value === null ? null : Array.isArray(value) ? (value[0] ?? null) : value;

    // ✅ if nothing changed, do nothing (prevents "open → close" loops)
    if (Object.is(next, this.select.value())) return;

    // ✅ when closed, just sync value — DON'T close (already closed)
    if (!this.select.open()) {
      this.select.value.set(next as T | null);
      return;
    }

    // ✅ when open, treat valueChange as "commit" and close
    if (next === null) {
      this.select.value.set(null);
      this.select.close();
      return;
    }

    this.select.selectValue(next); // sets value + closes
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