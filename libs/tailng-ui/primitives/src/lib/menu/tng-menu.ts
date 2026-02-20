import { Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';

type MenuItemElement = HTMLElement;

function getEnabledMenuItems(host: HTMLElement): readonly MenuItemElement[] {
  return [...host.querySelectorAll<MenuItemElement>('[role="menuitem"]')].filter(
    (element) => element.getAttribute('aria-disabled') !== 'true',
  );
}

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

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const items = getEnabledMenuItems(this.hostRef.nativeElement);
    if (items.length === 0) {
      return;
    }

    const currentIndex = items.findIndex((item) => item === document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[getNextIndex(currentIndex, items.length)]?.focus();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[getPrevIndex(currentIndex, items.length)]?.focus();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  }
}
