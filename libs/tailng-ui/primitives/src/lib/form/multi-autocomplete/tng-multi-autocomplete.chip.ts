import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
} from '@angular/core';

import { TNG_MULTI_AUTOCOMPLETE } from './tng-multi-autocomplete.tokens';
import type { TngMultiAutocomplete } from './tng-multi-autocomplete';

@Directive({
  selector: '[tngMultiAutocompleteChip]',
  exportAs: 'tngMultiAutocompleteChip',
  standalone: true,
})
export class TngMultiAutocompleteChip<T = unknown> {
  private readonly multi = inject<TngMultiAutocomplete<T>>(TNG_MULTI_AUTOCOMPLETE);
  private readonly el = inject(ElementRef<HTMLElement>);

  /** The value represented by this chip (needed for Delete/Backspace remove). */
  readonly tngValue = input<T | null>(null);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-chip' as const;

  @HostBinding('attr.tabindex')
  protected readonly tabIndex = -1;

  focus(): void {
    this.el.nativeElement.focus();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const host = this.multi.hostElement;

    const chips = Array.from(
      host.querySelectorAll('[data-slot="multi-autocomplete-chip"]'),
    ) as HTMLElement[];

    const currentIndex = chips.indexOf(this.el.nativeElement);
    if (currentIndex < 0) return;

    // ArrowLeft → previous chip (if any)
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      const prev = chips[currentIndex - 1];
      prev?.focus();
      return;
    }

    // ArrowRight → next chip else input trigger
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();

      const next = chips[currentIndex + 1];
      if (next) {
        next.focus();
        return;
      }

      const input = host.querySelector('[data-slot="multi-autocomplete-trigger"]') as HTMLElement | null;
      input?.focus();
      return;
    }

    // Delete / Backspace → remove this chip value
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (this.multi.disabled()) return;

      const v = this.tngValue();
      if (v == null) return;

      event.preventDefault();
      event.stopPropagation();

      // Choose next focus target *before* removing
      const prev = chips[currentIndex - 1] ?? null;
      const next = chips[currentIndex + 1] ?? null;
      const input = host.querySelector('[data-slot="multi-autocomplete-trigger"]') as HTMLElement | null;

      // remove selected value
      this.multi.remove(v);

      // focus after DOM updates
      queueMicrotask(() => {
        (prev ?? next ?? input)?.focus?.();
      });

      return;
    }

    // Home → first chip
    if (event.key === 'Home') {
      event.preventDefault();
      event.stopPropagation();

      const first = chips[0] ?? null;
      first?.focus();
      return;
    }

    // End → last chip (if any) else input trigger
        // End → input trigger (jump out of chips)
    if (event.key === 'End') {
      event.preventDefault();
      event.stopPropagation();

      const input = host.querySelector(
        '[data-slot="multi-autocomplete-trigger"]',
      ) as HTMLElement | null;

      input?.focus();
      return;
    }
  }
}