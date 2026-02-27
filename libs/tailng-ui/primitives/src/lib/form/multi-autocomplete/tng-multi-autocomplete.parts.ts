import { DestroyRef, Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import { ensureActiveAndSync, handleComboboxKeydown } from '../../internal/combobox';
import type { TngMultiAutocomplete } from './tng-multi-autocomplete';
import { TNG_MULTI_AUTOCOMPLETE } from './tng-multi-autocomplete.tokens';
import type { TngMultiAutocompleteListboxApi } from './tng-multi-autocomplete.listbox.types';

/** Keys that open multi-autocomplete when closed. */
const MULTI_AUTOCOMPLETE_KEYS_TO_OPEN = ['ArrowDown', 'ArrowUp', 'Backspace', 'Delete'] as const;

@Directive({
  selector: '[tngMultiAutocompleteTrigger]',
  exportAs: 'tngMultiAutocompleteTrigger',
  standalone: true,
})
export class TngMultiAutocompleteTrigger {
  private readonly multiAutocomplete = inject<TngMultiAutocomplete>(TNG_MULTI_AUTOCOMPLETE);
  private readonly el = inject(ElementRef<HTMLElement>);

  private get listbox(): TngMultiAutocompleteListboxApi<unknown> | null {
    return this.multiAutocomplete.getListboxApi();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-trigger' as const;

  @HostBinding('attr.role')
  protected readonly role = 'combobox' as const;

  @HostBinding('attr.aria-haspopup')
  protected readonly haspopup = 'listbox' as const;

  @HostBinding('attr.aria-expanded')
  protected get ariaExpanded(): 'true' | 'false' {
    return this.multiAutocomplete.open() ? 'true' : 'false';
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.multiAutocomplete.disabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    if (!this.multiAutocomplete.open()) return null;
    return this.multiAutocomplete.getContentId() ?? this.multiAutocomplete.getListboxId();
  }

  @HostBinding('attr.aria-activedescendant')
  protected get ariaActiveDescendant(): string | null {
    if (!this.multiAutocomplete.open()) return null;
    if (this.listbox) return this.listbox.getActiveId();
    return this.multiAutocomplete.getActiveDescendantId();
  }

  @HostBinding('attr.aria-invalid')
  protected get ariaInvalid(): 'true' | null {
    return this.multiAutocomplete.invalid() ? 'true' : null;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledby(): string | null {
    const node = this.el.nativeElement;
    if (node.hasAttribute('aria-label')) return null;
    return this.multiAutocomplete.labelId();
  }

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedby(): string | null {
    const ids: string[] = [];
    const desc = this.multiAutocomplete.descriptionId();
    if (desc) ids.push(desc);
    if (this.multiAutocomplete.invalid()) {
      const err = this.multiAutocomplete.errorId();
      if (err) ids.push(err);
    }
    return ids.length ? ids.join(' ') : null;
  }

  @HostListener('focus')
  protected onFocus(): void {
    if (this.multiAutocomplete.disabled()) return;
    if (this.multiAutocomplete._restoringFocus) return;
    if (!this.multiAutocomplete.open()) {
      this.multiAutocomplete.openSelect();
      ensureActiveAndSync(this.listbox, (id) => this.multiAutocomplete.setActiveDescendantId(id));
    }
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    // Free-form create: Enter with no active option → emit create, close.
    if (
      event.key === 'Enter' &&
      this.multiAutocomplete.open() &&
      !this.multiAutocomplete.disabled() &&
      this.multiAutocomplete.allowCreate() &&
      !this.multiAutocomplete.strict()
    ) {
      const hasActive = this.listbox?.getActiveId() != null;
      if (!hasActive) {
        event.preventDefault();
        event.stopPropagation();
        const query = (this.el.nativeElement as HTMLInputElement)?.value ?? '';
        this.multiAutocomplete._createJustEmitted = true;
        this.multiAutocomplete.create.emit({ query });
        queueMicrotask(() => this.multiAutocomplete.close());
        return;
      }
    }

    // When closed, typeable keys open overlay
    if (
      !this.multiAutocomplete.open() &&
      !this.multiAutocomplete.disabled() &&
      event.key.length === 1 &&
      event.key !== ' ' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !['Tab', 'Escape', 'Enter'].includes(event.key)
    ) {
      this.multiAutocomplete.openSelect();
      ensureActiveAndSync(this.listbox, (id) => this.multiAutocomplete.setActiveDescendantId(id));
      return;
    }

    handleComboboxKeydown(
      event,
      {
        disabled: this.multiAutocomplete.disabled(),
        open: this.multiAutocomplete.open(),
        openSelect: () => this.multiAutocomplete.openSelect(),
        close: () => this.multiAutocomplete.close(),
        listbox: this.listbox,
        setActiveDescendantId: (id) => this.multiAutocomplete.setActiveDescendantId(id),
        multiSelect: true, // Enter toggles, does not close
      },
      {
        enableTypeahead: false,
        keysToOpen: MULTI_AUTOCOMPLETE_KEYS_TO_OPEN,
        keysToOpenNoPreventDefault: ['Backspace', 'Delete'],
        spaceCommits: false,
      }
    );
  }
}

@Directive({
  selector: '[tngMultiAutocompleteTriggerContainer]',
  exportAs: 'tngMultiAutocompleteTriggerContainer',
  standalone: true,
})
export class TngMultiAutocompleteTriggerContainer {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-trigger-container' as const;
}

@Directive({
  selector: '[tngMultiAutocompleteIcon]',
  exportAs: 'tngMultiAutocompleteIcon',
  standalone: true,
})
export class TngMultiAutocompleteIcon {
  private readonly multiAutocomplete = inject<TngMultiAutocomplete>(TNG_MULTI_AUTOCOMPLETE);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-icon' as const;

  @HostListener('click')
  protected onClick(): void {
    if (this.multiAutocomplete.disabled()) return;
    const trigger = this.multiAutocomplete.hostElement.querySelector(
      '[data-slot="multi-autocomplete-trigger"]'
    ) as HTMLElement | null;
    trigger?.focus();
  }
}

const createContentId = createTngIdFactory('tng-multi-autocomplete-content');

@Directive({
  selector: '[tngMultiAutocompleteContent]',
  exportAs: 'tngMultiAutocompleteContent',
  standalone: true,
})
export class TngMultiAutocompleteContent {
  private readonly multiAutocomplete = inject<TngMultiAutocomplete>(TNG_MULTI_AUTOCOMPLETE);
  private readonly destroyRef = inject(DestroyRef);

  @HostBinding('attr.id')
  readonly id = createContentId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-content' as const;

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.multiAutocomplete.open() ? null : '';
  }

  @HostBinding('attr.aria-busy')
  protected get ariaBusy(): 'true' | null {
    return this.multiAutocomplete.loading() ? 'true' : null;
  }

  constructor() {
    this.multiAutocomplete.setContentId(this.id);
    this.destroyRef.onDestroy(() => {
      if (this.multiAutocomplete.getContentId() === this.id) {
        this.multiAutocomplete.setContentId(null);
      }
    });
  }
}
