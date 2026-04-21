import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-card-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-card-page.component.html',
})
export class OwnableCardPageComponent {
  protected readonly usageCode = [
    '<tng-card>',
    '  <tng-card-header>',
    '    <tng-card-title>Release notes</tng-card-title>',
    '    <tng-card-description>Track rollout status and follow-up actions.</tng-card-description>',
    '  </tng-card-header>',
    '  <tng-card-content>',
    '    <p>Build artifacts are ready for production promotion.</p>',
    '  </tng-card-content>',
    '  <tng-card-footer>',
    '    <button type="button">View details</button>',
    '  </tng-card-footer>',
    '</tng-card>',
    '',
  ].join('\n');
}
