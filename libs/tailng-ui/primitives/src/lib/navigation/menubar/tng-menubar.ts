import { Directive, ElementRef, HostBinding, HostListener, inject, input } from '@angular/core';

import { TngMenu } from '../menu/tng-menu';

type MenubarItemElement = HTMLElement;

@Directive({
  selector: '[tngMenubar]',
  exportAs: 'tngMenubar',
  standalone: true,
})
export class TngMenubar {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly loop = input<boolean>(true);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menubar' as const;

  @HostBinding('attr.role')
  protected readonly role = 'menubar' as const;

  getItems(): readonly MenubarItemElement[] {
    return Array.from(
      this.hostRef.nativeElement.querySelectorAll<MenubarItemElement>('[tngMenubarItem]'),
    );
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

  readonly ownedMenu = input<TngMenu | null>(null, {
    alias: 'tngMenubarMenu',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menubar-item' as const;

  @HostBinding('attr.role')
  protected readonly role = 'menuitem' as const;

  @HostBinding('attr.aria-haspopup')
  protected get ariaHaspopup(): 'menu' | null {
    return this.ownedMenu() === null ? null : 'menu';
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    return this.ownedMenu()?.id ?? null;
  }

  ngOnInit(): void {
    this.syncOwnedMenuLink();
    this.syncAriaExpanded();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const ownedMenu = this.ownedMenu();
    if (ownedMenu !== null && (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown')) {
      event.preventDefault();
      this.syncOwnedMenuLink();
      ownedMenu.open(event.key === 'ArrowDown' ? 'first' : 'none');
      return;
    }

    if (
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      return;
    }

    const items = this.menubar.getItems();
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
    const targetIndex =
      event.key === 'ArrowRight'
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

  private syncOwnedMenuLink(): void {
    const ownedMenu = this.ownedMenu();
    if (ownedMenu === null) {
      return;
    }

    ownedMenu.setTriggerElement(this.hostRef.nativeElement, () => this.syncAriaExpanded());
  }

  private syncAriaExpanded(): void {
    const ownedMenu = this.ownedMenu();
    if (ownedMenu === null) {
      this.hostRef.nativeElement.removeAttribute('aria-expanded');
      return;
    }

    this.hostRef.nativeElement.setAttribute('aria-expanded', ownedMenu.isOpen() ? 'true' : 'false');
  }
}
