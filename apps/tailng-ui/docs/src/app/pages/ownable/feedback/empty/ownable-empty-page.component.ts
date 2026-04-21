import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-empty-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-empty-page.component.html',
})
export class OwnableEmptyPageComponent {
  protected readonly usageCode = [
    '<tng-empty align="start">',
    '  <tng-empty-icon>📭</tng-empty-icon>',
    '  <tng-empty-title>No messages yet</tng-empty-title>',
    '  <tng-empty-description>',
    '    Invite your team or start a new conversation to populate this workspace.',
    '  </tng-empty-description>',
    '  <tng-empty-actions>',
    '    <button type="button">Invite team</button>',
    '  </tng-empty-actions>',
    '</tng-empty>',
    '',
  ].join('\n');
}
