import { DestroyRef, Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import { ensureActiveAndSync, handleComboboxKeydown } from '../../../internal/combobox';
import type { TngSelectHostApi } from './tng-select.host-api';
import { TNG_SELECT_HOST } from './tng-select.tokens.shared';

@Directive({
  selector: '[tngSelectTrigger]',
  exportAs: 'tngSelectTrigger',
  standalone: true,
})
export class TngSelectTrigger {
  private readonly host = inject<TngSelectHostApi>(TNG_SELECT_HOST);
  private readonly el = inject(ElementRef<HTMLElement>);

  private get listbox() {
    return this.host.getListboxApi();
  }
  private readonly authorTabindex = this.el.nativeElement.getAttribute('tabindex') !== null;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-trigger' = 'select-trigger';

  @HostBinding('attr.role') protected readonly role: 'combobox' = 'combobox';
  @HostBinding('attr.aria-haspopup') protected readonly haspopup: 'listbox' = 'listbox';

  @HostBinding('attr.aria-expanded')
  protected get ariaExpanded(): 'true' | 'false' {
    return this.host.open() ? 'true' : 'false';
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.host.disabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    if (!this.host.open()) return null;
    return this.host.getContentId() ?? this.host.getListboxId();
  }

  @HostBinding('attr.aria-activedescendant')
  protected get ariaActiveDescendant(): string | null {
    return this.host.open() ? this.host.getActiveDescendantId() : null;
  }

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
    return this.host.invalid() ? 'true' : null;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledby(): string | null {
    const node = this.el.nativeElement;
    if (node.hasAttribute('aria-label')) return null;
    return this.host.labelId();
  }

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedby(): string | null {
    const ids: string[] = [];
    const desc = this.host.descriptionId();
    if (desc) ids.push(desc);
    if (this.host.invalid()) {
      const err = this.host.errorId();
      if (err) ids.push(err);
    }
    return ids.length ? ids.join(' ') : null;
  }

  @HostListener('pointerdown', ['$event'])
  protected onPointerDown(event: PointerEvent): void {
    if (this.host.disabled()) return;
    const btn = event.button ?? 0;
    if (btn !== 0) return;

    event.preventDefault();
    this.el.nativeElement.focus();
    this.host.toggle();

    if (this.host.open()) {
      ensureActiveAndSync(this.listbox, (id) => this.host.setActiveDescendantId(id));
    }
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    handleComboboxKeydown(event, {
      disabled: this.host.disabled(),
      open: this.host.open(),
      openSelect: () => this.host.openSelect(),
      close: () => this.host.close(),
      listbox: this.listbox,
      setActiveDescendantId: (id) => this.host.setActiveDescendantId(id),
      multiSelect: this.host.multiple(),
    });
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
  private readonly host = inject<TngSelectHostApi>(TNG_SELECT_HOST);
  private readonly destroyRef = inject(DestroyRef);

  @HostBinding('attr.id')
  readonly id = createContentId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-content' = 'select-content';

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.host.open() ? null : '';
  }

  @HostBinding('attr.aria-busy')
  protected get ariaBusy(): 'true' | null {
    return this.host.loading() ? 'true' : null;
  }

  constructor() {
    this.host.setContentId(this.id);
    this.destroyRef.onDestroy(() => {
      if (this.host.getContentId() === this.id) this.host.setContentId(null);
    });
  }
}
