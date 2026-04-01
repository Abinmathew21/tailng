import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-toggle-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-toggle-page.component.html',
})
export class OwnableTogglePageComponent {
  protected readonly usageCode = [
    '<tng-toggle-group',
    '  selectionMode="single"',
    '  [value]="viewMode"',
    '  (valueChange)="viewMode = $event ?? viewMode"',
    '>',
    '  <tng-toggle [value]="\'grid\'">',
    '    <span offIcon>G</span>',
    '    <span onIcon>G</span>',
    '  </tng-toggle>',
    '  <tng-toggle [value]="\'list\'">',
    '    <span offIcon>L</span>',
    '    <span onIcon>L</span>',
    '  </tng-toggle>',
    '</tng-toggle-group>',
    '',
  ].join('\n');
}
