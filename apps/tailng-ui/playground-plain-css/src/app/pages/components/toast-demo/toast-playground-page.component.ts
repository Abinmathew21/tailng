import { Component, signal } from '@angular/core';
import {
  TngButton,
  TngToast,
  type TngToastMode,
  type TngToastPosition,
} from '@tailng-ui/components';
import type { TngToastTone } from '@tailng-ui/primitives';

const toastModes = Object.freeze(['toast', 'snackbar'] as const);
const toastPositions = Object.freeze([
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
] as const);
const toneTitleByTone: Readonly<Record<TngToastTone, string>> = Object.freeze({
  danger: 'Error',
  neutral: 'Info',
  success: 'Success',
  warning: 'Warning',
});

@Component({
  selector: 'app-toast-playground-page',
  imports: [TngButton, TngToast],
  templateUrl: './toast-playground-page.component.html',
  styleUrl: './toast-playground-page.component.css',
})
export class ToastPlaygroundPageComponent {
  private toastCounter = 0;

  protected readonly actionEvents = signal<readonly string[]>([]);
  protected readonly dismissEvents = signal<readonly string[]>([]);
  protected readonly modes = toastModes;
  protected readonly positions = toastPositions;
  protected readonly selectedMode = signal<TngToastMode>('toast');
  protected readonly selectedPosition = signal<TngToastPosition>('bottom-right');

  protected onDismiss(id: string): void {
    this.dismissEvents.update((events) => [id, ...events].slice(0, 6));
  }

  protected showTone(toast: TngToast, tone: TngToastTone): void {
    this.toastCounter += 1;
    const toastLabel = `Notification ${this.toastCounter}`;
    toast.show(`${toastLabel}: TailNG ${tone} message for demo validation.`, {
      duration: tone === 'danger' ? 0 : 4200,
      title: toneTitleByTone[tone],
      tone,
    });
  }

  protected showUndoAction(toast: TngToast): void {
    this.toastCounter += 1;
    toast.show(`Draft #${this.toastCounter} saved successfully.`, {
      action: {
        label: 'Undo',
        onSelect: (id): void => {
          this.actionEvents.update((events) => [`Undo selected for ${id}`, ...events].slice(0, 6));
        },
      },
      duration: 5200,
      title: 'Saved',
      tone: 'success',
    });
  }

  protected showRetryAction(toast: TngToast): void {
    this.toastCounter += 1;
    toast.show(`Publish run #${this.toastCounter} failed.`, {
      action: {
        dismissOnSelect: false,
        label: 'Retry',
        onSelect: (id): void => {
          this.actionEvents.update((events) => [`Retry selected for ${id}`, ...events].slice(0, 6));
        },
      },
      duration: 0,
      title: 'Action required',
      tone: 'warning',
    });
  }
}
