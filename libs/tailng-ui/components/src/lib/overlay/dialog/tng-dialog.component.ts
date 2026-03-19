import {
  afterNextRender,
  booleanAttribute,
  Component,
  effect,
  inject,
  Injector,
  input,
  output,
  viewChild,
} from '@angular/core';
import type { ElementRef, OnDestroy } from '@angular/core';
import {
  createOverlayScrollLockManager,
  createTngIdFactory,
  type TngOverlayDismissReason,
} from '@tailng-ui/cdk';
import type { TngScrollLockDocument } from '@tailng-ui/cdk/overlay';
import { tngOverlayRuntime } from '../tng-overlay-runtime';

const createDialogId = createTngIdFactory('tng-dialog');

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

type TngFocusTrapState = Readonly<{
  activeElement: HTMLElement | null;
  first: HTMLElement;
  last: HTMLElement;
  panel: HTMLElement;
}>;

export type TngDialogCloseReason = 'backdrop' | 'close-button' | 'escape' | 'programmatic';
export type TngDialogSize = 'lg' | 'md' | 'sm';

function readKeyboardEvent(event: unknown): KeyboardEvent | null {
  return event instanceof KeyboardEvent ? event : null;
}

function resolveActiveElement(documentRef: unknown): HTMLElement | null {
  if (!(documentRef instanceof Document)) {
    return null;
  }

  const activeElement = documentRef.activeElement;
  return activeElement instanceof HTMLElement ? activeElement : null;
}

function resolveFocusableElements(container: unknown): readonly HTMLElement[] {
  if (!(container instanceof HTMLElement)) {
    return [];
  }

  const candidates = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
  const focusableElements: HTMLElement[] = [];
  for (const candidate of candidates) {
    if (!candidate.hasAttribute('disabled')) {
      focusableElements.push(candidate);
    }
  }

  return focusableElements;
}

function resolveFirstFocusableWithin(container: unknown): HTMLElement | null {
  return resolveFocusableElements(container)[0] ?? null;
}

function resolveMarkedInitialElement(container: unknown): HTMLElement | null {
  if (!(container instanceof HTMLElement)) {
    return null;
  }

  const markedInitial = container.querySelector<HTMLElement>('[data-tng-dialog-initial-focus]');
  if (markedInitial === null) {
    return null;
  }

  if (resolveFocusableElements(container).includes(markedInitial)) {
    return markedInitial;
  }

  return resolveFirstFocusableWithin(markedInitial);
}

function toScrollLockDocument(documentRef: unknown): TngScrollLockDocument | null {
  if (!(documentRef instanceof Document)) {
    return null;
  }

  return documentRef as unknown as TngScrollLockDocument;
}

function toDialogCloseReason(reason: TngOverlayDismissReason): TngDialogCloseReason | null {
  if (reason === 'escape-key') {
    return 'escape';
  }

  if (reason === 'outside-pointer') {
    return 'backdrop';
  }

  return null;
}

@Component({
  selector: 'tng-dialog',
  templateUrl: './tng-dialog.component.html',
  styleUrl: './tng-dialog.component.css',
})
export class TngDialogComponent implements OnDestroy {
  public readonly closeOnBackdrop = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnEscape = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly description = input<string | null>(null);
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly size = input<TngDialogSize>('md');
  public readonly title = input<string>('Dialog');

  public readonly closed = output<TngDialogCloseReason>();
  public readonly openChange = output<boolean>();

  protected readonly descriptionId: string;
  protected readonly panelId: string;
  protected readonly titleId: string;

  private readonly documentRef = typeof document === 'undefined' ? null : document;
  private readonly injector = inject(Injector);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panelRef');
  private readonly scrollLock = createOverlayScrollLockManager({
    documentRef: toScrollLockDocument(this.documentRef),
  });
  private readonly instanceId = createDialogId();
  private isActive = false;
  private isLayerRegistered = false;
  private restoreFocusElement: HTMLElement | null = null;

  private readonly openStateEffect = effect((): void => {
    if (this.open()) {
      this.activateDialog();
      return;
    }

    this.deactivateDialog();
  });

  public constructor() {
    this.descriptionId = `${this.instanceId}-description`;
    this.panelId = `${this.instanceId}-panel`;
    this.titleId = `${this.instanceId}-title`;
  }

  public close(): void {
    this.requestClose('programmatic');
  }

  public ngOnDestroy(): void {
    this.openStateEffect.destroy();
    this.deactivateDialog();
  }

  public onCloseButtonClick(): void {
    this.requestClose('close-button');
  }

  public onPanelKeydown(event: unknown): void {
    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent === null) {
      return;
    }

    if (keyboardEvent.key === 'Tab') {
      this.trapTabNavigation(event);
    }
  }

  private activateDialog(): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.registerOverlayLayer();
    this.restoreFocusElement = resolveActiveElement(this.documentRef);
    this.scrollLock.acquire(this.instanceId);
    afterNextRender(
      (): void => {
        this.focusInitialElement();
      },
      { injector: this.injector },
    );
  }

  private deactivateDialog(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    this.unregisterOverlayLayer();
    this.scrollLock.release(this.instanceId);
    this.restoreFocusElement?.focus();
    this.restoreFocusElement = null;
  }

  private handleOverlayDismiss(reason: TngOverlayDismissReason): void {
    const closeReason = toDialogCloseReason(reason);
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
      containsTarget: (target: unknown, path: readonly unknown[]): boolean => {
        const panel = this.panelRef()?.nativeElement;
        if (panel === undefined) {
          return false;
        }

        if (path.includes(panel)) {
          return true;
        }

        return target instanceof Node ? panel.contains(target) : false;
      },
      dismissOnEscape: this.closeOnEscape(),
      dismissOnOutsidePointer: this.closeOnBackdrop(),
      id: this.instanceId,
      modal: true,
      onDismiss: (reason: TngOverlayDismissReason): void => {
        this.handleOverlayDismiss(reason);
      },
      priority: 100,
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
    const panel = this.panelRef()?.nativeElement;
    if (panel === undefined) {
      return;
    }

    const markedInitial = resolveMarkedInitialElement(panel);
    if (markedInitial !== null) {
      markedInitial.focus();
      return;
    }

    const firstFocusable = resolveFirstFocusableWithin(panel);
    if (firstFocusable !== null) {
      firstFocusable.focus();
      return;
    }

    panel.focus();
  }

  private preventAndFocus(event: unknown, target: unknown): void {
    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent === null || !(target instanceof HTMLElement)) {
      return;
    }

    keyboardEvent.preventDefault();
    target.focus();
  }

  private requestClose(reason: TngDialogCloseReason): void {
    this.closed.emit(reason);
    this.openChange.emit(false);
  }

  private resolveFocusTrapState(panel: unknown): TngFocusTrapState | null {
    if (!(panel instanceof HTMLElement)) {
      return null;
    }

    const focusableElements = resolveFocusableElements(panel);
    const first = focusableElements[0];
    if (first === undefined) {
      return null;
    }

    return {
      activeElement: resolveActiveElement(this.documentRef),
      first,
      last: focusableElements[focusableElements.length - 1] ?? first,
      panel,
    };
  }

  private focusEdgeWhenOutsidePanel(event: unknown, focusState: unknown): boolean {
    const state = focusState as TngFocusTrapState;
    const activeElement = state.activeElement;
    if (activeElement !== null && state.panel.contains(activeElement)) {
      return false;
    }

    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent === null) {
      return true;
    }

    const edge = keyboardEvent.shiftKey ? state.last : state.first;
    this.preventAndFocus(keyboardEvent, edge);
    return true;
  }

  private wrapTabAtEdges(event: unknown, focusState: unknown): void {
    const state = focusState as TngFocusTrapState;
    const keyboardEvent = readKeyboardEvent(event);
    if (keyboardEvent === null) {
      return;
    }

    if (keyboardEvent.shiftKey && state.activeElement === state.first) {
      this.preventAndFocus(keyboardEvent, state.last);
      return;
    }

    if (!keyboardEvent.shiftKey && state.activeElement === state.last) {
      this.preventAndFocus(keyboardEvent, state.first);
    }
  }

  private trapTabNavigation(event: unknown): void {
    const panel = this.panelRef()?.nativeElement;
    if (panel === undefined) {
      return;
    }

    const focusState = this.resolveFocusTrapState(panel);
    if (focusState === null) {
      this.preventAndFocus(event, panel);
      return;
    }

    if (this.focusEdgeWhenOutsidePanel(event, focusState)) {
      return;
    }

    this.wrapTabAtEdges(event, focusState);
  }
}
