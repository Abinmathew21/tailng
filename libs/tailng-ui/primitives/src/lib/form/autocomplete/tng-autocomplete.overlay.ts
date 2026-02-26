import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  input,
  effect,
} from '@angular/core';
import type {
  TngOverlayCollisionOptions,
  TngOverlayOffset,
  TngOverlayPlacement,
} from '@tailng-ui/cdk';
import { computeOverlayPosition } from '@tailng-ui/cdk';
import { TNG_AUTOCOMPLETE } from './tng-autocomplete.tokens';
import type { TngAutocomplete } from './tng-autocomplete';

type MaybeRect = Readonly<{ left: number; top: number; width: number; height: number }>;

function rectFromClientRect(r: DOMRect | ClientRect): MaybeRect {
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function viewportRect(): MaybeRect {
  return { left: 0, top: 0, width: window.innerWidth || 1024, height: window.innerHeight || 768 };
}

function isInside(target: EventTarget | null, container: HTMLElement): boolean {
  return !!target && target instanceof Node && container.contains(target);
}

@Directive({
  selector: '[tngAutocompleteOverlay]',
  exportAs: 'tngAutocompleteOverlay',
  standalone: true,
})
export class TngAutocompleteOverlay {
  private readonly autocomplete = inject<TngAutocomplete>(TNG_AUTOCOMPLETE);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  private lastFocusedBeforeOpen: HTMLElement | null = null;
  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private removeDocPointerListener: (() => void) | null = null;

  readonly placement = input<TngOverlayPlacement | undefined>(undefined);
  readonly offset = input<TngOverlayOffset | undefined>(undefined);
  readonly collision = input<TngOverlayCollisionOptions | undefined>(undefined);

  private placeholder: Comment | null = null;
  private originalParent: Node | null = null;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'autocomplete-overlay' as const;

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.autocomplete.open() ? null : '';
  }

  constructor() {
    this.placeholder = document.createComment('tng-autocomplete-overlay-anchor');
    const hostEl = this.elRef.nativeElement;
    this.originalParent = hostEl.parentNode;
    this.originalParent?.insertBefore(this.placeholder, hostEl);

    effect(() => {
      const open = this.autocomplete.open();
      if (open) this.mountToBodyAndPosition();
      else this.restoreToPlaceholder();
    });

    this.destroyRef.onDestroy(() => {
      this.teardownOutsidePointer();
      this.restoreToPlaceholder(true);
      this.placeholder = null;
      this.originalParent = null;
    });
  }

  /** Anchor for overlay: container (trigger+icon) if present, else the input trigger. */
  private findAnchorEl(): HTMLElement | null {
    const root = this.autocomplete.hostElement;
    const container = root.querySelector('[data-slot="autocomplete-trigger-container"]') as HTMLElement | null;
    if (container) return container;
    return root.querySelector('[data-slot="autocomplete-trigger"]') as HTMLElement | null;
  }

  private findTriggerEl(): HTMLElement | null {
    const root = this.autocomplete.hostElement;
    return root.querySelector('[data-slot="autocomplete-trigger"]') as HTMLElement | null;
  }

  private reposition(): void {
    if (!this.autocomplete.open()) return;
    const panel = this.elRef.nativeElement;
    const anchorEl = this.findAnchorEl();
    if (!anchorEl) return;
    const anchor = rectFromClientRect(anchorEl.getBoundingClientRect());
    const overlay = rectFromClientRect(panel.getBoundingClientRect());
    const viewport = viewportRect();
    const result = computeOverlayPosition({
      anchorRect: anchor,
      overlayRect: overlay,
      viewportRect: viewport,
      placement: this.placement(),
      offset: this.offset(),
      collision: this.collision(),
    });
    panel.style.left = `${result.x}px`;
    panel.style.top = `${result.y}px`;
  }

  private setupRepositionListeners(): void {
    let rafId: number | null = null;
    const schedule = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        this.reposition();
      });
    };
    const onResize = () => schedule();
    const onScroll = () => schedule();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, true);
    this.removeResizeListener = () => window.removeEventListener('resize', onResize);
    this.removeScrollListener = () => window.removeEventListener('scroll', onScroll, true);
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => schedule());
      const anchorEl = this.findAnchorEl();
      if (anchorEl) this.resizeObserver.observe(anchorEl);
      this.resizeObserver.observe(this.elRef.nativeElement);
    }
  }

  private teardownRepositionListeners(): void {
    this.removeResizeListener?.();
    this.removeScrollListener?.();
    this.removeResizeListener = null;
    this.removeScrollListener = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private setupOutsidePointer(): void {
    if (this.removeDocPointerListener) return;
    const onPointerDown = (ev: PointerEvent) => {
      if (!this.autocomplete.open()) return;
      const panel = this.elRef.nativeElement;
      const anchorEl = this.findAnchorEl();
      if (isInside(ev.target, panel)) return;
      if (anchorEl && isInside(ev.target, anchorEl)) return;
      if (ev.target && (ev.target as Element).closest?.('[data-slot="autocomplete-option"]')) return;
      this.autocomplete.close();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    this.removeDocPointerListener = () =>
      document.removeEventListener('pointerdown', onPointerDown, true);
  }

  private teardownOutsidePointer(): void {
    this.removeDocPointerListener?.();
    this.removeDocPointerListener = null;
  }

  private mountToBodyAndPosition(): void {
    this.lastFocusedBeforeOpen = document.activeElement as HTMLElement | null;
    this.setupRepositionListeners();
    const panel = this.elRef.nativeElement;
    if (panel.parentNode !== document.body) {
      document.body.appendChild(panel);
    }
    panel.style.position = 'fixed';
    panel.style.left = '0px';
    panel.style.top = '0px';
    panel.style.zIndex = '1000';

    queueMicrotask(() => {
      if (!this.autocomplete.open()) return;
      const anchorEl = this.findAnchorEl();
      if (!anchorEl) return;
      const anchor = rectFromClientRect(anchorEl.getBoundingClientRect());
      panel.style.minWidth = `${anchor.width}px`;
      const overlay = rectFromClientRect(panel.getBoundingClientRect());
      const viewport = viewportRect();
      const result = computeOverlayPosition({
        anchorRect: anchor,
        overlayRect: overlay,
        viewportRect: viewport,
        placement: this.placement(),
        offset: this.offset(),
        collision: this.collision(),
      });
      panel.style.left = `${result.x}px`;
      panel.style.top = `${result.y}px`;
    });

    this.setupOutsidePointer();
  }

  private restoreToPlaceholder(force = false): void {
    const panel = this.elRef.nativeElement;
    if (!force && panel.parentNode !== document.body) {
      this.teardownOutsidePointer();
      return;
    }
    if (this.placeholder?.parentNode) {
      this.placeholder.parentNode.insertBefore(panel, this.placeholder);
    } else if (this.originalParent) {
      this.originalParent.appendChild(panel);
    }
    this.teardownRepositionListeners();

    if (
      this.lastFocusedBeforeOpen &&
      document.contains(this.lastFocusedBeforeOpen)
    ) {
      const active = document.activeElement as HTMLElement | null;
      if (!active || panel.contains(active)) {
        this.autocomplete._restoringFocus = true;
        this.lastFocusedBeforeOpen.focus();
        queueMicrotask(() => { this.autocomplete._restoringFocus = false; });
      }
    }
    this.restoreFocusOnClose();

    panel.style.position = '';
    panel.style.left = '';
    panel.style.top = '';
    panel.style.zIndex = '';
    panel.style.minWidth = '';
    this.teardownOutsidePointer();
  }

  private restoreFocusOnClose(): void {
    const panel = this.elRef.nativeElement;
    const active = document.activeElement as HTMLElement | null;
    const trigger = this.findTriggerEl();
    if (!trigger) return;

    if (active && panel.contains(active)) {
      this.autocomplete._restoringFocus = true;
      trigger.focus();
      queueMicrotask(() => { this.autocomplete._restoringFocus = false; });
      return;
    }
    if (document.activeElement === document.body) {
      this.autocomplete._restoringFocus = true;
      trigger.focus();
      queueMicrotask(() => { this.autocomplete._restoringFocus = false; });
    }
  }
}
