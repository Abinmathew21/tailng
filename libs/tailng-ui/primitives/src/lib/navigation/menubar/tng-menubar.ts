import { Directive, ElementRef, HostBinding, HostListener, inject, input } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';

import { TngMenu } from '../menu/tng-menu';

type MenubarItemElement = HTMLElement;
const createMenubarItemId = createTngIdFactory('tng-menubar-item');
const TYPEAHEAD_RESET_MS = 500;

@Directive({
  selector: '[tngMenubar]',
  exportAs: 'tngMenubar',
  standalone: true,
})
export class TngMenubar {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private openItem: TngMenubarItem | null = null;
  private currentTabStopId: string | null = null;
  private typeaheadBuffer = '';
  private typeaheadResetHandle: ReturnType<typeof setTimeout> | null = null;

  readonly loop = input<boolean>(true);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menubar' as const;

  @HostBinding('attr.role')
  protected readonly role = 'menubar' as const;

  @HostBinding('attr.aria-orientation')
  protected readonly ariaOrientation = 'horizontal' as const;

  getItems(): readonly MenubarItemElement[] {
    return Array.from(
      this.hostRef.nativeElement.querySelectorAll<MenubarItemElement>('[tngMenubarItem]'),
    );
  }

  getEnabledItems(): readonly MenubarItemElement[] {
    return this.getItems().filter((item) => item.getAttribute('aria-disabled') !== 'true');
  }

  isRtl(): boolean {
    const host = this.hostRef.nativeElement;
    const nearestDir =
      host.closest<HTMLElement>('[dir]')?.getAttribute('dir') ??
      host.ownerDocument?.documentElement.getAttribute('dir');

    return nearestDir?.toLowerCase() === 'rtl';
  }

  getCurrentTabStopId(): string | null {
    const enabledItems = this.getEnabledItems();
    if (enabledItems.length === 0) {
      this.currentTabStopId = null;
      return null;
    }

    if (!enabledItems.some((item) => item.id === this.currentTabStopId)) {
      this.currentTabStopId = enabledItems[0]?.id ?? null;
    }

    return this.currentTabStopId;
  }

  setCurrentTabStop(item: TngMenubarItem): void {
    if (item.isDisabledItem()) {
      return;
    }

    this.currentTabStopId = item.getItemId();
  }

  hasOpenItem(): boolean {
    return this.openItem !== null;
  }

  isOpenItem(item: TngMenubarItem): boolean {
    return this.openItem === item;
  }

  findTypeaheadMatch(currentItem: HTMLElement, key: string): MenubarItemElement | null {
    const items = this.getEnabledItems();
    if (items.length === 0) {
      return null;
    }

    const normalizedKey = key.trim().toLowerCase();
    if (normalizedKey.length !== 1) {
      return null;
    }

    const repeatingSingleChar =
      this.typeaheadBuffer.length > 0 &&
      this.typeaheadBuffer.split('').every((char) => char === normalizedKey);

    let query = repeatingSingleChar ? normalizedKey : `${this.typeaheadBuffer}${normalizedKey}`;
    let match = this.findMatchingItem(items, currentItem, query, repeatingSingleChar);

    if (match === null && query !== normalizedKey) {
      query = normalizedKey;
      match = this.findMatchingItem(items, currentItem, query, true);
    }

    if (match === null) {
      return null;
    }

    this.resetTypeaheadBuffer(query);
    return match;
  }

  requestToggleMenu(item: TngMenubarItem): void {
    const ownedMenu = item.getOwnedMenu();
    if (ownedMenu === null || item.isDisabledItem()) {
      return;
    }

    if (ownedMenu.isOpen()) {
      item.closeOwnedMenu(false);
      item.focusSelf();
      return;
    }

    this.requestOpenMenu(item, 'none');
  }

  requestOpenMenu(item: TngMenubarItem, focusAction: 'none' | 'first' | 'last'): void {
    const ownedMenu = item.getOwnedMenu();
    if (ownedMenu === null || item.isDisabledItem()) {
      return;
    }

    if (this.openItem !== null && this.openItem !== item) {
      this.openItem.closeOwnedMenu(false);
    }

    this.openItem = item;
    item.openOwnedMenu(focusAction);
  }

  syncOpenItem(item: TngMenubarItem): void {
    if (item.getOwnedMenu()?.isOpen()) {
      this.openItem = item;
      return;
    }

    if (this.openItem === item) {
      this.openItem = null;
    }
  }

  ngOnDestroy(): void {
    if (this.typeaheadResetHandle !== null) {
      clearTimeout(this.typeaheadResetHandle);
      this.typeaheadResetHandle = null;
    }
  }

  private findMatchingItem(
    items: readonly MenubarItemElement[],
    currentItem: HTMLElement,
    query: string,
    cycleFromCurrentItem: boolean,
  ): MenubarItemElement | null {
    const currentIndex = items.indexOf(currentItem);
    const startIndex = cycleFromCurrentItem && currentIndex >= 0 ? (currentIndex + 1) % items.length : 0;

    for (let offset = 0; offset < items.length; offset += 1) {
      const index = (startIndex + offset) % items.length;
      const item = items[index];
      const label = item.textContent?.trim().toLowerCase() ?? '';

      if (label.startsWith(query)) {
        return item;
      }
    }

    return null;
  }

  private resetTypeaheadBuffer(nextBuffer: string): void {
    this.typeaheadBuffer = nextBuffer;

    if (this.typeaheadResetHandle !== null) {
      clearTimeout(this.typeaheadResetHandle);
    }

    this.typeaheadResetHandle = setTimeout(() => {
      this.typeaheadBuffer = '';
      this.typeaheadResetHandle = null;
    }, TYPEAHEAD_RESET_MS);
  }
}

@Directive({
  selector: '[tngMenubarItem]',
  exportAs: 'tngMenubarItem',
  standalone: true,
})
export class TngMenubarItem {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly menubar = inject(TngMenubar, { host: true });
  private readonly resolvedId =
    this.hostRef.nativeElement.getAttribute('id') ?? createMenubarItemId();
  private lastOwnedMenu: TngMenu | null = null;

  readonly ownedMenu = input<TngMenu | null>(null, {
    alias: 'tngMenubarMenu',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menubar-item' as const;

  @HostBinding('attr.role')
  protected readonly role = 'menuitem' as const;

  @HostBinding('attr.id')
  protected readonly id = this.resolvedId;

  @HostBinding('attr.tabindex')
  protected get tabIndex(): string {
    if (this.isDisabled()) {
      return '-1';
    }

    return this.menubar.getCurrentTabStopId() === this.id ? '0' : '-1';
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.isDisabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-haspopup')
  protected get ariaHaspopup(): 'menu' | null {
    return this.ownedMenu() === null ? null : 'menu';
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    return this.ownedMenu()?.id ?? null;
  }

  ngOnInit(): void {
    this.lastOwnedMenu = this.ownedMenu();
    this.syncOwnedMenuLink();
    this.syncAriaExpanded();
  }

  ngDoCheck(): void {
    const currentOwnedMenu = this.ownedMenu();
    if (currentOwnedMenu === this.lastOwnedMenu) {
      return;
    }

    this.lastOwnedMenu?.clearTriggerLink(this.hostRef.nativeElement);
    this.lastOwnedMenu = currentOwnedMenu;
    this.syncOwnedMenuLink();
    this.syncAriaExpanded();
  }

  ngOnDestroy(): void {
    this.lastOwnedMenu?.clearTriggerLink(this.hostRef.nativeElement);
  }

  @HostListener('click')
  protected onClick(): void {
    if (this.ownedMenu() === null || this.isDisabled()) {
      return;
    }

    this.focusSelf();
    this.syncOwnedMenuLink();
    this.menubar.requestToggleMenu(this);
  }

  @HostListener('pointerdown')
  protected onPointerdown(): void {
    if (this.isDisabled()) {
      return;
    }

    this.focusSelf();
  }

  @HostListener('mouseenter')
  protected onMouseenter(): void {
    if (this.isDisabled()) {
      return;
    }

    this.menubar.setCurrentTabStop(this);

    if (!this.menubar.hasOpenItem() || this.menubar.isOpenItem(this) || this.ownedMenu() === null) {
      return;
    }

    this.syncOwnedMenuLink();
    this.menubar.requestOpenMenu(this, 'none');
  }

  @HostListener('focus')
  protected onFocus(): void {
    this.menubar.setCurrentTabStop(this);
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const ownedMenu = this.ownedMenu();
    if (
      !this.isDisabled() &&
      ownedMenu !== null &&
      (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp')
    ) {
      event.preventDefault();
      this.syncOwnedMenuLink();
      this.menubar.requestOpenMenu(this, event.key === 'ArrowDown' ? 'first' : event.key === 'ArrowUp' ? 'last' : 'none');
      return;
    }

    if (
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      if (event.key.length === 1 && !this.isDisabled()) {
        const match = this.menubar.findTypeaheadMatch(this.hostRef.nativeElement, event.key);
        if (match !== null) {
          event.preventDefault();
          match.focus();
        }
      }
      return;
    }

    const items = this.menubar.getEnabledItems();
    const current = this.hostRef.nativeElement;
    const currentIndex = items.indexOf(current);

    if (currentIndex < 0 || items.length === 0) {
      return;
    }

    event.preventDefault();

    if (event.key === 'Home') {
      items[0]?.focus();
      return;
    }

    if (event.key === 'End') {
      items[items.length - 1]?.focus();
      return;
    }

    const loop = this.menubar.loop();
    const moveToNext =
      event.key === (this.menubar.isRtl() ? 'ArrowLeft' : 'ArrowRight');
    const targetIndex =
      moveToNext
        ? currentIndex + 1 >= items.length
          ? loop
            ? 0
            : items.length - 1
          : currentIndex + 1
        : currentIndex - 1 < 0
          ? loop
            ? items.length - 1
            : 0
          : currentIndex - 1;

    items[targetIndex]?.focus();
  }

  isDisabledItem(): boolean {
    return this.isDisabled();
  }

  getOwnedMenu(): TngMenu | null {
    return this.ownedMenu();
  }

  openOwnedMenu(focusAction: 'none' | 'first' | 'last'): void {
    const ownedMenu = this.ownedMenu();
    if (ownedMenu === null) {
      return;
    }

    ownedMenu.open(focusAction);
  }

  closeOwnedMenu(restoreFocus: boolean): void {
    const ownedMenu = this.ownedMenu();
    if (ownedMenu === null) {
      return;
    }

    ownedMenu.close(restoreFocus);
  }

  focusSelf(): void {
    this.menubar.setCurrentTabStop(this);
    this.hostRef.nativeElement.focus();
  }

  getItemId(): string {
    return this.id;
  }

  handleArrowFromOpenMenu(key: 'ArrowRight' | 'ArrowLeft'): void {
    const items = this.menubar.getEnabledItems();
    const current = this.hostRef.nativeElement;
    const currentIndex = items.indexOf(current);

    if (currentIndex < 0 || items.length === 0) {
      return;
    }

    const moveToNext =
      key === (this.menubar.isRtl() ? 'ArrowLeft' : 'ArrowRight');
    const loop = this.menubar.loop();
    const targetIndex =
      moveToNext
        ? currentIndex + 1 >= items.length
          ? loop
            ? 0
            : items.length - 1
          : currentIndex + 1
        : currentIndex - 1 < 0
          ? loop
            ? items.length - 1
            : 0
          : currentIndex - 1;

    const target = items[targetIndex];
    if (target === undefined || target === current) {
      return;
    }

    target.focus();
    target.click();
  }

  private isDisabled(): boolean {
    const element = this.hostRef.nativeElement as HTMLElement & {
      disabled?: boolean;
    };

    return element.disabled || element.hasAttribute('disabled');
  }

  private syncOwnedMenuLink(): void {
    const ownedMenu = this.ownedMenu();
    if (ownedMenu === null) {
      return;
    }

    ownedMenu.setTriggerElement(this.hostRef.nativeElement, () => this.syncMenuState());
    ownedMenu.setRestoreFocusOnOutsideClick(true);
    ownedMenu.setMenubarArrowHandler((key) => this.handleArrowFromOpenMenu(key));
  }

  private syncAriaExpanded(): void {
    const ownedMenu = this.ownedMenu();
    if (ownedMenu === null) {
      this.hostRef.nativeElement.removeAttribute('aria-expanded');
      return;
    }

    this.hostRef.nativeElement.setAttribute('aria-expanded', ownedMenu.isOpen() ? 'true' : 'false');
  }

  private syncMenuState(): void {
    this.syncAriaExpanded();
    this.menubar.syncOpenItem(this);
  }
}
