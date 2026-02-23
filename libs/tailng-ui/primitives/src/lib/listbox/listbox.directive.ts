import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  effect,
  inject,
  input,
  model,
  signal,
  untracked
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

  private readonly el = inject(ElementRef<HTMLElement>);

  private options = signal<{ id: string; value: T; disabled: boolean }[]>([]);
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
  
      const opts = untracked(this.options);
      for (const option of opts) {
        ctrl.registerOption(option);
      }
    });
  
    effect(() => {
      const isMulti = this.multiple();
      const opts = this.options();   // track options (includes disabled)
      const external = this.value(); // track external value
    
      // -------------------------
      // Single mode
      // -------------------------
      if (!isMulti) {
        if (external === null) return;
    
        const v = external as T;
    
        // policy: missing OR disabled => null
        if (!this.isSelectableValue(v, opts)) {
          this.value.set(null);
        }
        return;
      }
    
      // -------------------------
      // Multiple mode
      // -------------------------
      if (external === null) return;
    
      const arr = Array.isArray(external)
        ? (external as readonly T[])
        : ([external as T] as readonly T[]);
    
      // policy: drop missing + drop disabled
      const filtered = arr.filter((v) => this.isSelectableValue(v, opts));
    
      // Only write back if changed (prevents loops)
      if (filtered.length !== arr.length) {
        this.value.set(filtered as readonly T[]);
      }
    });
  }

  private findOptionByValue(
    value: T,
    opts: readonly { value: T; disabled: boolean }[],
  ): { value: T; disabled: boolean } | undefined {
    return opts.find((o) => Object.is(o.value, value));
  }
  
  private isSelectableValue(
    value: T,
    opts: readonly { value: T; disabled: boolean }[],
  ): boolean {
    const opt = this.findOptionByValue(value, opts);
    return !!opt && !opt.disabled; // ✅ policy: disabled can't be selected
  }

  private syncDomOrderToController(): void {
    const ctrl = this.controller();
    if (!ctrl) return;

    const root = this.el.nativeElement;

    // DOM order query
    const optionEls = Array.from(root.querySelectorAll('[role="option"][id]')) as HTMLElement[];
    const ids = optionEls.map((x) => x.id).filter(Boolean);

    if (ids.length > 0) {
      ctrl.setItemOrder(ids);
    }
  }

  // ----------------------------
  // Option registration
  // ----------------------------

  registerOption(id: string, value: T, disabled: boolean, text?: string): void {
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
    ctrl.registerOption({ id, value, disabled, text });
  }

  unregisterOption(id: string): void {
    this.options.update((list) => list.filter((x) => x.id !== id));

    const ctrl = this.controller();
    if (!ctrl) return;

    ctrl.unregisterOption(id);

    // keep external value in sync after removal (your earlier failing test)
    this.syncExternalValueFromInternal(ctrl);
    // DOM order will be synced in afterRenderEffect()
  }

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

    // ✅ use dedicated API (no unregister/register)
    ctrl.setOptionDisabled(id, disabled);
  }

  // ----------------------------
  // Events
  // ----------------------------

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.syncDomOrderToController();

    const ctrl = this.controller();
    if (!ctrl) return;

    // typeahead (no ctrl/meta/alt)
    if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const moved = ctrl.typeahead(event.key);
      if (moved) {
        event.preventDefault();
        return; // typeahead does not select
      }
    }

    const action = ctrl.handleKeyDown(event);
    if (action?.preventDefault) event.preventDefault();

    this.syncExternalValueFromInternal(ctrl);
  }

  @HostListener('focusin')
  handleFocusIn() {
    if (this.disabled()) return;

    const ctrl = this.controller();
    if (!ctrl) return;

    // If active is already set, don't reset it
    if (ctrl.getActiveId() !== null) return;

    // Only on first focus, initialize to first enabled (Home behavior)
    ctrl.handleKeyDown({ key: 'Home' });
  }

  handleOptionClick(id: string, shiftKey?: boolean) {
    if (this.disabled()) return;

    this.syncDomOrderToController();

    const opt = this.options().find((o) => o.id === id);
    if (opt?.disabled) return;

    this.syncDomOrderToController();

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