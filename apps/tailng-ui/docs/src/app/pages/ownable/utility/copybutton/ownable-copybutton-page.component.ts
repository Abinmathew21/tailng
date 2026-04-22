import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-copybutton-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-copybutton-page.component.html',
})
export class OwnableCopybuttonPageComponent {
  protected readonly usageCode = [
    '<tng-copy-button',
    '  [text]="installCommand"',
    '  appearance="solid"',
    '  size="sm"',
    '>',
    '  Copy install command',
    '</tng-copy-button>',
    '',
  ].join('\n');
}
