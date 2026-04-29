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

const PORTALLED_MULTI_AUTOCOMPLETE_THEME_VARS = [
  '--tng-multi-autocomplete-radius',
  '--tng-multi-autocomplete-padding',
  '--tng-multi-autocomplete-trigger-py',
  '--tng-multi-autocomplete-trigger-px',
  '--tng-multi-autocomplete-chip-py',
  '--tng-multi-autocomplete-chip-px',
  '--tng-multi-autocomplete-option-py',
  '--tng-multi-autocomplete-option-px',
  '--tng-multi-autocomplete-z-overlay',
  '--tng-multi-autocomplete-overlay-z-index',
  '--tng-z-overlay',
  '--tng-multi-autocomplete-border',
  '--tng-multi-autocomplete-border-strong',
  '--tng-multi-autocomplete-bg',
  '--tng-multi-autocomplete-surface',
  '--tng-multi-autocomplete-fg',
  '--tng-multi-autocomplete-muted',
  '--tng-multi-autocomplete-brand',
  '--tng-multi-autocomplete-danger',
  '--tng-multi-autocomplete-focus-ring',
  '--tng-multi-autocomplete-ease',
  '--tng-multi-autocomplete-shadow',
  '--tng-multi-autocomplete-shadow-focus',
] as const;

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

  private syncPortalledThemeVars(): void {
    const panel = this.elRef.nativeElement;
    const hostStyles = getComputedStyle(this.multi.hostElement);

    for (const cssVar of PORTALLED_MULTI_AUTOCOMPLETE_THEME_VARS) {
      const value = hostStyles.getPropertyValue(cssVar).trim();
      if (value) {
        panel.style.setProperty(cssVar, value);
      } else {
        panel.style.removeProperty(cssVar);
      }
    }

    const colorScheme = hostStyles.colorScheme?.trim();
    if (colorScheme && colorScheme !== 'normal') {
      panel.style.colorScheme = colorScheme;
    } else {
      panel.style.removeProperty('color-scheme');
    }
  }

  private applyPortalledStacking(): void {
    this.elRef.nativeElement.style.zIndex =
      'var(--tng-multi-autocomplete-z-overlay, var(--tng-multi-autocomplete-overlay-z-index, var(--tng-z-overlay, 2)))';
  }

  private clearPortalledThemeVars(): void {
    const panel = this.elRef.nativeElement;

    for (const cssVar of PORTALLED_MULTI_AUTOCOMPLETE_THEME_VARS) {
      panel.style.removeProperty(cssVar);
    }

    panel.style.removeProperty('color-scheme');
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
    this.syncPortalledThemeVars();
    this.applyPortalledStacking();

    queueMicrotask(() => {
      if (!this.multi.open()) return;

      const anchor = rectFromClientRect(this.findAnchorEl().getBoundingClientRect());
      const viewportWidth = viewportRect().width;
      const inlineSize = Math.max(0, Math.min(anchor.width, viewportWidth - 16));
      panel.style.width = `${inlineSize}px`;
      panel.style.minWidth = `${inlineSize}px`;
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
    panel.style.width = '';
    panel.style.minWidth = '';
    this.clearPortalledThemeVars();
    this.teardownOutsidePointer();
  }
}
