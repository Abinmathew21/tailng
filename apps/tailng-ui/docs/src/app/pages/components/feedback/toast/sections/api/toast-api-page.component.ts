import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-toast-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './toast-api-page.component.html',
  styleUrl: './toast-api-page.component.css',
})
export class ToastApiPageComponent {
  protected readonly wrapperUsageCode = [
    '<tng-toast',
    '  #toast',
    '  position="bottom-right"',
    '  (dismissedWithReason)="onToastDismiss($event)"',
    '></tng-toast>',
    '',
    '<tng-button',
    '  tone="success"',
    '  (click)="toast.show(\'Saved checklist updates.\', { title: \'Saved\', tone: \'success\' })"',
    '>',
    '  Show success toast',
    '</tng-button>',
    '',
  ].join('\n');

  protected readonly runtimeCode = [
    'toast.show(\'Build failed during publish.\', {',
    "  action: {",
    "    dismissOnSelect: false,",
    "    label: 'Retry',",
    '    onSelect: (id) => retryBuild(id),',
    '  },',
    '  duration: 0,',
    "  title: 'Action required',",
    "  tone: 'warning',",
    '});',
    '',
    "toast.dismiss(toastId, 'manual');",
    '',
  ].join('\n');
}
