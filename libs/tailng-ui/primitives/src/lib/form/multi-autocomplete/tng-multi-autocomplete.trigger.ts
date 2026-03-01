import { Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';
import type { TngMultiAutocompleteListboxApi } from './tng-multi-autocomplete.listbox.types';
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

  private get listbox(): TngMultiAutocompleteListboxApi<unknown> | null {
    return this.multi.getListboxApi();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-trigger' as const;

  @HostListener('focus')
  protected onFocus(): void {
    if (this.multi.disabled()) return;
    if (!this.multi.open()) {
      this.multi.openSelect();
      this.listbox?.ensureActive('first');
    }
  }

  @HostListener('input', ['$event'])
  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    this.multi.query.set(value);

    // typing should open (chips UX: always searchable)
    if (!this.multi.disabled() && !this.multi.open()) {
      this.multi.openSelect();
      this.listbox?.ensureActive('first');
    }
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    // ✅ Backspace removes last chip when input empty (common chips UX)
    if (event.key === 'Backspace') {
      if (this.multi.disabled()) return;

      const inputValue = this.el.nativeElement.value ?? '';
      if (inputValue.length > 0) return;

      const selected = this.multi.value();
      if (selected.length === 0) return;

      event.preventDefault();
      event.stopPropagation();
      this.multi.removeLast();
      return;
    }

    // (Next step later): ArrowDown/Up navigation + Enter commitActive.
  }
}