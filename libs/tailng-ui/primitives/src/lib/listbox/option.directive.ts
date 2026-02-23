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
  standalone: true,
})
export class TngOptionDirective<T> implements AfterViewInit, OnDestroy {
  tngValue = input<T | undefined>();
  disabled = input<boolean>(false);

  private el = inject(ElementRef<HTMLElement>).nativeElement;
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
  get ariaSelected() {
    return this.listbox.isSelected(this.id) ? 'true' : 'false';
  }

  @HostBinding('attr.aria-disabled')
  get ariaDisabled() {
    return this.disabled() ? 'true' : null;
  }

  @HostBinding('attr.data-active')
  get active() {
    return this.listbox.isActive(this.id) ? '' : null;
  }

  ngAfterViewInit() {
    const value = this.tngValue();
    if (value === undefined) return;

    this.listbox.registerOption(this.id, value, this.disabled(), this.el);
    this.registered.set(true);
  }

  ngOnDestroy() {
    this.listbox.unregisterOption(this.id);
    this.registered.set(false);
    // Angular will destroy directive + tear down effect automatically
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.listbox.handleOptionClick(this.id, event.shiftKey);
  }
}