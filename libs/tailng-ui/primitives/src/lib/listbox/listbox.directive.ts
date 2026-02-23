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

  private options = signal<{ id: string; value: T; disabled: boolean; el: HTMLElement }[]>([]);
  private controller = signal<ReturnType<typeof createListboxController<T>> | null>(null);

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
  
      // ✅ re-register from stored options without tracking
      const opts = untracked(this.options);
  
      for (const option of opts) {
        ctrl.registerOption(option); // option includes { id, value, disabled, el } in your refactor
      }
  
      // ✅ CRITICAL: re-apply DOM order to the NEW controller
      const orderedIds = opts
        .slice()
        .sort((a, b) => {
          if (a.el === b.el) return 0;
          const pos = a.el.compareDocumentPosition(b.el);
          return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        })
        .map((o) => o.id);
  
      ctrl.setItemOrder(orderedIds);
    });
  }

  private syncControllerOrder(): void {
    const ctrl = this.controller();
    if (!ctrl) return;
  
    const ordered = this.options()
      .slice()
      .sort((a, b) => {
        if (a.el === b.el) return 0;
        const pos = a.el.compareDocumentPosition(b.el);
        // a before b => return -1
        if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        return 1;
      })
      .map((o) => o.id);
  
    ctrl.setItemOrder(ordered);
  }

  registerOption(id: string, value: T, disabled: boolean, el: HTMLElement): void {
    this.options.update((list) => {
      const idx = list.findIndex((x) => x.id === id);
      if (idx === -1) return [...list, { id, value, disabled, el }];
      const copy = list.slice();
      copy[idx] = { id, value, disabled, el };
      return copy;
    });
  
    const ctrl = this.controller();
    if (!ctrl) return;
  
    ctrl.registerOption({ id, value, disabled });
  
    // ✅ enforce DOM order after each registration/update
    this.syncControllerOrder();
  }

  unregisterOption(id: string): void {
    this.options.update((list) => list.filter((x) => x.id !== id));
  
    const ctrl = this.controller();
    if (!ctrl) return;
  
    ctrl.unregisterOption(id);
  
    // ✅ keep order consistent after removal too
    this.syncControllerOrder();
  
    this.syncExternalValueFromInternal(ctrl);
  }

  // ✅ called by option directive when disabled changes
  updateOptionDisabled(id: string, disabled: boolean): void {
    let exists = false;
  
    this.options.update((list) =>
      list.map((o) => {
        if (o.id !== id) return o;
        exists = true;
        return { ...o, disabled };
      }),
    );
  
    if (!exists) return;
  
    const ctrl = this.controller();
    if (!ctrl) return;
  
    ctrl.setOptionDisabled(id, disabled);
  
    // order doesn’t change, but harmless if you want:
    // this.syncControllerOrder();
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (this.disabled()) {
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

  private syncExternalValueFromInternal(ctrl: ReturnType<typeof createListboxController<T>>) {
    const selected = ctrl.getSelectedValues();
    if (this.multiple()) this.value.set([...selected] as readonly T[]);
    else this.value.set(selected[0] ?? null);
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