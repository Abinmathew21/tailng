import { Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';

type MenuItemElement = HTMLElement;
type ReadonlyMenuItemElement = Readonly<MenuItemElement>;
type TngMenuFocusAction = 'first' | 'last' | 'next' | 'prev';
type TngMenuKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

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
): number {
  switch (action) {
    case 'next':
      return getNextIndex(currentIndex, total);
    case 'prev':
      return getPrevIndex(currentIndex, total);
    case 'first':
      return 0;
    case 'last':
      return total - 1;
  }
}

@Directive({
  selector: '[tngMenu]',
  exportAs: 'tngMenu',
})
export class TngMenu {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menu' as const;

  @HostBinding('attr.role')
  protected readonly role = 'menu' as const;

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

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngMenuKeyboardEvent): void {
    const items = this.getEnabledMenuItems();
    if (items.length === 0) {
      return;
    }

    const action = resolveMenuFocusAction(event.key);
    if (action === null) {
      return;
    }

    let currentIndex = -1;
    for (let index = 0; index < items.length; index += 1) {
      if (items[index] === document.activeElement) {
        currentIndex = index;
        break;
      }
    }
    const targetIndex = resolveFocusIndex(action, currentIndex, items.length);
    event.preventDefault();
    items[targetIndex]?.focus();
  }
}
