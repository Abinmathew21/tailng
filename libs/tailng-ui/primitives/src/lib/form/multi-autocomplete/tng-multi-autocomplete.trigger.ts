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
  selector: '[tngMultiAutocompleteTrigger]',
  exportAs: 'tngMultiAutocompleteTrigger',
  standalone: true,
})
export class TngMultiAutocompleteTrigger {
  private readonly multi = inject<TngMultiAutocomplete>(TNG_MULTI_AUTOCOMPLETE);
  private readonly el = inject(ElementRef<HTMLInputElement>);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-trigger' as const;

  @HostListener('input', ['$event'])
  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    this.multi.query.set(value);
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    // ✅ Backspace removes last chip when input empty (common chips UX)
    if (event.key === 'Backspace') {
      if (this.multi.disabled()) return;

      const inputValue = this.el.nativeElement.value ?? '';
      const hasText = inputValue.length > 0;
      if (hasText) return;

      const selected = this.multi.value();
      if (selected.length === 0) return;

      event.preventDefault();
      event.stopPropagation();
      this.multi.removeLast();
    }
  }
}