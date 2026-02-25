import { Component, input, output, signal } from '@angular/core';
import type { OnDestroy } from '@angular/core';
import type { TngToastTone } from '@tailng-ui/primitives';
import {
  TngToastItem as TngToastItemPrimitive,
  TngToastViewport as TngToastViewportPrimitive,
} from '@tailng-ui/primitives';

export type TngToastMode = 'snackbar' | 'toast';
export type TngToastPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

export type TngToastOptions = Readonly<
  Partial<{
    duration: number;
    title: string | null;
    tone: TngToastTone;
  }>
>;

type TngToastKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

type TngToastRecord = Readonly<{
  duration: number;
  id: string;
  message: string;
  title: string | null;
  tone: TngToastTone;
}>;

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

@Component({
  selector: 'tng-toast',
  imports: [TngToastItemPrimitive, TngToastViewportPrimitive],
  templateUrl: './tng-toast.component.html',
  styleUrl: './tng-toast.component.css',
})
export class TngToastComponent implements OnDestroy {
  private sequence = 0;
  private readonly timeoutByToastId = new Map<string, ReturnType<typeof setTimeout>>();

  public readonly duration = input<number>(4000);
  public readonly maxVisible = input<number>(4);
  public readonly mode = input<TngToastMode>('toast');
  public readonly position = input<TngToastPosition>('bottom-right');

  public readonly dismissed = output<string>();
  protected readonly toasts = signal<readonly TngToastRecord[]>([]);

  public dismiss(id: string): void {
    const currentToasts = this.toasts();
    const nextToasts = currentToasts.filter((toast) => toast.id !== id);
    if (nextToasts.length === currentToasts.length) {
      return;
    }

    this.clearDismissTimer(id);
    this.toasts.set(nextToasts);
    this.dismissed.emit(id);
  }

  public ngOnDestroy(): void {
    for (const timeoutId of this.timeoutByToastId.values()) {
      clearTimeout(timeoutId);
    }

    this.timeoutByToastId.clear();
  }

  public show(message: string, options: TngToastOptions = {}): string {
    this.sequence += 1;
    const id = `tng-toast-${this.sequence}`;
    const fallbackDuration = this.duration();
    const resolvedDuration = normalizeTngToastDuration(
      options.duration ?? fallbackDuration,
      fallbackDuration,
    );
    const nextToast: TngToastRecord = {
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

  protected onToastKeydown(id: string, event: TngToastKeyboardEvent): void {
    if (!shouldDismissTngToastForKey(event.key)) {
      return;
    }

    event.preventDefault();
    this.dismiss(id);
  }

  private clearDismissTimer(id: string): void {
    const timeoutId = this.timeoutByToastId.get(id);
    if (timeoutId === undefined) {
      return;
    }

    clearTimeout(timeoutId);
    this.timeoutByToastId.delete(id);
  }

  private scheduleDismiss(toast: TngToastRecord): void {
    this.clearDismissTimer(toast.id);
    if (toast.duration === 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      this.timeoutByToastId.delete(toast.id);
      this.dismiss(toast.id);
    }, toast.duration);

    this.timeoutByToastId.set(toast.id, timeoutId);
  }
}
