import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';

import type { TngMultiAutocomplete } from './tng-multi-autocomplete';
import { TNG_MULTI_AUTOCOMPLETE } from './tng-multi-autocomplete.tokens';
import { TNG_MULTI_AUTOCOMPLETE_LISTBOX } from './tng-multi-autocomplete.listbox.tokens';
import type { TngMultiAutocompleteListboxApi } from './tng-multi-autocomplete.listbox.types';

const NAV_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End'] as const);

@Directive({
  selector: '[tngMultiAutocompleteTrigger]',
  exportAs: 'tngMultiAutocompleteTrigger',
  standalone: true,
})
export class TngMultiAutocompleteTrigger {
  private readonly multi = inject<TngMultiAutocomplete>(TNG_MULTI_AUTOCOMPLETE);
  private readonly el = inject(ElementRef<HTMLInputElement>);

  private readonly listbox =
    inject<TngMultiAutocompleteListboxApi>(TNG_MULTI_AUTOCOMPLETE_LISTBOX, {
      optional: true,
    });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-trigger' as const;

  @HostBinding('attr.role')
  protected readonly role = 'combobox' as const;

  @HostBinding('attr.aria-haspopup')
  protected readonly haspopup = 'listbox' as const;

  @HostBinding('attr.aria-expanded')
  protected get ariaExpanded(): 'true' | 'false' {
    return this.multi.open() ? 'true' : 'false';
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.multi.disabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    if (!this.multi.open()) return null;
    return this.multi.getContentId() ?? this.multi.getListboxId();
  }

  @HostBinding('attr.aria-activedescendant')
  protected get ariaActiveDescendant(): string | null {
    if (!this.multi.open()) return null;
    return this.listbox?.getActiveId() ?? this.multi.getActiveDescendantId();
  }

  @HostListener('focus')
  protected onFocus(): void {
    if (this.multi.disabled()) return;

    if (!this.multi.open()) {
      this.multi.openSelect();

      // ✅ emit current query when opening (often empty, but supports prefilled cases)
      this.multi.queryChange.emit(this.multi.query());

      this.listbox?.ensureActive('first');
    }
  }

  @HostListener('input', ['$event'])
  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    this.multi.query.set(value);

    // ✅ emit on typing
    this.multi.queryChange.emit(value);
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (this.multi.disabled()) return;

    // Escape closes overlay (no selection changes)
    if (event.key === 'Escape') {
      if (this.multi.open()) {
        event.preventDefault();
        event.stopPropagation();
        this.multi.close();
      }
      return;
    }

    // Backspace removes last chip when input is empty
    if (event.key === 'Backspace') {
      const inputValue = this.el.nativeElement.value ?? '';
      if (inputValue.length > 0) return;

      const selected = this.multi.value();
      if (selected.length === 0) return;

      event.preventDefault();
      event.stopPropagation();
      this.multi.removeLast();
      return;
    }

    // Enter commits active option (toggle) and stays open
    if (event.key === 'Enter') {
      if (!this.multi.open()) return;
      if (!this.listbox) return;

      event.preventDefault();
      event.stopPropagation();
      this.listbox.commitActive();
      return;
    }

    // ArrowLeft from input → focus last chip if input empty
    if (event.key === 'ArrowLeft') {
      const inputValue = this.el.nativeElement.value ?? '';
      if (inputValue.length > 0) return;

      const chips = this.multi.hostElement.querySelectorAll(
        '[data-slot="multi-autocomplete-chip"]'
      );

      if (chips.length === 0) return;

      event.preventDefault();
      event.stopPropagation();

      (chips[chips.length - 1] as HTMLElement).focus();
      return;
    }

    // Navigation keys
    if (NAV_KEYS.has(event.key as any)) {
      if (!this.multi.open()) {
        event.preventDefault();
        event.stopPropagation();

        this.multi.openSelect();
        if (event.key === 'ArrowUp' || event.key === 'End') {
          this.listbox?.ensureActive('last');
        } else {
          this.listbox?.ensureActive('first');
        }
        return;
      }

      if (this.listbox) {
        const handled = this.listbox.handleKey(event.key, event.shiftKey);
        if (handled) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
      return;
    }

    // printable keys are NOT prevented (input stays editable)
  }
}