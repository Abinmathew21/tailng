import { Component, effect, input, output, signal, viewChild } from '@angular/core';
import type { OnDestroy } from '@angular/core';
import {
  createTngIdFactory,
  createTngKeyedTimerController,
  resolveFocusableElements,
} from '@tailng-ui/cdk';
import type { ElementRef } from '@angular/core';
import type { TngOverlayDismissReason } from '@tailng-ui/cdk';
import type { TngToastTone } from '@tailng-ui/primitives';
import {
  TngToastItem as TngToastItemPrimitive,
  TngToastViewport as TngToastViewportPrimitive,
} from '@tailng-ui/primitives';
import { tngOverlayFocusHandoff } from '../../overlay/tng-overlay-focus-handoff';
import { tngOverlayRuntime } from '../../overlay/tng-overlay-runtime';

export type TngToastMode = 'snackbar' | 'toast';
export type TngToastPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
export type TngToastDismissReason = 'escape' | 'manual' | 'timeout';

export type TngToastDismissEvent = Readonly<{
  id: string;
  reason: TngToastDismissReason;
}>;

export type TngToastAction = Readonly<{
  dismissOnSelect: boolean;
  label: string;
  onSelect?: (id: string) => void;
}>;

export type TngToastActionOptions = Readonly<{
  dismissOnSelect?: boolean;
  label: string;
  onSelect?: (id: string) => void;
}>;

export type TngToastOptions = Readonly<
  Partial<{
    action: TngToastActionOptions | null;
    duration: number;
    title: string | null;
    tone: TngToastTone;
  }>
>;

type TngToastRecord = Readonly<{
  action: TngToastAction | null;
  duration: number;
  id: string;
  message: string;
  title: string | null;
  tone: TngToastTone;
}>;

const createToastLayerId = createTngIdFactory('tng-toast-layer');

export function normalizeTngToastDuration(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return value;
}

export function normalizeTngToastMaxVisible(value: number): number {
  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

export function resolveTngToastNextSlice<TValue>(
  values: readonly TValue[],
  maxVisible: number,
): readonly TValue[] {
  if (values.length <= maxVisible) {
    return values;
  }

  return values.slice(values.length - maxVisible);
}

export function shouldDismissTngToastForKey(key: string): boolean {
  return key === 'Escape';
}

function mapOverlayDismissReasonToToastDismissReason(
  reason: TngOverlayDismissReason,
): TngToastDismissReason | null {
  if (reason === 'escape-key') {
    return 'escape';
  }

  return null;
}

function normalizeTngToastAction(
  action: TngToastActionOptions | null | undefined,
): TngToastAction | null {
  if (action === null || action === undefined) {
    return null;
  }

  const normalizedLabel = action.label.trim();
  if (normalizedLabel.length === 0) {
    return null;
  }

  return {
    dismissOnSelect: action.dismissOnSelect ?? true,
    label: normalizedLabel,
    onSelect: action.onSelect,
  };
}

@Component({
  selector: 'tng-toast',
  imports: [TngToastItemPrimitive, TngToastViewportPrimitive],
  templateUrl: './tng-toast.component.html',
  styleUrl: './tng-toast.component.css',
})
export class TngToastComponent implements OnDestroy {
  private readonly createToastId = createTngIdFactory('tng-toast');
  private readonly dismissTimers = createTngKeyedTimerController<string>();
  private readonly documentRef = typeof document === 'undefined' ? null : document;
  private readonly overlayLayerId = createToastLayerId();
  private readonly createToastFocusId = createTngIdFactory('tng-toast-focus', this.overlayLayerId);
  private isFocusLayerActive = false;
  private isFocusLayerRegistered = false;
  private isOverlayLayerRegistered = false;

  public readonly duration = input<number>(4000);
  public readonly maxVisible = input<number>(4);
  public readonly mode = input<TngToastMode>('toast');
  public readonly position = input<TngToastPosition>('bottom-right');

  public readonly dismissed = output<string>();
  public readonly dismissedWithReason = output<TngToastDismissEvent>();
  protected readonly toasts = signal<readonly TngToastRecord[]>([]);
  protected readonly viewportRef = viewChild<ElementRef<HTMLElement>>('viewportRef');

  private readonly overlayLayerEffect = effect((): void => {
    if (this.toasts().length > 0) {
      this.registerOverlayLayer();
      this.activateFocusLayer();
      return;
    }

    this.deactivateFocusLayer();
    this.unregisterOverlayLayer();
  });

  public dismiss(id: string, reason: TngToastDismissReason = 'manual'): void {
    const currentToasts = this.toasts();
    const nextToasts = currentToasts.filter((toast) => toast.id !== id);
    if (nextToasts.length === currentToasts.length) {
      return;
    }

    this.clearDismissTimer(id);
    this.toasts.set(nextToasts);
    this.dismissedWithReason.emit({
      id,
      reason,
    });
    this.dismissed.emit(id);
  }

  public ngOnDestroy(): void {
    this.overlayLayerEffect.destroy();
    this.deactivateFocusLayer();
    this.unregisterFocusLayer();
    this.unregisterOverlayLayer();
    this.dismissTimers.clearAll();
  }

  public show(message: string, options: TngToastOptions = {}): string {
    const id = this.createToastId();
    const fallbackDuration = this.duration();
    const resolvedDuration = normalizeTngToastDuration(
      options.duration ?? fallbackDuration,
      fallbackDuration,
    );
    const resolvedAction = normalizeTngToastAction(options.action);
    const nextToast: TngToastRecord = {
      action: resolvedAction,
      duration: resolvedDuration,
      id,
      message,
      title: options.title ?? null,
      tone: options.tone ?? 'neutral',
    };

    const previousToasts = this.toasts();
    const visibleLimit = normalizeTngToastMaxVisible(this.maxVisible());
    const nextToasts = resolveTngToastNextSlice([...previousToasts, nextToast], visibleLimit);
    const nextIds = new Set(nextToasts.map((toast) => toast.id));

    for (const previousToast of previousToasts) {
      if (!nextIds.has(previousToast.id)) {
        this.clearDismissTimer(previousToast.id);
      }
    }

    this.toasts.set(nextToasts);
    this.scheduleDismiss(nextToast);
    return id;
  }

  protected onActionClick(toast: TngToastRecord): void {
    toast.action?.onSelect?.(toast.id);
    if (toast.action?.dismissOnSelect ?? false) {
      this.dismiss(toast.id, 'manual');
    }
  }

  protected onViewportFocusin(event: FocusEvent): void {
    const viewportElement = this.viewportRef()?.nativeElement;
    if (viewportElement === undefined) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement) || !viewportElement.contains(target)) {
      return;
    }

    const targetId = this.ensureElementId(target);
    tngOverlayFocusHandoff.recordFocus(this.overlayLayerId, targetId);
  }

  private clearDismissTimer(id: string): void {
    this.dismissTimers.cancel(id);
  }

  private handleOverlayDismiss(reason: TngOverlayDismissReason): void {
    const dismissReason = mapOverlayDismissReasonToToastDismissReason(reason);
    if (dismissReason === null) {
      return;
    }

    const toastId = this.resolveEscapeDismissToastId();
    if (toastId === null) {
      return;
    }

    this.dismiss(toastId, dismissReason);
  }

  private registerOverlayLayer(): void {
    if (this.isOverlayLayerRegistered) {
      return;
    }

    this.isOverlayLayerRegistered = true;
    tngOverlayRuntime.registerLayer({
      containsTarget: (target: unknown, path: readonly unknown[]): boolean => {
        const viewportElement = this.viewportRef()?.nativeElement;
        if (viewportElement === undefined) {
          return false;
        }

        if (path.includes(viewportElement)) {
          return true;
        }

        return target instanceof Node ? viewportElement.contains(target) : false;
      },
      dismissOnEscape: true,
      dismissOnOutsidePointer: false,
      id: this.overlayLayerId,
      onDismiss: (reason: TngOverlayDismissReason): void => {
        this.handleOverlayDismiss(reason);
      },
      priority: -100,
    });
  }

  private resolveEscapeDismissToastId(): string | null {
    const latestToast = this.toasts()[this.toasts().length - 1];
    const fallbackToastId = latestToast?.id ?? null;

    const viewportElement = this.viewportRef()?.nativeElement;
    if (viewportElement === undefined || this.documentRef === null) {
      return fallbackToastId;
    }

    const activeElement = this.documentRef.activeElement;
    if (!(activeElement instanceof HTMLElement) || !viewportElement.contains(activeElement)) {
      return fallbackToastId;
    }

    const focusedToast = activeElement.closest<HTMLElement>('[data-slot="toast-item"][data-toast-id]');
    return focusedToast?.getAttribute('data-toast-id') ?? fallbackToastId;
  }

  private activateFocusLayer(): void {
    this.registerFocusLayer();
    if (this.isFocusLayerActive) {
      return;
    }

    this.isFocusLayerActive = true;
    const activeElementId = this.resolveActiveElementId();
    tngOverlayFocusHandoff.activateLayer(this.overlayLayerId, activeElementId);
  }

  private deactivateFocusLayer(): void {
    if (!this.isFocusLayerActive) {
      return;
    }

    this.isFocusLayerActive = false;
    const restoreFocusTargetId = tngOverlayFocusHandoff.deactivateLayer(this.overlayLayerId);
    if (restoreFocusTargetId === null || !this.shouldRestoreFocus()) {
      return;
    }

    const restoreElement = this.resolveElementById(restoreFocusTargetId);
    restoreElement?.focus();
  }

  private ensureElementId(element: HTMLElement): string {
    const existingId = element.id.trim();
    if (existingId.length > 0) {
      return existingId;
    }

    const nextId = this.createToastFocusId();
    element.id = nextId;
    return nextId;
  }

  private registerFocusLayer(): void {
    if (this.isFocusLayerRegistered) {
      return;
    }

    this.isFocusLayerRegistered = true;
    tngOverlayFocusHandoff.registerLayer({
      layerId: this.overlayLayerId,
      members: (): readonly string[] => {
        const viewportElement = this.viewportRef()?.nativeElement;
        if (viewportElement === undefined) {
          return [];
        }

        return this.resolveFocusableMemberIds(viewportElement);
      },
      restoreFocus: true,
      trapFocus: false,
    });
  }

  private resolveActiveElementId(): string | null {
    if (this.documentRef === null) {
      return null;
    }

    const activeElement = this.documentRef.activeElement;
    if (!(activeElement instanceof HTMLElement)) {
      return null;
    }

    return this.ensureElementId(activeElement);
  }

  private resolveElementById(id: string): HTMLElement | null {
    if (this.documentRef === null) {
      return null;
    }

    const element = this.documentRef.getElementById(id);
    return element instanceof HTMLElement ? element : null;
  }

  private resolveFocusableMemberIds(viewportElement: HTMLElement): readonly string[] {
    const focusableMembers = resolveFocusableElements(viewportElement);
    const ids: string[] = [];
    const seenIds = new Set<string>();

    for (const member of focusableMembers) {
      const id = this.ensureElementId(member);
      if (seenIds.has(id)) {
        continue;
      }

      seenIds.add(id);
      ids.push(id);
    }

    return ids;
  }

  private shouldRestoreFocus(): boolean {
    if (this.documentRef === null) {
      return false;
    }

    const viewportElement = this.viewportRef()?.nativeElement;
    const activeElement = this.documentRef.activeElement;
    if (!(activeElement instanceof HTMLElement)) {
      return true;
    }

    if (activeElement === this.documentRef.body) {
      return true;
    }

    if (viewportElement === undefined) {
      return false;
    }

    return viewportElement.contains(activeElement);
  }

  private unregisterFocusLayer(): void {
    if (!this.isFocusLayerRegistered) {
      return;
    }

    this.isFocusLayerRegistered = false;
    tngOverlayFocusHandoff.unregisterLayer(this.overlayLayerId);
  }

  private unregisterOverlayLayer(): void {
    if (!this.isOverlayLayerRegistered) {
      return;
    }

    this.isOverlayLayerRegistered = false;
    tngOverlayRuntime.unregisterLayer(this.overlayLayerId);
  }

  private scheduleDismiss(toast: TngToastRecord): void {
    this.clearDismissTimer(toast.id);
    if (toast.duration === 0) {
      return;
    }

    this.dismissTimers.schedule(toast.id, toast.duration, () => {
      this.dismiss(toast.id, 'timeout');
    });
  }
}
