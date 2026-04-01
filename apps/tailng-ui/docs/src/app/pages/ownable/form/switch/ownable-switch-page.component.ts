import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-switch-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-switch-page.component.html',
})
export class OwnableSwitchPageComponent {
  protected readonly usageCode = [
    '<tng-switch',
    '  [checked]="releaseReady"',
    '  (checkedChange)="releaseReady = $event"',
    '>',
    '  Release ready',
    '</tng-switch>',
    '',
  ].join('\n');
}
