import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-button-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-button-page.component.html',
})
export class OwnableButtonPageComponent {
  protected readonly usageCode = [
    '<tng-button tone="primary" appearance="solid" type="button">',
    '  Save changes',
    '</tng-button>',
    '',
  ].join('\n');
}
