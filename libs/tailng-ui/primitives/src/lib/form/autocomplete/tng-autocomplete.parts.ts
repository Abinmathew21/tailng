import { DestroyRef, Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import { ensureActiveAndSync, handleComboboxKeydown } from '../../internal/combobox';
import type { TngAutocomplete } from './tng-autocomplete';
import { TNG_AUTOCOMPLETE } from './tng-autocomplete.tokens';
import type { TngAutocompleteListboxApi } from './tng-autocomplete.listbox.types';

/** Keys that open autocomplete when closed. ArrowDown/Up + Backspace/Delete (user editing clears selection). */
const AUTOCOMPLETE_KEYS_TO_OPEN = ['ArrowDown', 'ArrowUp', 'Backspace', 'Delete'] as const;

@Directive({
  selector: '[tngAutocompleteTrigger]',
  exportAs: 'tngAutocompleteTrigger',
  standalone: true,
})
export class TngAutocompleteTrigger {
  private readonly autocomplete = inject<TngAutocomplete>(TNG_AUTOCOMPLETE);
  private readonly el = inject(ElementRef<HTMLElement>);

  private get listbox(): TngAutocompleteListboxApi | null {
    return this.autocomplete.getListboxApi();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'autocomplete-trigger' as const;

  @HostBinding('attr.role')
  protected readonly role = 'combobox' as const;

  @HostBinding('attr.aria-haspopup')
  protected readonly haspopup = 'listbox' as const;

  @HostBinding('attr.aria-expanded')
  protected get ariaExpanded(): 'true' | 'false' {
    return this.autocomplete.open() ? 'true' : 'false';
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.autocomplete.disabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    if (!this.autocomplete.open()) return null;
    return this.autocomplete.getContentId() ?? this.autocomplete.getListboxId();
  }

  @HostBinding('attr.aria-activedescendant')
  protected get ariaActiveDescendant(): string | null {
    if (!this.autocomplete.open()) return null;
    if (this.listbox) return this.listbox.getActiveId();
    return this.autocomplete.getActiveDescendantId();
  }

  @HostBinding('attr.aria-invalid')
  protected get ariaInvalid(): 'true' | null {
    return this.autocomplete.invalid() ? 'true' : null;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledby(): string | null {
    const node = this.el.nativeElement;
    if (node.hasAttribute('aria-label')) return null;
    return this.autocomplete.labelId();
  }

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedby(): string | null {
    const ids: string[] = [];
    const desc = this.autocomplete.descriptionId();
    if (desc) ids.push(desc);
    if (this.autocomplete.invalid()) {
      const err = this.autocomplete.errorId();
      if (err) ids.push(err);
    }
    return ids.length ? ids.join(' ') : null;
  }

  @HostListener('focus')
  protected onFocus(): void {
    if (this.autocomplete.disabled()) return;
    if (this.autocomplete._restoringFocus) return;
    if (!this.autocomplete.open()) {
      this.autocomplete.openSelect();

      // ✅ Emit empty query (or current query) on open-on-focus.
      // This is the behavior your test expects.
      const q = this.autocomplete.query();
      this.autocomplete.queryChange.emit(q);
      
      ensureActiveAndSync(this.listbox, (id) => this.autocomplete.setActiveDescendantId(id));
    }
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    // Free-form create: Enter (only) with no active option → emit create, close.
    // Space is NOT used here so it can insert into input for typing (e.g. "United St").
    if (
      event.key === 'Enter' &&
      this.autocomplete.open() &&
      !this.autocomplete.disabled() &&
      this.autocomplete.allowCreate() &&
      !this.autocomplete.strict()
    ) {
      const hasActive = this.listbox?.getActiveId() != null;
      if (!hasActive) {
        event.preventDefault();
        event.stopPropagation();
        const query = (this.el.nativeElement as HTMLInputElement)?.value ?? '';
        this.autocomplete._createJustEmitted = true;
        this.autocomplete.create.emit({ query });
        queueMicrotask(() => this.autocomplete.close());
        return;
      }
    }

    // When closed, typeable keys (a-z, 0-9, etc.) open overlay without preventDefault so input receives the char
    if (
      !this.autocomplete.open() &&
      !this.autocomplete.disabled() &&
      event.key.length === 1 &&
      event.key !== ' ' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !['Tab', 'Escape', 'Enter'].includes(event.key)
    ) {
      this.autocomplete.openSelect();
      ensureActiveAndSync(this.listbox, (id) => this.autocomplete.setActiveDescendantId(id));
      return;
    }

    handleComboboxKeydown(event, {
      disabled: this.autocomplete.disabled(),
      open: this.autocomplete.open(),
      openSelect: () => this.autocomplete.openSelect(),
      close: () => this.autocomplete.close(),
      listbox: this.listbox,
      setActiveDescendantId: (id) => this.autocomplete.setActiveDescendantId(id),
    }, {
      enableTypeahead: false,
      keysToOpen: AUTOCOMPLETE_KEYS_TO_OPEN,
      keysToOpenNoPreventDefault: ['Backspace', 'Delete'],
      spaceCommits: false, // Space inserts into input for typing (e.g. "United St" for filtering)
    });
  }

  @HostListener('input', ['$event'])
  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.autocomplete.query.set(value);
    this.autocomplete.queryChange.emit(value);
  }
}

/** Wrapper for trigger + optional icon. When present, overlay uses this for width/position (full control width). */
@Directive({
  selector: '[tngAutocompleteTriggerContainer]',
  exportAs: 'tngAutocompleteTriggerContainer',
  standalone: true,
})
export class TngAutocompleteTriggerContainer {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'autocomplete-trigger-container' as const;
}

/** Slot for an icon (e.g. chevron) beside the trigger. Consumer provides markup. Matches Select's tngSelectIcon. */
@Directive({
  selector: '[tngAutocompleteIcon]',
  exportAs: 'tngAutocompleteIcon',
  standalone: true,
})
export class TngAutocompleteIcon {
  private readonly autocomplete = inject<TngAutocomplete>(TNG_AUTOCOMPLETE);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'autocomplete-icon' as const;

  @HostListener('click')
  protected onClick(): void {
    if (this.autocomplete.disabled()) return;
    const trigger = this.autocomplete.hostElement.querySelector(
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLElement | null;
    trigger?.focus();
  }
}

const createContentId = createTngIdFactory('tng-autocomplete-content');

@Directive({
  selector: '[tngAutocompleteContent]',
  exportAs: 'tngAutocompleteContent',
  standalone: true,
})
export class TngAutocompleteContent {
  private readonly autocomplete = inject<TngAutocomplete>(TNG_AUTOCOMPLETE);
  private readonly destroyRef = inject(DestroyRef);

  @HostBinding('attr.id')
  readonly id = createContentId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'autocomplete-content' as const;

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.autocomplete.open() ? null : '';
  }

  @HostBinding('attr.aria-busy')
  protected get ariaBusy(): 'true' | null {
    return this.autocomplete.loading() ? 'true' : null;
  }

  constructor() {
    this.autocomplete.setContentId(this.id);
    this.destroyRef.onDestroy(() => {
      if (this.autocomplete.getContentId() === this.id) {
        this.autocomplete.setContentId(null);
      }
    });
  }
}
