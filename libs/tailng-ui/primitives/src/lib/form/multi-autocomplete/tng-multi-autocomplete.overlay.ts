import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  effect,
  inject,
} from '@angular/core';
import { computeOverlayPosition } from '@tailng-ui/cdk';
import { TNG_MULTI_AUTOCOMPLETE } from './tng-multi-autocomplete.tokens';
import type { TngMultiAutocomplete } from './tng-multi-autocomplete';

type MaybeRect = Readonly<{ left: number; top: number; width: number; height: number }>;

function rectFromClientRect(r: DOMRect | ClientRect): MaybeRect {
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function viewportRect(): MaybeRect {
  return {
    left: 0,
    top: 0,
    width: window.innerWidth || 1024,
    height: window.innerHeight || 768,
  };
}

function isInside(target: EventTarget | null, container: HTMLElement): boolean {
  return !!target && target instanceof Node && container.contains(target);
}

@Directive({
  selector: '[tngMultiAutocompleteOverlay]',
  exportAs: 'tngMultiAutocompleteOverlay',
})
export class TngMultiAutocompleteOverlay {
  private readonly multi = inject<TngMultiAutocomplete>(TNG_MULTI_AUTOCOMPLETE);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private removeDocPointerListener: (() => void) | null = null;
  private placeholder: Comment | null = null;
  private originalParent: Node | null = null;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-overlay' as const;

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.multi.open() ? null : '';
  }

  constructor() {
    const hostEl = this.elRef.nativeElement;
    this.placeholder = document.createComment('tng-multi-autocomplete-overlay-anchor');
    this.originalParent = hostEl.parentNode;
    this.originalParent?.insertBefore(this.placeholder, hostEl);
    this.multi.setOverlayElement(hostEl);

    effect(() => {
      const open = this.multi.open();
      if (open) {
        this.mountToBodyAndPosition();
      } else {
        this.restoreToPlaceholder();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.teardownOutsidePointer();
      this.restoreToPlaceholder(true);
      this.multi.setOverlayElement(null);
      this.placeholder = null;
      this.originalParent = null;
    });
  }

  private findAnchorEl(): HTMLElement {
    return this.multi.hostElement;
  }

  private reposition(): void {
    if (!this.multi.open()) return;

    const panel = this.elRef.nativeElement;
    const anchorEl = this.findAnchorEl();
    const anchor = rectFromClientRect(anchorEl.getBoundingClientRect());
    const overlay = rectFromClientRect(panel.getBoundingClientRect());
    const viewport = viewportRect();
    const result = computeOverlayPosition({
      anchorRect: anchor,
      overlayRect: overlay,
      viewportRect: viewport,
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
      this.resizeObserver.observe(this.findAnchorEl());
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

    const onPointerDown = (event: PointerEvent) => {
      if (!this.multi.open()) return;

      const panel = this.elRef.nativeElement;
      if (isInside(event.target, panel)) return;
      if (isInside(event.target, this.multi.hostElement)) return;
      if (event.target && (event.target as Element).closest?.('[data-slot="multi-autocomplete-option"]')) {
        return;
      }

      this.multi.close();
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
      if (!this.multi.open()) return;

      const anchor = rectFromClientRect(this.findAnchorEl().getBoundingClientRect());
      panel.style.minWidth = `${anchor.width}px`;
      this.reposition();
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
    panel.style.position = '';
    panel.style.left = '';
    panel.style.top = '';
    panel.style.zIndex = '';
    panel.style.minWidth = '';
    this.teardownOutsidePointer();
  }
}
