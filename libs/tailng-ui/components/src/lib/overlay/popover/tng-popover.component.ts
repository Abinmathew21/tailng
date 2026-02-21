import {
  afterNextRender,
  booleanAttribute,
  Component,
  ElementRef,
  effect,
  inject,
  Injector,
  input,
  output,
  viewChild,
} from '@angular/core';
import type { OnDestroy } from '@angular/core';
import { createTngIdFactory, type TngOverlayDismissReason } from '@tailng-ui/cdk';
import { tngOverlayRuntime } from '../tng-overlay-runtime';

const createPopoverId = createTngIdFactory('tng-popover');

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export type TngPopoverCloseReason =
  | 'escape'
  | 'outside-pointer'
  | 'programmatic'
  | 'trigger-toggle';

function resolveFocusableElements(container: unknown): readonly HTMLElement[] {
  if (!(container instanceof HTMLElement)) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
}

function toPopoverCloseReason(reason: TngOverlayDismissReason): TngPopoverCloseReason | null {
  if (reason === 'escape-key') {
    return 'escape';
  }

  if (reason === 'outside-pointer') {
    return 'outside-pointer';
  }

  return null;
}

@Component({
  selector: 'tng-popover',
  templateUrl: './tng-popover.component.html',
  styleUrl: './tng-popover.component.css',
})
export class TngPopover implements OnDestroy {
  public readonly ariaLabel = input<string>('Popover');
  public readonly closeOnEscape = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnOutsidePointer = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly triggerLabel = input<string>('Toggle Popover');

  public readonly closed = output<TngPopoverCloseReason>();
  public readonly openChange = output<boolean>();

  protected readonly panelId: string;

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panelRef');
  private readonly instanceId = createPopoverId();
  private isLayerRegistered = false;
  private readonly openStateEffect = effect((): void => {
    if (this.open()) {
      this.registerOverlayLayer();
      this.focusInitialElement();
      return;
    }

    this.unregisterOverlayLayer();
  });

  public constructor() {
    this.panelId = `${this.instanceId}-panel`;
  }

  public close(): void {
    this.requestClose('programmatic');
  }

  public ngOnDestroy(): void {
    this.openStateEffect.destroy();
    this.unregisterOverlayLayer();
  }

  public onTriggerClick(): void {
    if (this.open()) {
      this.requestClose('trigger-toggle');
      return;
    }

    this.openChange.emit(true);
  }

  private handleOverlayDismiss(reason: TngOverlayDismissReason): void {
    const closeReason = toPopoverCloseReason(reason);
    if (closeReason === null) {
      return;
    }

    this.requestClose(closeReason);
  }

  private registerOverlayLayer(): void {
    if (this.isLayerRegistered) {
      return;
    }

    this.isLayerRegistered = true;
    tngOverlayRuntime.registerLayer({
      containsTarget: (target: unknown): boolean => {
        return target instanceof Node ? this.hostRef.nativeElement.contains(target) : false;
      },
      dismissOnEscape: this.closeOnEscape(),
      dismissOnOutsidePointer: this.closeOnOutsidePointer(),
      id: this.instanceId,
      onDismiss: (reason: TngOverlayDismissReason): void => {
        this.handleOverlayDismiss(reason);
      },
      priority: 110,
    });
  }

  private unregisterOverlayLayer(): void {
    if (!this.isLayerRegistered) {
      return;
    }

    this.isLayerRegistered = false;
    tngOverlayRuntime.unregisterLayer(this.instanceId);
  }

  private focusInitialElement(): void {
    afterNextRender(
      (): void => {
        const panel = this.panelRef()?.nativeElement;
        if (panel === undefined) {
          return;
        }

        const firstFocusable = resolveFocusableElements(panel)[0];
        if (firstFocusable !== undefined) {
          firstFocusable.focus();
          return;
        }

        panel.focus();
      },
      { injector: this.injector },
    );
  }

  private requestClose(reason: TngPopoverCloseReason): void {
    this.closed.emit(reason);
    this.openChange.emit(false);
  }
}
