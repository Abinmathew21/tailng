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

const NAV_KEYS = new Set(['ArrowDown', 'ArrowUp'] as const);

@Directive({
  selector: '[tngMultiAutocompleteTrigger]',
  exportAs: 'tngMultiAutocompleteTrigger',
})
export class TngMultiAutocompleteTrigger {
  private readonly multi = inject<TngMultiAutocomplete>(TNG_MULTI_AUTOCOMPLETE);
  private readonly el = inject(ElementRef<HTMLInputElement>);

  private readonly injectedListbox =
    inject<TngMultiAutocompleteListboxApi>(TNG_MULTI_AUTOCOMPLETE_LISTBOX, {
      optional: true,
    });

  private get listbox(): TngMultiAutocompleteListboxApi | null {
    return this.multi.getListboxApi() ?? this.injectedListbox ?? null;
  }

  private composing = false;
  private lastEmittedQuery: string | null = null;

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
    return this.listbox?.activeId?.() ?? this.multi.getActiveDescendantId();
  }

  @HostListener('focus')
  protected onFocus(): void {
    if (this.multi.disabled()) return;

    if (!this.multi.open()) {
      this.multi.openSelect();

      const q = this.el.nativeElement.value ?? '';
      this.multi.query.set(q);

      this.lastEmittedQuery = q;
      this.multi.queryChange.emit(q);

      this.listbox?.ensureActive('first');
    }
  }

  @HostListener('input', ['$event'])
  protected onInput(event: Event): void {
    if (this.multi.disabled()) return;

    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    this.multi.query.set(value);

    // Policy A: do not emit during IME composition
    if (this.composing) return;

    // Avoid double-emit (e.g., compositionend followed by input)
    if (this.lastEmittedQuery === value) return;

    this.lastEmittedQuery = value;
    this.multi.queryChange.emit(value);
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (this.multi.disabled()) return;

    // Tab should leave the widget and close any open overlay.
    if (event.key === 'Tab') {
      if (this.multi.open()) {
        this.multi.close();
      }
      return;
    }

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

    // ArrowLeft on input at caret-start → focus last chip (chips UX loop)
    if (event.key === 'ArrowLeft') {
      const input = this.el.nativeElement;

      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;

      // Only when caret is at the beginning and there's no selection range.
      if (start === 0 && end === 0) {
        const chips = Array.from(
          this.multi.hostElement.querySelectorAll('[data-slot="multi-autocomplete-chip"]'),
        ) as HTMLElement[];

        const lastChip = chips[chips.length - 1] ?? null;
        if (lastChip) {
          event.preventDefault();
          event.stopPropagation();
          lastChip.focus();
        }
      }

      return;
    }

    // Home / End
    // Home
    if (event.key === 'Home') {
      const input = this.el.nativeElement;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;

      // Chip UX has priority over listbox navigation
      if (start === 0 && end === 0) {
        const chips = Array.from(
          this.multi.hostElement.querySelectorAll('[data-slot="multi-autocomplete-chip"]'),
        ) as HTMLElement[];

        const firstChip = chips[0] ?? null;
        if (firstChip) {
          event.preventDefault();
          event.stopPropagation();
          firstChip.focus();
          return;
        }
      }

      // Otherwise delegate to listbox when open
      if (this.multi.open()) {
        const handled = this.listbox?.handleKey(event.key, event.shiftKey);
        if (handled) {
          event.preventDefault();
          event.stopPropagation();
        }
      }

      return;
    }

    // End
    if (event.key === 'End') {
      // When open → delegate to listbox
      if (this.multi.open()) {
        const handled = this.listbox?.handleKey(event.key, event.shiftKey);
        if (handled) {
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }

      // When closed → let browser move caret
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

  @HostListener('focusout', ['$event'])
  protected onFocusOut(event: FocusEvent): void {
    if (!this.multi.open()) return;

    const next = event.relatedTarget as Node | null;
    if (next && this.multi.hostElement.contains(next)) {
      return;
    }

    // Some focus transitions report null relatedTarget. Re-check after DOM focus settles.
    queueMicrotask(() => {
      const active = this.el.nativeElement.ownerDocument.activeElement;
      if (active && this.multi.hostElement.contains(active)) {
        return;
      }

      this.multi.close();
    });
  }

  @HostListener('compositionstart')
  protected onCompositionStart(): void {
    this.composing = true;
  }

  @HostListener('compositionend')
  protected onCompositionEnd(): void {
    this.composing = false;

    if (this.multi.disabled()) return;

    // Policy A: emit once with the final committed value
    const q = this.el.nativeElement.value ?? '';
    this.multi.query.set(q);

    if (this.lastEmittedQuery !== q) {
      this.lastEmittedQuery = q;
      this.multi.queryChange.emit(q);
    }
  }

}
