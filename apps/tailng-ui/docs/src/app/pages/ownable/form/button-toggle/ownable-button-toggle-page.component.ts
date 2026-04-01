import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-button-toggle-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-button-toggle-page.component.html',
})
export class OwnableButtonTogglePageComponent {
  protected readonly usageCode = [
    '<tng-button-toggle-group',
    '  type="single"',
    '  [value]="align()"',
    '  (valueChange)="onAlignChange($event)"',
    '>',
    '  <tng-button-toggle value="left">Left</tng-button-toggle>',
    '  <tng-button-toggle value="center">Center</tng-button-toggle>',
    '  <tng-button-toggle value="right">Right</tng-button-toggle>',
    '</tng-button-toggle-group>',
    '',
  ].join('\n');
}
