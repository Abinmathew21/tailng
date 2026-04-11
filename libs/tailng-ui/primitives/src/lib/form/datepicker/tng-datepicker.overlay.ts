import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  applyFixedPortalledOverlayBaseStyles,
  clearFixedPortalledOverlayBaseStyles,
  clearPortalledThemeVars,
  positionFixedAnchoredOverlay,
  resolveCssCustomPropertyPx,
  syncPortalledThemeVars,
  type TngOverlayCollisionOptions,
  type TngOverlayOffset,
  type TngOverlayPlacement,
} from '@tailng-ui/cdk';
import type {
  TngDatepickerAttributeMap,
} from './datepicker.types';

type TngDatepickerOverlayController = Readonly<{
  handleOverlayKeyDown: (event: KeyboardEvent) => void;
  getOutputs: () => Readonly<{
    getHostAttributes: () => TngDatepickerAttributeMap;
    getOverlayAttributes: () => TngDatepickerAttributeMap;
    open: boolean;
  }>;
  registerOverlay: (element: HTMLElement | null) => void;
  subscribe: (listener: (event: unknown) => void) => () => void;
}>;

type OverlayAnchorInput =
  | ElementRef<HTMLElement>
  | HTMLElement
  | null
  | undefined;

const PORTALLED_DATEPICKER_THEME_VARS = [
  '--tng-datepicker-radius',
  '--tng-datepicker-field-height',
  '--tng-datepicker-overlay-gap',
  '--tng-datepicker-day-cell-size',
  '--tng-datepicker-picker-cell-size',
  '--tng-datepicker-grid-gap',
  '--tng-datepicker-inline-gap',
  '--tng-datepicker-overlay-padding',
  '--tng-datepicker-nav-size',
  '--tng-datepicker-border',
  '--tng-datepicker-border-strong',
  '--tng-datepicker-bg',
  '--tng-datepicker-surface',
  '--tng-datepicker-canvas',
  '--tng-datepicker-fg',
  '--tng-datepicker-muted',
  '--tng-datepicker-brand',
  '--tng-datepicker-danger',
  '--tng-datepicker-focus',
  '--tng-datepicker-shadow',
  '--tng-datepicker-focus-shadow',
  '--tng-datepicker-ease',
  '--tng-semantic-background-base',
  '--tng-semantic-background-surface',
  '--tng-semantic-background-canvas',
  '--tng-semantic-border-subtle',
  '--tng-semantic-border-strong',
  '--tng-semantic-foreground-primary',
  '--tng-semantic-foreground-secondary',
  '--tng-semantic-accent-brand',
  '--tng-semantic-accent-danger',
  '--tng-semantic-focus-ring',
] as const;

const OVERLAY_VIEWPORT_MARGIN = 12;
const OVERLAY_OFFSET = 9;

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

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedby(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['aria-describedby'] ?? null;
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabel(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['aria-label'] ?? null;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledby(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['aria-labelledby'] ?? null;
  }

  @HostBinding('attr.aria-modal')
  protected get ariaModal(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['aria-modal'] ?? null;
  }

  @HostBinding('attr.data-open')
  protected get dataOpen(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['data-open'] ?? null;
  }

  @HostBinding('attr.data-position')
  protected get dataPosition(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['data-position'] ?? null;
  }

  @HostBinding('attr.data-slot')
  protected get dataSlot(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['data-slot'] ?? null;
  }

  @HostBinding('attr.id')
  protected get id(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['id'] ?? null;
  }

  @HostBinding('attr.role')
  protected get role(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['role'] ?? null;
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.controller().handleOverlayKeyDown(event);
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

    const result = positionFixedAnchoredOverlay({
      anchor,
      collision: this.resolveCollision(),
      direction: this.resolveDirection(),
      offset: this.resolveOffset(),
      overlay,
      placement: this.resolvePlacement(),
      viewportMargin: OVERLAY_VIEWPORT_MARGIN,
      windowRef: this.ownerWindow,
    });
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

  private syncPortalledThemeVars(): void {
    const overlay = this.elRef.nativeElement;
    const themeSource = this.findAnchorEl();
    if (themeSource === null) {
      return;
    }

    syncPortalledThemeVars({
      cssVars: PORTALLED_DATEPICKER_THEME_VARS,
      panel: overlay,
      source: themeSource,
    });
  }

  private clearPortalledThemeVars(): void {
    clearPortalledThemeVars(this.elRef.nativeElement, PORTALLED_DATEPICKER_THEME_VARS);
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

    applyFixedPortalledOverlayBaseStyles(overlay);
    this.syncPortalledThemeVars();

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
    this.clearPortalledThemeVars();
    clearFixedPortalledOverlayBaseStyles(overlay);
    overlay.style.maxHeight = '';
    overlay.style.maxWidth = '';
    overlay.style.width = '';
  }

  private resolvePlacement(): TngOverlayPlacement {
    return this.placement() ?? { align: 'start', side: 'bottom' };
  }

  private resolveOffset(): TngOverlayOffset {
    const explicitOffset = this.offset();
    if (explicitOffset !== undefined) {
      return explicitOffset;
    }

    const themeSource = this.findAnchorEl();
    return {
      side:
        themeSource === null
          ? OVERLAY_OFFSET
          : resolveCssCustomPropertyPx(
              themeSource,
              '--tng-datepicker-overlay-gap',
              OVERLAY_OFFSET,
            ),
    };
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
