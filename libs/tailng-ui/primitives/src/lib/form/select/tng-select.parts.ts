import { DestroyRef, Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import type { TngSelect } from './tng-select';
import { TNG_SELECT } from './tng-select.tokens';
import { TngSelectListboxApi } from './tng-select.listbox.types';

@Directive({
  selector: '[tngSelectTrigger]',
  exportAs: 'tngSelectTrigger',
  standalone: true,
})
export class TngSelectTrigger {
  private readonly select = inject<TngSelect>(TNG_SELECT);
  private readonly el = inject(ElementRef<HTMLElement>);

  private get listbox(): TngSelectListboxApi<unknown> | null {
    return this.select.getListboxApi();
  }
  // snapshot: only true if author wrote tabindex in template
  private readonly authorTabindex = this.el.nativeElement.getAttribute('tabindex') !== null;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-trigger' = 'select-trigger';

  @HostBinding('attr.role') protected readonly role: 'combobox' = 'combobox';
  @HostBinding('attr.aria-haspopup') protected readonly haspopup: 'listbox' = 'listbox';

  @HostBinding('attr.aria-expanded')
  protected get ariaExpanded(): 'true' | 'false' {
    return this.select.open() ? 'true' : 'false';
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.select.disabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    if (!this.select.open()) return null;

    // Prefer content id for mode-2 (works even without listbox present)
    return this.select.getContentId() ?? this.select.getListboxId();
  }

  @HostBinding('attr.aria-activedescendant')
  protected get ariaActiveDescendant(): string | null {
    return this.select.open() ? this.select.getActiveDescendantId() : null;
  }

  // stable: never read hasAttribute('tabindex') here
  @HostBinding('attr.tabindex')
  protected get tabindex(): '0' | null {
    const node = this.el.nativeElement;

    const isNaturallyFocusable =
      node instanceof HTMLButtonElement ||
      node instanceof HTMLInputElement ||
      node instanceof HTMLSelectElement ||
      node instanceof HTMLTextAreaElement;

    return isNaturallyFocusable || this.authorTabindex ? null : '0';
  }

  @HostBinding('attr.aria-invalid')
  protected get ariaInvalid(): 'true' | null {
    return this.select.invalid() ? 'true' : null;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledby(): string | null {
    return this.select.labelId();
  }

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedby(): string | null {
    const ids: string[] = [];

    const desc = this.select.descriptionId();
    if (desc) ids.push(desc);

    if (this.select.invalid()) {
      const err = this.select.errorId();
      if (err) ids.push(err);
    }

    return ids.length ? ids.join(' ') : null;
  }

  @HostListener('pointerdown', ['$event'])
  protected onPointerDown(event: PointerEvent): void {
    if (this.select.disabled()) return;
    const btn = event.button ?? 0;
    if (btn !== 0) return;

    event.preventDefault();
    this.el.nativeElement.focus();
    this.select.toggle();

    if (this.select.open()) {
      this.listbox?.ensureActive();
      this.select.setActiveDescendantId(this.listbox?.getActiveId() ?? null);
    }
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (this.select.disabled()) return;

    if (!this.select.open()) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.select.openSelect();
        this.listbox?.ensureActive(event.key === 'ArrowUp' ? 'last' : 'first');
        this.select.setActiveDescendantId(this.listbox?.getActiveId() ?? null);
      }
      return;
    }

    // when open: route nav to listbox
    if (event.key === 'Escape') {
      if (event.defaultPrevented) return; // ✅ match old behavior
      event.preventDefault();
      event.stopPropagation();
      this.select.close();
      return;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const moved = this.listbox?.typeahead(event.key) ?? false;
      if (moved) {
        this.select.setActiveDescendantId(this.listbox?.getActiveId() ?? null);
        event.preventDefault();
      }
      return;
    }

    const moved = this.listbox?.handleKey(event.key, event.shiftKey) ?? false;
    if (moved) {
      this.select.setActiveDescendantId(this.listbox?.getActiveId() ?? null);
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.listbox?.commitActive();
    }
  }
}

@Directive({
  selector: '[tngSelectValue]',
  exportAs: 'tngSelectValue',
  standalone: true,
})
export class TngSelectValue {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-value' = 'select-value';
}

@Directive({
  selector: '[tngSelectIcon]',
  exportAs: 'tngSelectIcon',
  standalone: true,
})
export class TngSelectIcon {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-icon' = 'select-icon';
}

const createContentId = createTngIdFactory('tng-select-content');

@Directive({
  selector: '[tngSelectContent]',
  exportAs: 'tngSelectContent',
  standalone: true,
})
export class TngSelectContent {
  private readonly select = inject<TngSelect>(TNG_SELECT);
  private readonly destroyRef = inject(DestroyRef);

  @HostBinding('attr.id')
  readonly id = createContentId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-content' = 'select-content';

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.select.open() ? null : '';
  }

  @HostBinding('attr.aria-busy')
  protected get ariaBusy(): 'true' | null {
    return this.select.loading() ? 'true' : null;
  }
  
  constructor() {
    this.select.setContentId(this.id);

    this.destroyRef.onDestroy(() => {
      // be safe if content is conditionally destroyed in future
      if (this.select.getContentId() === this.id) this.select.setContentId(null);
    });
  }
}