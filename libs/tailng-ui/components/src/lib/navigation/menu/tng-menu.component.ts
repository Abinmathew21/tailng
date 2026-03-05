import { Component, ElementRef, HostBinding, inject, input } from '@angular/core';
import { TngMenu as TngMenuPrimitive } from '@tailng-ui/primitives';

const MAX_FOCUS_SYNC_ATTEMPTS = 4;

@Component({
  selector: 'tng-menu',
  standalone: true,
  hostDirectives: [
    {
      directive: TngMenuPrimitive,
      inputs: ['loop', 'disabled', 'closeOnSelect', 'dismissOnOutsideClick', 'dismissOnFocusout'],
      outputs: ['tngMenuOpened', 'tngMenuClosed', 'tngMenuSelect'],
    },
  ],
  templateUrl: './tng-menu.component.html',
  styleUrl: './tng-menu.component.css',
  exportAs: 'tngMenuComponent',
})
export class TngMenuComponent {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly primitive = inject<TngMenuPrimitive>(TngMenuPrimitive);
  private lastOpenState = false;
  private focusSyncQueued = false;
  private focusSyncAttempts = 0;

  readonly ariaLabel = input<string>('Menu');

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }

  ngDoCheck(): void {
    const isOpen = this.primitive.isOpen();
    if (!isOpen) {
      this.lastOpenState = false;
      this.focusSyncAttempts = 0;
      this.focusSyncQueued = false;
      return;
    }

    const host = this.hostRef.nativeElement;
    const activeElement = document.activeElement;
    const deepestOpenSubmenu = this.getDeepestOpenSubmenu(host);
    const hasFocusInDeepestOpenSubmenu =
      deepestOpenSubmenu !== null &&
      activeElement instanceof Node &&
      deepestOpenSubmenu.contains(activeElement);
    const hasFocusInsideHost = activeElement instanceof Node && host.contains(activeElement);

    const shouldSyncFocusToHostOrDeepestSubmenu =
      deepestOpenSubmenu !== null ? !hasFocusInDeepestOpenSubmenu : !hasFocusInsideHost;

    if (
      (!this.lastOpenState || shouldSyncFocusToHostOrDeepestSubmenu) &&
      this.focusSyncAttempts < MAX_FOCUS_SYNC_ATTEMPTS
    ) {
      this.queueFocusSync();
    }

    this.lastOpenState = true;
  }

  private queueFocusSync(): void {
    if (this.focusSyncQueued) {
      return;
    }

    this.focusSyncQueued = true;
    queueMicrotask((): void => {
      this.focusSyncQueued = false;

      if (!this.primitive.isOpen()) {
        return;
      }

      const host = this.hostRef.nativeElement;
      const activeElement = document.activeElement;
      const deepestOpenSubmenu = this.getDeepestOpenSubmenu(host);

      if (deepestOpenSubmenu !== null) {
        if (!(activeElement instanceof Node) || !deepestOpenSubmenu.contains(activeElement)) {
          this.focusSyncAttempts += 1;
          deepestOpenSubmenu.focus();
        }
        return;
      }

      if (activeElement instanceof Node && host.contains(activeElement)) {
        return;
      }

      this.focusSyncAttempts += 1;
      host.focus();
    });
  }

  private getDeepestOpenSubmenu(host: HTMLElement): HTMLElement | null {
    const openNestedMenus = Array.from(
      host.querySelectorAll<HTMLElement>('[data-slot="menu"][data-state="open"]'),
    ).filter((menuElement) => menuElement !== host);

    if (openNestedMenus.length === 0) {
      return null;
    }

    return openNestedMenus[openNestedMenus.length - 1] ?? null;
  }
}
