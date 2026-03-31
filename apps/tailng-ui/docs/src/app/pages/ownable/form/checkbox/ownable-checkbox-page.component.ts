import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-checkbox-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-checkbox-page.component.html',
})
export class OwnableCheckboxPageComponent {
  protected readonly usageCode = [
    '<tng-checkbox',
    '  [checked]="releaseReady"',
    '  (checkedChange)="releaseReady = $event"',
    '>',
    '  Release checklist complete',
    '</tng-checkbox>',
    '',
  ].join('\n');
}
