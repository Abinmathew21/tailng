import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-badge-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-badge-page.component.html',
})
export class OwnableBadgePageComponent {
  protected readonly usageCode = [
    '<button',
    '  type="button"',
    '  [tngBadge]="42"',
    '  tngBadgeTone="danger"',
    '>',
    '  Notifications',
    '</button>',
    '',
  ].join('\n');
}
