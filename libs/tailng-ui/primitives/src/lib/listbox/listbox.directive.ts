// listbox.directive.ts
import {
  Directive,
  HostBinding,
  HostListener,
  effect,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';

import { createListboxController } from '@tailng-ui/cdk';
import { TNG_LISTBOX } from './tokens';

type ListboxValue<T> = T | readonly T[] | null;

@Directive({
  selector: '[tngListbox]',
  standalone: true,
  providers: [{ provide: TNG_LISTBOX, useExisting: TngListboxDirective }],
})
export class TngListboxDirective<T> {
  multiple = input<boolean>(false);
  orientation = input<'vertical' | 'horizontal'>('vertical');
  direction = input<'ltr' | 'rtl'>('ltr');
  disabled = input<boolean>(false);

  loop = input<boolean>(true);

  value = model<ListboxValue<T>>(null);

  private options = signal<{ id: string; value: T; disabled: boolean }[]>([]);

  private controller = signal<ReturnType<typeof createListboxController<T>> | null>(
    null,
  );

  @HostBinding('attr.role')
  role = 'listbox';

  @HostBinding('attr.aria-multiselectable')
  get ariaMulti() {
    return this.multiple() ? 'true' : null;
  }

  @HostBinding('attr.aria-disabled')
  get ariaDisabled() {
    return this.disabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-activedescendant')
  get activeDescendant() {
    return this.controller()?.getActiveId() ?? null;
  }

  constructor() {
    // create a stable host id once
    const hostId = `tng-listbox-${Math.random().toString(36).slice(2)}`;
  
    effect(() => {
      const ctrl = createListboxController<T>({
        hostId,
        selectionMode: this.multiple() ? 'multiple' : 'single',
        orientation: this.orientation(),
        direction: this.direction(),
        disabled: this.disabled(),

        loop: this.loop(),
      });
  
      this.controller.set(ctrl);
  
      // ✅ do NOT track options() inside this effect
      const opts = untracked(this.options);
      for (const option of opts) {
        ctrl.registerOption(option);
      }
    });
  }

  // ----------------------------
  // Option registration (idempotent)
  // ----------------------------

  registerOption(id: string, value: T, disabled: boolean): void {
    this.options.update((list) => {
      const idx = list.findIndex((x) => x.id === id);
      if (idx === -1) return [...list, { id, value, disabled }];
      const copy = list.slice();
      copy[idx] = { id, value, disabled };
      return copy;
    });

    const ctrl = this.controller();
    if (!ctrl) return;

    ctrl.unregisterOption(id);
    ctrl.registerOption({ id, value, disabled });
  }

  unregisterOption(id: string): void {
    this.options.update((list) => list.filter((x) => x.id !== id));
  
    const ctrl = this.controller();
    if (!ctrl) return;
  
    ctrl.unregisterOption(id);
  
    this.syncExternalValueFromInternal(ctrl);
  }

  updateOptionDisabled(id: string, disabled: boolean): void {
    let updated: { id: string; value: T; disabled: boolean } | undefined;

    this.options.update((list) =>
      list.map((o) => {
        if (o.id !== id) return o;
        updated = { ...o, disabled };
        return updated!;
      }),
    );

    if (!updated) return;

    const ctrl = this.controller();
    if (!ctrl) return;

    ctrl.unregisterOption(id);
    ctrl.registerOption(updated);

    // If active became disabled, move to next enabled.
    // (Assumes controller skip logic uses disabled flag.)
    if (ctrl.getActiveId() === id && disabled) {
      const key =
        this.orientation() === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
      ctrl.handleKeyDown(new KeyboardEvent('keydown', { key }));
    }
  }

  // ----------------------------
  // Events
  // ----------------------------

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (this.disabled()) {
      // do nothing, don’t even set active
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const ctrl = this.controller();
    if (!ctrl) return;

    const action = ctrl.handleKeyDown(event);
    if (action?.preventDefault) event.preventDefault();

    this.syncExternalValueFromInternal(ctrl);
  }

  @HostListener('focusin')
  handleFocusIn() {
    if (this.disabled()) return;

    const ctrl = this.controller();
    if (!ctrl) return;

    ctrl.handleKeyDown({ key: 'Home' });
  }

  handleOptionClick(id: string, shiftKey?: boolean) {
    if (this.disabled()) return;

    const opt = this.options().find((o) => o.id === id);
    if (opt?.disabled) return;

    const ctrl = this.controller();
    if (!ctrl) return;

    ctrl.handleClick(id, shiftKey);
    this.syncExternalValueFromInternal(ctrl);
  } 

  private syncExternalValueFromInternal(
    ctrl: ReturnType<typeof createListboxController<T>>,
  ) {
    const selected = ctrl.getSelectedValues();

    if (this.multiple()) {
      this.value.set([...selected] as readonly T[]);
    } else {
      this.value.set(selected[0] ?? null);
    }
  }

  isSelected(id: string): boolean {
    const ctrl = this.controller();
    if (!ctrl) return false;

    const option = this.options().find((o) => o.id === id);
    if (!option) return false;

    return ctrl.getSelectedValues().includes(option.value);
  }

  isActive(id: string): boolean {
    return this.controller()?.getActiveId() === id;
  }
}