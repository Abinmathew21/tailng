import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-toast-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './toast-api-page.component.html',
  styleUrl: './toast-api-page.component.css',
})
export class ToastApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<section tngToastViewport>',
    '  <article tngToastItem tone="success">',
    '    <p>Deployment completed.</p>',
    '  </article>',
    '</section>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-toast #toast position="bottom-right" (dismissed)="onDismiss($event)"></tng-toast>',
    '<tng-button (click)="toast.show(\'Saved\', { tone: \'success\', title: \'Success\' })">',
    '  Show success toast',
    '</tng-button>',
    '',
  ].join('\n');
}
