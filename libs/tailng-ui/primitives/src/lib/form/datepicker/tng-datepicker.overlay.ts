import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  computeOverlayPosition,
  type TngOverlayCollisionOptions,
  type TngOverlayOffset,
  type TngOverlayPlacement,
} from '@tailng-ui/cdk';
import type {
  TngDatepickerAttributeMap,
} from './datepicker.types';

type TngDatepickerOverlayController = Readonly<{
  getOutputs: () => Readonly<{
    getHostAttributes: () => TngDatepickerAttributeMap;
    open: boolean;
  }>;
  registerOverlay: (element: HTMLElement | null) => void;
  subscribe: (listener: (event: unknown) => void) => () => void;
}>;

type MaybeRect = Readonly<{
  height: number;
  left: number;
  top: number;
  width: number;
}>;

type OverlayAnchorInput =
  | ElementRef<HTMLElement>
  | HTMLElement
  | null
  | undefined;

const OVERLAY_VIEWPORT_MARGIN = 12;
const OVERLAY_OFFSET = 9;

function rectFromClientRect(rect: DOMRect | ClientRect): MaybeRect {
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
}

function viewportRect(windowRef: Window): MaybeRect {
  return {
    height: windowRef.innerHeight || 768,
    left: 0,
    top: 0,
    width: windowRef.innerWidth || 1024,
  };
}

function resolveAnchorElement(anchor: OverlayAnchorInput): HTMLElement | null {
  if (anchor instanceof ElementRef) {
    return anchor.nativeElement;
  }

  return anchor instanceof HTMLElement ? anchor : null;
}

@Directive({
  selector: '[tngDatepickerOverlay]',
  exportAs: 'tngDatepickerOverlay',
})
export class TngDatepickerOverlay {
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  private readonly ownerDocument = this.elRef.nativeElement.ownerDocument ?? null;
  private readonly ownerWindow = this.ownerDocument?.defaultView ?? null;
  private readonly renderVersion = signal(0);
  private readonly resolvedPlacement = signal<'bottom' | 'top'>('bottom');

  private overlayPlaceholder: Comment | null = null;
  private overlayOriginalParent: Node | null = null;
  private overlayLayoutFrame: number | null = null;
  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;

  public readonly controller = input.required<TngDatepickerOverlayController>({
    alias: 'tngDatepickerOverlay',
  });
  public readonly anchor = input<OverlayAnchorInput>(undefined, {
    alias: 'tngDatepickerOverlayAnchor',
  });
  public readonly placement = input<TngOverlayPlacement | undefined>(undefined, {
    alias: 'tngDatepickerOverlayPlacement',
  });
  public readonly offset = input<TngOverlayOffset | undefined>(undefined, {
    alias: 'tngDatepickerOverlayOffset',
  });
  public readonly collision = input<TngOverlayCollisionOptions | undefined>(undefined, {
    alias: 'tngDatepickerOverlayCollision',
  });

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    this.renderVersion();
    return this.controller().getOutputs().open ? null : '';
  }

  @HostBinding('style.display')
  protected get display(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().open ? null : 'none';
  }

  @HostBinding('attr.data-placement')
  protected get dataPlacement(): 'bottom' | 'top' {
    this.renderVersion();
    return this.resolvedPlacement();
  }

  public constructor() {
    this.initializeOverlayPortal();

    effect((onCleanup) => {
      const controller = this.controller();
      controller.registerOverlay(this.elRef.nativeElement);
      const unsubscribe = controller.subscribe(() => {
        this.renderVersion.update((value) => value + 1);
      });

      onCleanup(() => {
        unsubscribe();
        controller.registerOverlay(null);
      });
    });

    effect(() => {
      const open = this.controller().getOutputs().open;
      this.renderVersion();
      this.placement();
      this.offset();
      this.collision();
      this.anchor();

      if (open) {
        this.mountToBodyAndPosition();
        return;
      }

      this.restoreToPlaceholder();
    });

    this.destroyRef.onDestroy(() => {
      if (this.overlayLayoutFrame !== null && this.ownerWindow !== null) {
        this.ownerWindow.cancelAnimationFrame(this.overlayLayoutFrame);
        this.overlayLayoutFrame = null;
      }

      this.teardownRepositionListeners();
      this.restoreToPlaceholder(true);
    });
  }

  private initializeOverlayPortal(): void {
    if (this.overlayPlaceholder !== null) {
      return;
    }

    const placeholderDocument = this.ownerDocument ?? document;
    const overlay = this.elRef.nativeElement;
    this.overlayPlaceholder = placeholderDocument.createComment('tng-datepicker-overlay-anchor');
    this.overlayOriginalParent = overlay.parentNode;
    const placeholder = this.overlayPlaceholder;
    if (this.overlayOriginalParent !== null && placeholder !== null) {
      this.overlayOriginalParent.insertBefore(placeholder, overlay);
    }
  }

  private findAnchorEl(): HTMLElement | null {
    const explicitAnchor = resolveAnchorElement(this.anchor());
    if (explicitAnchor !== null) {
      return explicitAnchor;
    }

    const scope =
      this.overlayPlaceholder?.parentNode instanceof HTMLElement
        ? this.overlayPlaceholder.parentNode
        : this.overlayOriginalParent instanceof HTMLElement
          ? this.overlayOriginalParent
          : null;

    return (
      scope?.querySelector('[data-slot="datepicker-input-shell"]') ??
      scope?.querySelector('[data-slot="datepicker-trigger"]')
    ) as HTMLElement | null;
  }

  private scheduleReposition(): void {
    if (!this.controller().getOutputs().open || this.ownerWindow === null) {
      return;
    }

    if (this.overlayLayoutFrame !== null) {
      this.ownerWindow.cancelAnimationFrame(this.overlayLayoutFrame);
    }

    this.overlayLayoutFrame = this.ownerWindow.requestAnimationFrame(() => {
      this.overlayLayoutFrame = null;
      this.positionOverlay();
    });
  }

  private positionOverlay(): void {
    const overlay = this.elRef.nativeElement;
    const anchor = this.findAnchorEl();
    if (anchor === null || this.ownerWindow === null) {
      return;
    }

    const anchorRect = rectFromClientRect(anchor.getBoundingClientRect());
    const viewport = viewportRect(this.ownerWindow);
    const width = Math.max(
      0,
      Math.min(anchorRect.width, viewport.width - OVERLAY_VIEWPORT_MARGIN * 2),
    );

    overlay.style.width = `${width}px`;
    overlay.style.maxWidth = `${Math.max(0, viewport.width - OVERLAY_VIEWPORT_MARGIN * 2)}px`;
    overlay.style.maxHeight = '';

    const overlayRect = rectFromClientRect(overlay.getBoundingClientRect());
    const result = computeOverlayPosition({
      anchorRect,
      collision: this.resolveCollision(),
      direction: this.resolveDirection(),
      offset: this.resolveOffset(),
      overlayRect,
      placement: this.resolvePlacement(),
      viewportRect: viewport,
    });

    overlay.style.left = `${result.x}px`;
    overlay.style.top = `${result.y}px`;

    const anchorBottom = anchorRect.top + anchorRect.height;
    const availableHeight =
      result.side === 'top'
        ? Math.max(0, Math.floor(anchorRect.top - OVERLAY_VIEWPORT_MARGIN - OVERLAY_OFFSET))
        : Math.max(
            0,
            Math.floor(viewport.height - anchorBottom - OVERLAY_VIEWPORT_MARGIN - OVERLAY_OFFSET),
          );

    if (availableHeight > 0) {
      overlay.style.maxHeight = `${availableHeight}px`;
    }

    this.resolvedPlacement.set(result.side === 'top' ? 'top' : 'bottom');
    overlay.style.visibility = '';
  }

  private setupRepositionListeners(): void {
    if (this.ownerWindow === null || this.removeResizeListener !== null || this.removeScrollListener !== null) {
      return;
    }

    const schedule = (): void => {
      this.scheduleReposition();
    };

    this.ownerWindow.addEventListener('resize', schedule);
    this.ownerWindow.addEventListener('scroll', schedule, true);
    this.removeResizeListener = () => this.ownerWindow?.removeEventListener('resize', schedule);
    this.removeScrollListener = () => this.ownerWindow?.removeEventListener('scroll', schedule, true);

    if ('ResizeObserver' in this.ownerWindow) {
      const ResizeObserverCtor = this.ownerWindow.ResizeObserver;
      this.resizeObserver = new ResizeObserverCtor(() => {
        this.scheduleReposition();
      });

      const anchor = this.findAnchorEl();
      if (anchor !== null && this.resizeObserver !== null) {
        this.resizeObserver.observe(anchor);
      }

      this.resizeObserver?.observe(this.elRef.nativeElement);
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

  private mountToBodyAndPosition(): void {
    const overlay = this.elRef.nativeElement;
    if (this.ownerDocument === null) {
      return;
    }

    this.setupRepositionListeners();

    if (overlay.parentNode !== this.ownerDocument.body) {
      this.ownerDocument.body.appendChild(overlay);
    }

    overlay.style.position = 'fixed';
    overlay.style.left = '0px';
    overlay.style.top = '0px';
    overlay.style.visibility = 'hidden';
    overlay.style.zIndex = '1000';

    queueMicrotask(() => {
      if (!this.controller().getOutputs().open) {
        return;
      }

      this.positionOverlay();
    });
  }

  private restoreToPlaceholder(force = false): void {
    const overlay = this.elRef.nativeElement;
    if (!force && overlay.parentNode !== this.ownerDocument?.body) {
      return;
    }

    const placeholder = this.overlayPlaceholder;
    if (placeholder?.parentNode !== null && placeholder !== null) {
      placeholder.parentNode.insertBefore(overlay, placeholder);
    } else if (this.overlayOriginalParent !== null) {
      this.overlayOriginalParent.appendChild(overlay);
    }

    this.teardownRepositionListeners();
    this.resolvedPlacement.set(this.resolvePlacement().side === 'top' ? 'top' : 'bottom');
    overlay.style.left = '';
    overlay.style.maxHeight = '';
    overlay.style.maxWidth = '';
    overlay.style.position = '';
    overlay.style.top = '';
    overlay.style.visibility = '';
    overlay.style.width = '';
    overlay.style.zIndex = '';
  }

  private resolvePlacement(): TngOverlayPlacement {
    return this.placement() ?? { align: 'start', side: 'bottom' };
  }

  private resolveOffset(): TngOverlayOffset {
    return this.offset() ?? { side: OVERLAY_OFFSET };
  }

  private resolveCollision(): TngOverlayCollisionOptions {
    return this.collision() ?? {
      flip: true,
      padding: OVERLAY_VIEWPORT_MARGIN,
      shift: true,
    };
  }

  private resolveDirection(): 'ltr' | 'rtl' {
    return this.controller().getOutputs().getHostAttributes()['dir'] === 'rtl' ? 'rtl' : 'ltr';
  }
}
