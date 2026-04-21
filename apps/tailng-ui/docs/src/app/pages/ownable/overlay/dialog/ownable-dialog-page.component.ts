import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-dialog-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-dialog-page.component.html',
})
export class OwnableDialogPageComponent {
  protected readonly usageCode = [
    '<button type="button" (click)="reviewDialogOpen = true">Open review</button>',
    '',
    '<tng-dialog',
    '  title="Review changes"',
    '  description="Confirm before publishing the release."',
    '  [open]="reviewDialogOpen"',
    '  (openChange)="reviewDialogOpen = $event"',
    '>',
    '  <p>Dialog body content.</p>',
    '</tng-dialog>',
    '',
  ].join('\n');
}
