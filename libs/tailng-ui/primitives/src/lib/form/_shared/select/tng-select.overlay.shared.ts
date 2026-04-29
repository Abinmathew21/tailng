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

import { TNG_SELECT_HOST } from './tng-select.tokens.shared';
import type { TngSelectHostApi } from './tng-select.host-api';

type MaybeRect = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

const PORTALLED_SELECT_THEME_VARS = [
  '--tng-select-radius',
  '--tng-select-trigger-width',
  '--tng-select-trigger-min-height',
  '--tng-select-trigger-py',
  '--tng-select-trigger-px',
  '--tng-select-trigger-gap',
  '--tng-select-icon-size',
  '--tng-select-icon-opacity',
  '--tng-select-icon-margin-inline-start',
  '--tng-select-overlay-padding',
  '--tng-select-overlay-radius',
  '--tng-select-overlay-shadow',
  '--tng-select-overlay-max-width',
  '--tng-select-z-overlay',
  '--tng-select-overlay-z-index',
  '--tng-z-overlay',
  '--tng-select-overlay-border',
  '--tng-select-overlay-bg',
  '--tng-select-overlay-max-height',
  '--tng-select-listbox-gap',
  '--tng-select-option-min-height',
  '--tng-select-option-py',
  '--tng-select-option-px',
  '--tng-select-option-radius',
  '--tng-select-option-bg-active',
  '--tng-select-option-border-active',
  '--tng-select-option-bg-selected',
  '--tng-select-option-border-selected',
  '--tng-select-option-fg-selected',
  '--tng-select-option-bg-selected-active',
  '--tng-select-option-border-selected-active',
  '--tng-select-option-shadow-selected-active',
  '--tng-select-option-disabled-opacity',
  '--tng-select-option-font-weight',
  '--tng-select-value-font-size',
  '--tng-select-value-font-weight',
  '--tng-select-value-color',
  '--tng-select-icon-margin-inline-end',
  '--tng-select-border',
  '--tng-select-border-strong',
  '--tng-select-border-hover',
  '--tng-select-bg',
  '--tng-select-surface',
  '--tng-select-fg',
  '--tng-select-muted',
  '--tng-select-brand',
  '--tng-select-danger',
  '--tng-select-focus-ring',
  '--tng-select-ease',
  '--tng-select-shadow',
  '--tng-select-shadow-focus',
  '--tng-semantic-background-base',
  '--tng-semantic-background-surface',
  '--tng-semantic-border-subtle',
  '--tng-semantic-border-strong',
  '--tng-semantic-foreground-primary',
  '--tng-semantic-foreground-secondary',
  '--tng-semantic-foreground-muted',
  '--tng-semantic-accent-brand',
  '--tng-semantic-accent-danger',
  '--tng-semantic-focus-ring',
] as const;

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
  selector: '[tngSelectOverlay]',
  exportAs: 'tngSelectOverlay',
})
export class TngSelectOverlay {
  private readonly host = inject<TngSelectHostApi>(TNG_SELECT_HOST);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  private lastFocusedBeforeOpen: HTMLElement | null = null;
  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;

  readonly placement = input<TngOverlayPlacement | undefined>(undefined);
  readonly offset = input<TngOverlayOffset | undefined>(undefined);
  readonly collision = input<TngOverlayCollisionOptions | undefined>(undefined);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-overlay' = 'select-overlay';

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.host.open() ? null : '';
  }

  private placeholder: Comment | null = null;
  private originalParent: Node | null = null;
  private removeDocPointerListener: (() => void) | null = null;

  constructor() {
    this.placeholder = document.createComment('tng-select-overlay-anchor');
    const hostEl = this.elRef.nativeElement;
    this.originalParent = hostEl.parentNode;
    this.originalParent?.insertBefore(this.placeholder, hostEl);

    effect(() => {
      const open = this.host.open();
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

  private reposition(): void {
    if (!this.host.open()) return;
    const panel = this.elRef.nativeElement;
    const trigger = this.findTriggerEl();
    if (!trigger) return;

    const anchor = rectFromClientRect(trigger.getBoundingClientRect());
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
      const trigger = this.findTriggerEl();
      if (trigger) this.resizeObserver.observe(trigger);
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

  private findTriggerEl(): HTMLElement | null {
    const root = this.host.hostElement;
    return root.querySelector('[data-slot="select-trigger"]') as HTMLElement | null;
  }

  private syncPortalledThemeVars(): void {
    const panel = this.elRef.nativeElement;
    const hostStyles = getComputedStyle(this.host.hostElement);

    for (const cssVar of PORTALLED_SELECT_THEME_VARS) {
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
      'var(--tng-select-z-overlay, var(--tng-select-overlay-z-index, var(--tng-z-overlay, 2)))';
  }

  private clearPortalledThemeVars(): void {
    const panel = this.elRef.nativeElement;

    for (const cssVar of PORTALLED_SELECT_THEME_VARS) {
      panel.style.removeProperty(cssVar);
    }

    panel.style.removeProperty('color-scheme');
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
    this.syncPortalledThemeVars();
    this.applyPortalledStacking();

    queueMicrotask(() => {
      if (!this.host.open()) return;
      const trigger = this.findTriggerEl();
      if (!trigger) return;

      const anchor = rectFromClientRect(trigger.getBoundingClientRect());
      const viewportWidth = viewportRect().width;
      const inlineSize = Math.max(0, Math.min(anchor.width, viewportWidth - 16));
      panel.style.width = `${inlineSize}px`;
      panel.style.minWidth = `${inlineSize}px`;

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
      const panelEl = this.elRef.nativeElement;
      if (!active || panelEl.contains(active)) {
        this.lastFocusedBeforeOpen.focus();
      }
    }

    this.restoreFocusOnClose();
    panel.style.position = '';
    panel.style.left = '';
    panel.style.top = '';
    panel.style.zIndex = '';
    panel.style.width = '';
    panel.style.minWidth = '';
    this.clearPortalledThemeVars();
    this.teardownOutsidePointer();
  }

  private setupOutsidePointer(): void {
    if (this.removeDocPointerListener) return;

    const onPointerDown = (ev: PointerEvent) => {
      if (!this.host.open()) return;
      const panel = this.elRef.nativeElement;
      const trigger = this.findTriggerEl();
      if (isInside(ev.target, panel)) return;
      if (trigger && isInside(ev.target, trigger)) return;
      if (
        this.host.multiple() &&
        ev.target &&
        (ev.target as Element).closest?.(
          '[data-slot="select-option"], [data-slot="multi-select-option"]'
        )
      )
        return;
      this.host.close();
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    this.removeDocPointerListener = () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }

  private teardownOutsidePointer(): void {
    this.removeDocPointerListener?.();
    this.removeDocPointerListener = null;
  }

  private restoreFocusOnClose(): void {
    const panel = this.elRef.nativeElement;
    const active = document.activeElement as HTMLElement | null;
    if (active && panel.contains(active)) {
      const trigger = this.findTriggerEl();
      trigger?.focus();
      return;
    }
    if (document.activeElement === document.body) {
      const trigger = this.findTriggerEl();
      trigger?.focus();
    }
  }
}
