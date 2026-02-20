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
import { createTngIdFactory } from '@tailng-ui/cdk/core';

const createPopoverId = createTngIdFactory('tng-popover');

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export type TngPopoverCloseReason = 'escape' | 'outside-pointer' | 'programmatic' | 'trigger-toggle';

function readEventTarget(event: unknown): Node | null {
  if (!(event instanceof Event)) {
    return null;
  }

  return event.target instanceof Node ? event.target : null;
}

function readKeyboardEvent(event: unknown): KeyboardEvent | null {
  return event instanceof KeyboardEvent ? event : null;
}

function resolveDocument(value: unknown): Document | null {
  return value instanceof Document ? value : null;
}

function resolveGlobalDocument(): Document | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return document;
}

function resolveFocusableElements(container: unknown): readonly HTMLElement[] {
  if (!(container instanceof HTMLElement)) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
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

  private readonly documentRef = resolveDocument(resolveGlobalDocument());
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panelRef');
  private readonly instanceId = createPopoverId();
  private listenersAttached = false;

  private readonly documentKeydownListener = (event: unknown): void => {
    this.onDocumentKeydown(event);
  };
  private readonly documentPointerDownListener = (event: unknown): void => {
    this.onDocumentPointerDown(event);
  };
  private readonly openStateEffect = effect((): void => {
    if (this.open()) {
      this.attachListeners();
      this.focusInitialElement();
      return;
    }

    this.detachListeners();
  });

  public constructor() {
    this.panelId = `${this.instanceId}-panel`;
  }

  public close(): void {
    this.requestClose('programmatic');
  }

  public ngOnDestroy(): void {
    this.openStateEffect.destroy();
    this.detachListeners();
  }

  public onPanelKeydown(event: unknown): void {
    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent?.key !== 'Escape') {
      return;
    }

    if (!this.closeOnEscape()) {
      return;
    }

    keyboardEvent.preventDefault();
    this.requestClose('escape');
  }

  public onTriggerClick(): void {
    if (this.open()) {
      this.requestClose('trigger-toggle');
      return;
    }

    this.openChange.emit(true);
  }

  private attachListeners(): void {
    if (this.listenersAttached || this.documentRef === null) {
      return;
    }

    this.listenersAttached = true;
    this.documentRef.addEventListener('keydown', this.documentKeydownListener);
    this.documentRef.addEventListener('pointerdown', this.documentPointerDownListener);
  }

  private detachListeners(): void {
    if (!this.listenersAttached || this.documentRef === null) {
      return;
    }

    this.listenersAttached = false;
    this.documentRef.removeEventListener('keydown', this.documentKeydownListener);
    this.documentRef.removeEventListener('pointerdown', this.documentPointerDownListener);
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

  private onDocumentKeydown(event: unknown): void {
    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent?.key !== 'Escape') {
      return;
    }

    if (!this.closeOnEscape()) {
      return;
    }

    keyboardEvent.preventDefault();
    this.requestClose('escape');
  }

  private onDocumentPointerDown(event: unknown): void {
    if (!this.closeOnOutsidePointer()) {
      return;
    }

    const target = readEventTarget(event);
    if (target === null || this.hostRef.nativeElement.contains(target)) {
      return;
    }

    this.requestClose('outside-pointer');
  }

  private requestClose(reason: TngPopoverCloseReason): void {
    this.closed.emit(reason);
    this.openChange.emit(false);
  }
}
