// libs/tailng-ui/primitives/src/lib/form/select/tng-select.overlay.ts
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

import { TNG_SELECT } from './tng-select.tokens';
import type { TngSelect } from './tng-select';

type MaybeRect = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

function rectFromClientRect(r: DOMRect | ClientRect): MaybeRect {
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function viewportRect(): MaybeRect {
  // JSDOM has window.innerWidth/innerHeight
  return { left: 0, top: 0, width: window.innerWidth || 1024, height: window.innerHeight || 768 };
}

function isInside(target: EventTarget | null, container: HTMLElement): boolean {
  return !!target && target instanceof Node && container.contains(target);
}

/**
 * Mode-2 overlay panel:
 * - Trigger owns combobox ARIA + Escape behavior
 * - Overlay just portals + positions + outside pointer close
 */
@Directive({
  selector: '[tngSelectOverlay]',
  exportAs: 'tngSelectOverlay',
  standalone: true,
})
export class TngSelectOverlay {
  private readonly select = inject<TngSelect>(TNG_SELECT);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  // ---- positioning knobs (optional) ----
  readonly placement = input<TngOverlayPlacement | undefined>(undefined);
  readonly offset = input<TngOverlayOffset | undefined>(undefined);
  readonly collision = input<TngOverlayCollisionOptions | undefined>(undefined);

  // ---- styling hooks ----
  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-overlay' = 'select-overlay';

  // keep "hidden" semantics (even though we portal)
  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.select.open() ? null : '';
  }

  // We portal the *same element* to body, so we need a placeholder
  private placeholder: Comment | null = null;
  private originalParent: Node | null = null;

  private removeDocPointerListener: (() => void) | null = null;

  constructor() {
    // create placeholder once
    this.placeholder = document.createComment('tng-select-overlay-anchor');
    const hostEl = this.elRef.nativeElement;

    // remember initial location
    this.originalParent = hostEl.parentNode;

    // insert placeholder right before host element (so we can restore)
    this.originalParent?.insertBefore(this.placeholder, hostEl);

    // react to open/close
    effect(() => {
      const open = this.select.open();
      if (open) this.mountToBodyAndPosition();
      else this.restoreToPlaceholder();
    });

    this.destroyRef.onDestroy(() => {
      this.teardownOutsidePointer();
      // restore to avoid leaving detached nodes
      this.restoreToPlaceholder(true);
      this.placeholder = null;
      this.originalParent = null;
    });
  }

  private findTriggerEl(): HTMLElement | null {
    // Mode-2 convention: trigger has data-slot="select-trigger"
    // Use select host element (not overlay.closest) so we work when overlay is portaled to body
    const root = this.select.hostElement;
    return root.querySelector('[data-slot="select-trigger"]') as HTMLElement | null;
  }

  private mountToBodyAndPosition(): void {
    const panel = this.elRef.nativeElement;

    // already mounted?
    if (panel.parentNode !== document.body) {
      document.body.appendChild(panel);
    }

    // ensure panel is measurable; hidden binding is driven by select.open()
    // position with fixed so scroll doesn't detach
    panel.style.position = 'fixed';
    panel.style.left = '0px';
    panel.style.top = '0px';
    panel.style.zIndex = '1000';

    // defer measurement to next microtask so layout settles in tests too
    queueMicrotask(() => {
      // might have closed quickly
      if (!this.select.open()) return;

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
        // direction can be inferred later; keep default ltr for now
      });

      panel.style.left = `${result.x}px`;
      panel.style.top = `${result.y}px`;
    });

    this.setupOutsidePointer();
  }

  private restoreToPlaceholder(force = false): void {
    const panel = this.elRef.nativeElement;

    // if not in body and not forced, nothing to do
    if (!force && panel.parentNode !== document.body) {
      this.teardownOutsidePointer();
      return;
    }

    // restore to where placeholder is
    if (this.placeholder?.parentNode) {
      this.placeholder.parentNode.insertBefore(panel, this.placeholder);
    } else if (this.originalParent) {
      this.originalParent.appendChild(panel);
    }

    // cleanup inline positioning (optional)
    panel.style.position = '';
    panel.style.left = '';
    panel.style.top = '';
    panel.style.zIndex = '';

    this.teardownOutsidePointer();
  }

  private setupOutsidePointer(): void {
    if (this.removeDocPointerListener) return;

    const onPointerDown = (ev: PointerEvent) => {
      if (!this.select.open()) return;

      const panel = this.elRef.nativeElement;
      const trigger = this.findTriggerEl();

      // click inside panel or trigger => ignore
      if (isInside(ev.target, panel)) return;
      if (trigger && isInside(ev.target, trigger)) return;

      // outside => close
      this.select.close();
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
}