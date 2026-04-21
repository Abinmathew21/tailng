import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-toast-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-toast-page.component.html',
})
export class OwnableToastPageComponent {
  protected readonly usageCode = [
    '<tng-toast #toast position="bottom-right" (dismissedWithReason)="onToastDismiss($event)"></tng-toast>',
    '',
    '<tng-button',
    '  tone="success"',
    '  (click)="toast.show(\'Saved changes to the release checklist.\', { title: \'Saved\', tone: \'success\' })"',
    '>',
    '  Show success toast',
    '</tng-button>',
    '',
  ].join('\n');
}
