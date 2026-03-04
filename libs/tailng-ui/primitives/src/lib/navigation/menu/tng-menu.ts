import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  NgZone,
  output,
} from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';

type MenuItemElement = HTMLElement;
type ReadonlyMenuItemElement = Readonly<MenuItemElement>;
type TngMenuFocusAction = 'first' | 'last' | 'next' | 'prev';
type TngMenuOpenFocusAction = 'first' | 'none';
type TngMenuSelectTrigger = 'keyboard' | 'pointer';
type TngMenuKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;
type TngMenuPointerEvent = Readonly<Pick<PointerEvent, 'target'>>;

export type TngMenuSelectEvent = Readonly<{
  value: unknown;
  itemId: string;
  trigger: TngMenuSelectTrigger;
}>;

function getNextIndex(currentIndex: number, total: number): number {
  if (currentIndex < 0) {
    return 0;
  }

  return currentIndex + 1 >= total ? 0 : currentIndex + 1;
}

function getPrevIndex(currentIndex: number, total: number): number {
  if (currentIndex < 0) {
    return total - 1;
  }

  return currentIndex - 1 < 0 ? total - 1 : currentIndex - 1;
}

function resolveMenuFocusAction(key: string): TngMenuFocusAction | null {
  switch (key) {
    case 'ArrowDown':
      return 'next';
    case 'ArrowUp':
      return 'prev';
    case 'Home':
      return 'first';
    case 'End':
      return 'last';
    default:
      return null;
  }
}

function resolveFocusIndex(
  action: TngMenuFocusAction,
  currentIndex: number,
  total: number,
  loop: boolean,
): number {
  switch (action) {
    case 'next':
      if (!loop && currentIndex >= total - 1) {
        return total - 1;
      }
      return getNextIndex(currentIndex, total);
    case 'prev':
      if (!loop) {
        if (currentIndex < 0) {
          return 0;
        }
        if (currentIndex <= 0) {
          return 0;
        }
      }
      return getPrevIndex(currentIndex, total);
    case 'first':
      return 0;
    case 'last':
      return total - 1;
  }
}

const createMenuId = createTngIdFactory('tng-menu');
const createMenuItemId = createTngIdFactory('tng-menu-item');

@Directive({
  selector: '[tngMenu]',
  exportAs: 'tngMenu',
  standalone: true,
})
export class TngMenu {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly itemsById = new Map<string, TngMenuItem>();
  private outsidePointerdownCleanup: (() => void) | null = null;
  private triggerStateSync: (() => void) | null = null;
  private triggerElement: HTMLElement | null = null;
  private activeItemId: string | null = null;
  private openState = false;

  readonly loop = input<boolean>(true);
  readonly closeOnSelect = input<boolean>(true);
  readonly dismissOnOutsideClick = input<boolean>(true);
  readonly tngMenuSelect = output<TngMenuSelectEvent>();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menu' as const;

  @HostBinding('attr.role')
  protected readonly role = 'menu' as const;

  @HostBinding('attr.id')
  readonly id = createMenuId();

  @HostBinding('attr.tabindex')
  protected get tabIndex(): string {
    return this.hostRef.nativeElement.getAttribute('tabindex') ?? '-1';
  }

  @HostBinding('attr.data-state')
  protected get dataState(): 'open' | 'closed' {
    return this.openState ? 'open' : 'closed';
  }

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.openState ? null : '';
  }

  @HostBinding('attr.aria-activedescendant')
  protected get ariaActiveDescendant(): string | null {
    return this.activeItemId;
  }

  setTriggerElement(triggerElement: HTMLElement, triggerStateSync?: () => void): void {
    this.triggerElement = triggerElement;
    this.triggerStateSync = triggerStateSync ?? this.triggerStateSync;
  }

  isOpen(): boolean {
    return this.openState;
  }

  registerItem(item: TngMenuItem): void {
    this.itemsById.set(item.getItemId(), item);
  }

  unregisterItem(item: TngMenuItem): void {
    if (this.itemsById.get(item.getItemId()) === item) {
      this.itemsById.delete(item.getItemId());
    }

    if (this.activeItemId === item.getItemId()) {
      this.activeItemId = null;
    }
  }

  open(focusAction: TngMenuOpenFocusAction = 'none'): void {
    this.openState = true;

    if (focusAction === 'first') {
      this.moveActiveItem('next');
    } else {
      this.activeItemId = null;
    }

    this.hostRef.nativeElement.focus();
    this.triggerStateSync?.();
    this.attachOutsidePointerdownListener();
  }

  close(restoreFocus: boolean): void {
    this.openState = false;
    this.activeItemId = null;
    this.detachOutsidePointerdownListener();
    this.triggerStateSync?.();

    if (restoreFocus) {
      this.triggerElement?.focus();
    }
  }

  ngOnDestroy(): void {
    this.detachOutsidePointerdownListener();
  }

  requestSelect(item: TngMenuItem, trigger: TngMenuSelectTrigger): void {
    if (item.isDisabled()) {
      return;
    }

    this.activeItemId = item.getItemId();
    this.tngMenuSelect.emit({
      value: item.getValue(),
      itemId: item.getItemId(),
      trigger,
    });

    if (this.closeOnSelect()) {
      this.close(false);
    }
  }

  private getEnabledMenuItems(): readonly ReadonlyMenuItemElement[] {
    const items = Array.from(this.hostRef.nativeElement.querySelectorAll<MenuItemElement>('[role="menuitem"]'));
    const enabledItems: ReadonlyMenuItemElement[] = [];

    for (const item of items) {
      if (item.getAttribute('aria-disabled') !== 'true') {
        enabledItems.push(item);
      }
    }

    return enabledItems;
  }

  private onDocumentPointerdown(event: TngMenuPointerEvent): void {
    if (!this.openState || !this.dismissOnOutsideClick()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (this.hostRef.nativeElement.contains(target)) {
      return;
    }

    if (this.triggerElement?.contains(target)) {
      return;
    }

    this.close(false);
    this.changeDetectorRef.detectChanges();
  }

  private attachOutsidePointerdownListener(): void {
    this.detachOutsidePointerdownListener();

    if (!this.dismissOnOutsideClick()) {
      return;
    }

    const handler = (event: PointerEvent): void => {
      this.onDocumentPointerdown(event);
    };

    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('pointerdown', handler);
      this.outsidePointerdownCleanup = () => {
        document.removeEventListener('pointerdown', handler);
      };
    });
  }

  private detachOutsidePointerdownListener(): void {
    this.outsidePointerdownCleanup?.();
    this.outsidePointerdownCleanup = null;
  }

  private moveActiveItem(action: TngMenuFocusAction): void {
    const items = this.getEnabledMenuItems();
    if (items.length === 0) {
      this.activeItemId = null;
      return;
    }

    let currentIndex = -1;
    for (let index = 0; index < items.length; index += 1) {
      if (items[index].id === this.activeItemId) {
        currentIndex = index;
        break;
      }
    }

    const targetIndex = resolveFocusIndex(action, currentIndex, items.length, this.loop());
    this.activeItemId = items[targetIndex]?.id ?? null;
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngMenuKeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close(true);
      return;
    }

    if (event.key === 'Tab') {
      this.close(false);
      return;
    }

    if (event.key === 'Enter') {
      const activeItem = this.activeItemId === null ? null : this.itemsById.get(this.activeItemId) ?? null;
      if (activeItem !== null) {
        event.preventDefault();
        this.requestSelect(activeItem, 'keyboard');
      }
      return;
    }

    const action = resolveMenuFocusAction(event.key);
    if (action === null) {
      return;
    }
    event.preventDefault();
    this.moveActiveItem(action);
  }
}

@Directive({
  selector: '[tngMenuItem]',
  exportAs: 'tngMenuItem',
  standalone: true,
})
export class TngMenuItem {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly menu = inject(TngMenu, { optional: true, skipSelf: true });

  readonly value = input<unknown>(undefined, {
    alias: 'tngMenuItemValue',
  });

  constructor() {
    this.menu?.registerItem(this);
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menu-item' as const;

  @HostBinding('attr.role')
  protected readonly role = 'menuitem' as const;

  @HostBinding('attr.id')
  protected readonly id = createMenuItemId();

  @HostBinding('attr.tabindex')
  protected readonly tabIndex = -1;

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.isDisabled() ? 'true' : null;
  }

  @HostListener('click')
  protected onClick(): void {
    this.select('pointer');
  }

  ngOnDestroy(): void {
    this.menu?.unregisterItem(this);
  }

  getItemId(): string {
    return this.id;
  }

  getValue(): unknown {
    return this.value();
  }

  isDisabled(): boolean {
    const element = this.hostRef.nativeElement as HTMLElement & {
      disabled?: boolean;
    };

    return element.disabled || element.hasAttribute('disabled');
  }

  select(trigger: TngMenuSelectTrigger): void {
    this.menu?.requestSelect(this, trigger);
  }
}

@Directive({
  selector: '[tngMenuTrigger]',
  exportAs: 'tngMenuTrigger',
  standalone: true,
})
export class TngMenuTrigger {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly menu = input.required<TngMenu>({
    alias: 'tngMenuTrigger',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menu-trigger' as const;

  @HostBinding('attr.aria-haspopup')
  protected readonly ariaHaspopup = 'menu' as const;

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string {
    return this.menu().id;
  }

  ngOnInit(): void {
    this.menu().setTriggerElement(this.hostRef.nativeElement, () => this.syncAriaExpanded());
    this.syncAriaExpanded();
  }

  @HostListener('click')
  protected onClick(): void {
    this.openMenu('none');
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngMenuKeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.openMenu('none');
        return;
      case 'ArrowDown':
        event.preventDefault();
        this.openMenu('first');
        return;
      default:
        return;
    }
  }

  private openMenu(focusAction: TngMenuOpenFocusAction): void {
    const menu = this.menu();
    menu.open(focusAction);
  }

  private syncAriaExpanded(): void {
    this.hostRef.nativeElement.setAttribute('aria-expanded', this.menu().isOpen() ? 'true' : 'false');
  }
}
