import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';

import { TNG_MULTI_AUTOCOMPLETE } from './tng-multi-autocomplete.tokens';
import type { TngMultiAutocomplete } from './tng-multi-autocomplete';

@Directive({
  selector: '[tngMultiAutocompleteChip]',
  exportAs: 'tngMultiAutocompleteChip',
  standalone: true,
})
export class TngMultiAutocompleteChip<T = unknown> {
  private readonly multi =
    inject<TngMultiAutocomplete<T>>(TNG_MULTI_AUTOCOMPLETE);
  private readonly el = inject(ElementRef<HTMLElement>);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-chip' as const;

  @HostBinding('attr.tabindex')
  protected readonly tabIndex = -1;

  focus(): void {
    this.el.nativeElement.focus();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const chips = this.multi.hostElement.querySelectorAll(
      '[data-slot="multi-autocomplete-chip"]'
    );

    const currentIndex = Array.from(chips).indexOf(
      this.el.nativeElement
    );

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();

      if (currentIndex > 0) {
        (chips[currentIndex - 1] as HTMLElement).focus();
      }
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();

      if (currentIndex < chips.length - 1) {
        (chips[currentIndex + 1] as HTMLElement).focus();
      } else {
        // last chip → go back to input
        const input = this.multi.hostElement.querySelector(
          '[data-slot="multi-autocomplete-trigger"]'
        ) as HTMLElement | null;

        input?.focus();
      }
    }
  }
}