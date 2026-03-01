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
  untracked,
} from '@angular/core';

import { createListboxController } from '@tailng-ui/cdk';
import { TNG_LISTBOX } from './tokens';

export type ListboxValue<T> = T | readonly T[] | null;

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

  /**
   * Enable listbox typeahead (printable key moves active option by option text).
   * Default true for Select compatibility.
   * Autocomplete should set this to false (input owns typing/filtering).
   */
  typeahead = input<boolean>(true);

  readonly value = model<ListboxValue<T>>(null);

  private readonly el = inject(ElementRef<HTMLElement>);

  private idToElement = new Map<string, HTMLElement>();
  private options = signal<{ id: string; value: T; disabled: boolean }[]>([]);
  private controller = signal<ReturnType<typeof createListboxController<T>> | null>(null);
  private activeId = signal<string | null>(null);

  // ----------------------------------------------------
  // Host bindings
  // ----------------------------------------------------

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
    return this.activeId();
  }

  // ----------------------------------------------------
  // Constructor
  // ----------------------------------------------------

  constructor() {
    const hostId = `tng-listbox-${Math.random().toString(36).slice(2)}`;

    // Controller creation effect
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

    // Controlled value sanitizer
    effect(() => {
      const isMulti = this.multiple();
      const opts = this.options();
      const external = this.value();

      if (!isMulti) {
        if (external === null) return;

        const v = external as T;
        if (!this.isSelectableValue(v, opts)) {
          this.value.set(null);
        }
        return;
      }

      if (external === null) return;

      const arr = Array.isArray(external)
        ? (external as readonly T[])
        : ([external as T] as readonly T[]);

      const filtered = arr.filter((v) => this.isSelectableValue(v, opts));

      if (filtered.length !== arr.length) {
        this.value.set(filtered as readonly T[]);
      }
    });

    // External value -> controller selection
    effect(() => {
      const ctrl = this.controller();
      if (!ctrl) return;

      const opts = this.options();
      const external = this.value();

      const toIds = (v: ListboxValue<T>): string[] => {
        if (v === null) return [];
        const arr = Array.isArray(v) ? (v as readonly T[]) : ([v as T] as const);

        const ids: string[] = [];
        for (const val of arr) {
          const opt = opts.find((o) => Object.is(o.value, val));
          if (!opt) continue;
          if (opt.disabled) continue;
          ids.push(opt.id);
        }
        return ids;
      };

      const nextIds = toIds(external);

      if (nextIds.length === 0) {
        ctrl.clearSelection();
        return;
      }

      ctrl.setSelectedIds(nextIds);
    });

    // Scroll when active changes
    effect(() => {
      const id = this.activeId();
      if (!id) return;

      const el = this.idToElement.get(id);
      if (!el) return;

      el.scrollIntoView?.({ block: 'nearest' });
    });
  }

  // ----------------------------------------------------
  // Helpers
  // ----------------------------------------------------

  private findOptionByValue(
    value: T,
    opts: readonly { value: T; disabled: boolean }[],
  ) {
    return opts.find((o) => Object.is(o.value, value));
  }

  private isSelectableValue(
    value: T,
    opts: readonly { value: T; disabled: boolean }[],
  ): boolean {
    const opt = this.findOptionByValue(value, opts);
    return !!opt && !opt.disabled;
  }

  private syncDomOrderToController(): void {
    const ctrl = this.controller();
    if (!ctrl) return;

    const root = this.el.nativeElement;
    const optionEls = Array.from(
      root.querySelectorAll('[role="option"][id]'),
    ) as HTMLElement[];

    const ids = optionEls.map((x) => x.id).filter(Boolean);

    if (ids.length > 0) {
      ctrl.setItemOrder(ids);
    }
  }

  private syncActiveFromController(): void {
    const ctrl = this.controller();
    if (!ctrl) return;
    this.activeId.set(ctrl.getActiveId());
  }

  // ----------------------------------------------------
  // Option registration
  // ----------------------------------------------------

  registerOption(
    id: string,
    value: T,
    disabled: boolean,
    text?: string,
    el?: HTMLElement,
  ): void {
    if (el) {
      this.idToElement.set(id, el);
    }

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
    this.idToElement.delete(id);

    const ctrl = this.controller();
    if (!ctrl) return;

    ctrl.unregisterOption(id);

    this.syncActiveFromController();
    this.syncExternalValueFromInternal(ctrl, false);
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

    ctrl.setOptionDisabled(id, disabled);
    this.syncActiveFromController();
  }

  // ----------------------------------------------------
  // Events
  // ----------------------------------------------------

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

    // ✅ Typeahead (optional)
    if (
      this.typeahead() &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const moved = ctrl.typeahead(event.key);
      if (moved) {
        this.syncActiveFromController();
        event.preventDefault();
        return;
      }
    }

    const action = ctrl.handleKeyDown(event);
    this.syncActiveFromController();

    if (action?.preventDefault) {
      event.preventDefault();
    }

    this.syncExternalValueFromInternal(ctrl, false);
  }

  @HostListener('focusin')
  handleFocusIn() {
    if (this.disabled()) return;

    const ctrl = this.controller();
    if (!ctrl) return;

    if (ctrl.getActiveId() !== null) {
      this.syncActiveFromController();
      return;
    }

    ctrl.handleKeyDown({ key: 'Home' });
    this.syncActiveFromController();
  }

  handleOptionClick(id: string, shiftKey?: boolean) {
    if (this.disabled()) return;

    this.syncDomOrderToController();

    const opt = this.options().find((o) => o.id === id);
    if (opt?.disabled) return;

    const ctrl = this.controller();
    if (!ctrl) return;

    ctrl.handleClick(id, shiftKey);

    this.syncActiveFromController();
    this.syncExternalValueFromInternal(ctrl, true);
  }

  // ----------------------------------------------------
  // Selection sync
  // ----------------------------------------------------

  private syncExternalValueFromInternal(
    ctrl: ReturnType<typeof createListboxController<T>>,
    fromClick: boolean,
  ) {
    const selected = ctrl.getSelectedValues();

    if (this.multiple()) {
      this.value.set([...selected] as readonly T[]);
    } else {
      const newVal = selected[0] ?? null;
      const current = this.value();
      this.value.set(newVal);
      if (fromClick && Object.is(newVal, current)) {
        this.value.set(null);
        this.value.set(newVal);
      }
    }
  }

  isSelected(id: string): boolean {
    const ctrl = this.controller();
    if (!ctrl) return false;
  
    // ✅ selection truth is IDs, not value equality
    return ctrl.getSelectedIds().includes(id);
  }

  isActive(id: string): boolean {
    return this.activeId() === id;
  }

  public getActiveId(): string | null {
    return this.activeId();
  }

  public ensureActive(pref: 'first' | 'last' = 'first'): void {
    const ctrl = this.controller();
    if (!ctrl) return;
    if (ctrl.getActiveId() !== null) return;
    ctrl.handleKeyDown({ key: pref === 'last' ? 'End' : 'Home' });
    this.syncActiveFromController();
  }

  public handleKeyFromCombobox(key: string, shiftKey?: boolean): boolean {
    const ctrl = this.controller();
    if (!ctrl) return false;
    const action = ctrl.handleKeyDown({ key, shiftKey } as any);
    this.syncActiveFromController();
    if (action) this.syncExternalValueFromInternal(ctrl, false);
    return !!action;
  }

  public typeaheadFromCombobox(key: string): boolean {
    const ctrl = this.controller();
    if (!ctrl) return false;
    const moved = ctrl.typeahead(key);
    if (moved) this.syncActiveFromController();
    return moved;
  }

  public getActiveValue(): T | null | undefined {
    const active = this.activeId();
    if (!active) return null;
    const opt = this.options().find((o) => o.id === active);
    return opt?.value;
  }
}