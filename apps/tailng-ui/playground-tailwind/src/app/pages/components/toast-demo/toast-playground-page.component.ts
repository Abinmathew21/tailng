import { Component, signal } from '@angular/core';
import {
  TngButtonComponent,
  TngToastComponent,
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
  imports: [TngButtonComponent, TngToastComponent],
  templateUrl: './toast-playground-page.component.html',
  styleUrl: './toast-playground-page.component.css',
})
export class ToastPlaygroundPageComponent {
  private toastCounter = 0;

  protected readonly dismissEvents = signal<readonly string[]>([]);
  protected readonly modes = toastModes;
  protected readonly positions = toastPositions;
  protected readonly selectedMode = signal<TngToastMode>('toast');
  protected readonly selectedPosition = signal<TngToastPosition>('bottom-right');

  protected onDismiss(id: string): void {
    this.dismissEvents.update((events) => [id, ...events].slice(0, 6));
  }

  protected showTone(toast: TngToastComponent, tone: TngToastTone): void {
    this.toastCounter += 1;
    const toastLabel = `Notification ${this.toastCounter}`;
    toast.show(`${toastLabel}: TailNG ${tone} message for demo validation.`, {
      duration: tone === 'danger' ? 0 : 4200,
      title: toneTitleByTone[tone],
      tone,
    });
  }
}
