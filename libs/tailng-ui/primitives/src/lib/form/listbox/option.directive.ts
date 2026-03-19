// option.directive.ts
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { createTngIdFactory } from '@tailng-ui/cdk';
import { TNG_LISTBOX } from './tokens';

const createId = createTngIdFactory('tng-option');

@Directive({
  selector: '[tngOption]',
})
export class TngOptionDirective<T = unknown> implements AfterViewInit, OnDestroy {
  tngValue = input<T | undefined>();
  disabled = input<boolean>(false);

  private el = inject(ElementRef<HTMLElement>);
  private listbox = inject(TNG_LISTBOX);
  private id = createId();

  // gate to ensure we only push updates after initial registration
  private registered = signal(false);

  // ✅ effect is created in injection context (field initializer)
  private readonly _syncDisabled = effect(() => {
    if (!this.registered()) return;
    this.listbox.updateOptionDisabled(this.id, this.disabled());
  });

  @HostBinding('attr.role')
  role = 'option';

  @HostBinding('attr.id')
  get hostId() {
    return this.id;
  }

  @HostBinding('attr.aria-selected')
  get ariaSelected(): 'true' | 'false' {
    return this.isSelected() ? 'true' : 'false';
  }

  @HostBinding('attr.aria-disabled')
  get ariaDisabled(): 'true' | null {
    return this.disabled() ? 'true' : null;
  }

  // ✅ Tailwind-friendly state attributes (presence based)
  @HostBinding('attr.data-active')
  get dataActive(): '' | null {
    return this.listbox.isActive(this.id) ? '' : null;
  }

  @HostBinding('attr.data-selected')
  get dataSelected(): '' | null {
    return this.isSelected() ? '' : null;
  }

  @HostBinding('attr.data-disabled')
  get dataDisabled(): '' | null {
    return this.disabled() ? '' : null;
  }

  ngAfterViewInit() {
    const value = this.tngValue();
    if (value === undefined) return;

    const text = this.el.nativeElement.textContent?.trim() ?? '';
    // pass text for typeahead
    this.listbox.registerOption(this.id, value, this.disabled(), text, this.el.nativeElement);

    this.registered.set(true);
  }

  ngOnDestroy() {
    this.listbox.unregisterOption(this.id);
    this.registered.set(false);
    // Angular will destroy directive + tear down effect automatically
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.button !== 0) return;

    // Prevent focus from moving / text selection, keep listbox behavior stable.
    event.preventDefault();

    this.listbox.handleOptionClick(this.id, event.shiftKey);
  }

  private isSelected(): boolean {
    if (this.listbox.isSelected(this.id)) return true;
    if (this.disabled()) return false;

    const value = this.tngValue();
    if (value === undefined) return false;

    return this.listbox.isValueSelected(value);
  }
}
