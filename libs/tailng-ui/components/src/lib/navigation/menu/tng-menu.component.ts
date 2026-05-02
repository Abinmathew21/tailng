import { Component, ElementRef, HostBinding, inject, input, DestroyRef, NgZone, ViewEncapsulation } from '@angular/core';
import { computeOverlayPosition } from '@tailng-ui/cdk';
import {
  TNG_MENU_DEFER_HOST_FOCUS_UNTIL_POSITIONED,
  TngMenu as TngMenuPrimitive,
} from '@tailng-ui/primitives';

const MAX_FOCUS_SYNC_ATTEMPTS = 4;

function rectFromClientRect(r: DOMRect | ClientRect): { left: number; top: number; width: number; height: number } {
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function viewportRect(): { left: number; top: number; width: number; height: number } {
  return { left: 0, top: 0, width: window.innerWidth || 1024, height: window.innerHeight || 768 };
}

@Component({
  selector: 'tng-menu',
  providers: [{ provide: TNG_MENU_DEFER_HOST_FOCUS_UNTIL_POSITIONED, useValue: true }],
  hostDirectives: [
    {
      directive: TngMenuPrimitive,
      inputs: ['loop', 'disabled', 'closeOnSelect', 'dismissOnOutsideClick', 'dismissOnFocusout'],
      outputs: ['tngMenuOpened', 'tngMenuClosed', 'tngMenuSelect'],
    },
  ],
  templateUrl: './tng-menu.component.html',
  styleUrl: './tng-menu.component.css',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'tngMenuComponent',
})
export class TngMenuComponent {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly primitive = inject<TngMenuPrimitive>(TngMenuPrimitive);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);
  private lastOpenState = false;
  private focusSyncQueued = false;
  private focusSyncAttempts = 0;

  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private rafId: number | null = null;
  /** Retries when overlay rect is 0×0 before first placement (layout not ready yet). */
  private initialPlacementRetryCount = 0;

  readonly ariaLabel = input<string>('Menu');

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.detachPositioningListeners();
    });
  }

  ngDoCheck(): void {
    const isOpen = this.primitive.isOpen();

    if (!this.lastOpenState && isOpen) {
      this.initialPlacementRetryCount = 0;
      this.setPositioningPending(true);
      this.attachPositioningListeners();
      this.queuePositioning();
    } else if (this.lastOpenState && !isOpen) {
      this.detachPositioningListeners();
      this.clearPositioningStyles();
    }

    if (!isOpen) {
      this.lastOpenState = false;
      this.initialPlacementRetryCount = 0;
      this.setPositioningPending(false);
      this.focusSyncAttempts = 0;
      this.focusSyncQueued = false;
      return;
    }

    const justOpened = !this.lastOpenState && isOpen;
    this.lastOpenState = true;

    // Opening edge: primitive defers host focus until overlay placement runs in reposition();
    // skip queueFocusSync here so focus does not run before the first fixed-position pass.
    if (justOpened) {
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

    if (shouldSyncFocusToHostOrDeepestSubmenu && this.focusSyncAttempts < MAX_FOCUS_SYNC_ATTEMPTS) {
      this.queueFocusSync();
    }
  }

  private queuePositioning(): void {
    if (this.rafId !== null) return;
    this.ngZone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.reposition();
      });
    });
  }

  private reposition(): void {
    if (!this.primitive.isOpen()) return;

    const host = this.hostRef.nativeElement;
    const trigger = this.primitive.getTriggerElement();
    if (!trigger) {
      this.clearPositioningPending();
      return;
    }

    const isSubmenu = this.primitive.getParentMenu() !== null;

    // Default config: root menus drop down, submenus fly out to the right (same pipeline for every layer).
    let side: 'bottom' | 'right' = 'bottom';
    let align: 'start' | 'center' | 'end' = 'start';

    if (isSubmenu) {
      side = 'right';
      align = 'start';
    }

    const anchor = rectFromClientRect(trigger.getBoundingClientRect());
    let overlay = rectFromClientRect(host.getBoundingClientRect());

    const pendingInitial =
      host.getAttribute('data-positioning-state') === 'pending';
    if (
      pendingInitial &&
      (overlay.width < 0.5 || overlay.height < 0.5) &&
      this.initialPlacementRetryCount < 5
    ) {
      this.initialPlacementRetryCount += 1;
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          if (!this.primitive.isOpen()) {
            return;
          }
          this.reposition();
        });
      });
      return;
    }

    if (pendingInitial) {
      this.initialPlacementRetryCount = 0;
    }

    overlay = rectFromClientRect(host.getBoundingClientRect());

    const viewport = viewportRect();

    const result = computeOverlayPosition({
      anchorRect: anchor,
      overlayRect: overlay,
      viewportRect: viewport,
      placement: { side, align },
      offset: { side: isSubmenu ? -4 : 4, align: 0 },
      collision: { padding: 8, flip: true, shift: true },
    });

    host.style.position = 'fixed';
    host.style.zIndex = 'var(--tng-menu-z-overlay, var(--tng-menu-overlay-z-index, var(--tng-z-overlay, 50)))';
    host.style.margin = '0';
    host.style.left = `${result.x}px`;
    host.style.top = `${result.y}px`;
    host.style.right = 'auto';
    host.style.bottom = 'auto';

    this.clearPositioningPending();
    this.scheduleFocusAfterReposition();
  }

  /**
   * Hide the panel until the first fixed placement is applied so theme CSS (absolute) does not
   * flash before JS overlay coordinates (all levels use the same reposition path).
   */
  private setPositioningPending(pending: boolean): void {
    const host = this.hostRef.nativeElement;
    if (pending) {
      host.setAttribute('data-positioning-state', 'pending');
    } else {
      host.removeAttribute('data-positioning-state');
    }
  }

  private clearPositioningPending(): void {
    this.hostRef.nativeElement.removeAttribute('data-positioning-state');
  }

  private clearPositioningStyles(): void {
    const host = this.hostRef.nativeElement;
    host.style.position = '';
    host.style.zIndex = '';
    host.style.margin = '';
    host.style.left = '';
    host.style.top = '';
    host.style.right = '';
    host.style.bottom = '';
    host.removeAttribute('data-positioning-state');
  }

  private attachPositioningListeners(): void {
    if (this.removeResizeListener) return;

    const schedule = () => this.queuePositioning();

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('resize', schedule);
      window.addEventListener('scroll', schedule, true);
      this.removeResizeListener = () => window.removeEventListener('resize', schedule);
      this.removeScrollListener = () => window.removeEventListener('scroll', schedule, true);

      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(() => schedule());
        const trigger = this.primitive.getTriggerElement();
        if (trigger) this.resizeObserver.observe(trigger);
        this.resizeObserver.observe(this.hostRef.nativeElement);
      }
    });
  }

  /**
   * After fixed placement is applied, run the same focus sync previously scheduled from ngDoCheck
   * so assistive tech sees the panel in its final coordinates (position → then focus).
   */
  private scheduleFocusAfterReposition(): void {
    if (!this.primitive.isOpen()) {
      return;
    }
    this.ngZone.run(() => {
      queueMicrotask(() => this.runFocusSyncIfNeeded());
    });
  }

  private detachPositioningListeners(): void {
    this.removeResizeListener?.();
    this.removeScrollListener?.();
    this.removeResizeListener = null;
    this.removeScrollListener = null;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private queueFocusSync(): void {
    if (this.focusSyncQueued) {
      return;
    }

    this.focusSyncQueued = true;
    queueMicrotask((): void => {
      this.focusSyncQueued = false;
      this.runFocusSyncIfNeeded();
    });
  }

  private runFocusSyncIfNeeded(): void {
    if (!this.primitive.isOpen()) {
      return;
    }

    const host = this.hostRef.nativeElement;
    const activeElement = document.activeElement;
    const focusMenuHost =
      activeElement instanceof Element
        ? (activeElement.closest('[data-slot="menu"][data-state="open"]') as HTMLElement | null)
        : null;

    // Cascaded level-2+ panels are often siblings under one root menu, not nested in DOM. Do not
    // call host.focus() on a shallower panel while a deeper sibling panel should keep focus.
    if (this.shouldDeferFocusToDeeperCascadePanel(host, focusMenuHost)) {
      return;
    }

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
  }

  private shouldDeferFocusToDeeperCascadePanel(host: HTMLElement, focusMenuHost: HTMLElement | null): boolean {
    if (!(focusMenuHost instanceof HTMLElement) || focusMenuHost === host) {
      return false;
    }
    if (host.contains(focusMenuHost)) {
      return false;
    }

    const ordered = this.getOpenMenuPanelsUnderMenubar(host);
    const hostIndex = ordered.indexOf(host);
    const focusIndex = ordered.indexOf(focusMenuHost);
    if (hostIndex === -1 || focusIndex === -1) {
      return false;
    }
    return focusIndex > hostIndex;
  }

  private getOpenMenuPanelsUnderMenubar(host: HTMLElement): HTMLElement[] {
    const menubar = host.closest('[data-slot="menubar"], [role="menubar"]');
    if (!menubar) {
      return [];
    }
    return Array.from(menubar.querySelectorAll<HTMLElement>('[data-slot="menu"][data-state="open"]'));
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
export { TngMenuComponent as TngMenu };
