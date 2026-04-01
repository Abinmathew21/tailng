import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-label-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-label-page.component.html',
})
export class OwnableLabelPageComponent {
  protected readonly usageCode = [
    '<tng-label forId="workspace-name" [required]="true">',
    '  Workspace name',
    '</tng-label>',
    '<input id="workspace-name" type="text" required />',
    '',
  ].join('\n');
}
