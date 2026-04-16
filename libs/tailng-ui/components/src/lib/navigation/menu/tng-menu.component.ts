import { Component, ElementRef, HostBinding, inject, input, DestroyRef, NgZone } from '@angular/core';
import { computeOverlayPosition } from '@tailng-ui/cdk';
import { TngMenu as TngMenuPrimitive } from '@tailng-ui/primitives';

const MAX_FOCUS_SYNC_ATTEMPTS = 4;

function rectFromClientRect(r: DOMRect | ClientRect): { left: number; top: number; width: number; height: number } {
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function viewportRect(): { left: number; top: number; width: number; height: number } {
  return { left: 0, top: 0, width: window.innerWidth || 1024, height: window.innerHeight || 768 };
}

@Component({
  selector: 'tng-menu',
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);
  private lastOpenState = false;
  private focusSyncQueued = false;
  private focusSyncAttempts = 0;

  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private rafId: number | null = null;

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
      this.attachPositioningListeners();
      this.queuePositioning();
    } else if (this.lastOpenState && !isOpen) {
      this.detachPositioningListeners();
      this.clearPositioningStyles();
    }

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
    if (!trigger) return;

    const isSubmenu = this.primitive.getParentMenu() !== null;
    
    // Default config: root menus drop down, submenus fly out to the right
    let side: 'bottom' | 'right' = 'bottom';
    let align: 'start' | 'center' | 'end' = 'start';

    if (isSubmenu) {
      side = 'right';
      align = 'start';
    }

    const anchor = rectFromClientRect(trigger.getBoundingClientRect());
    const overlay = rectFromClientRect(host.getBoundingClientRect());
    const viewport = viewportRect();

    const result = computeOverlayPosition({
      anchorRect: anchor,
      overlayRect: overlay,
      viewportRect: viewport,
      placement: { side, align },
      offset: { side: isSubmenu ? -4 : 4, align: 0 },
      collision: { padding: 8, flip: true, shift: true }
    });

    host.style.position = 'fixed';
    host.style.zIndex = '50';
    host.style.margin = '0';
    host.style.left = `${result.x}px`;
    host.style.top = `${result.y}px`;
  }

  private clearPositioningStyles(): void {
    const host = this.hostRef.nativeElement;
    host.style.position = '';
    host.style.zIndex = '';
    host.style.margin = '';
    host.style.left = '';
    host.style.top = '';
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
export { TngMenuComponent as TngMenu };
