import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-separator-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-separator-page.component.html',
})
export class OwnableSeparatorPageComponent {
  protected readonly usageCode = [
    '<section class="stack">',
    '  <h3>Account</h3>',
    '  <tng-separator></tng-separator>',
    '  <p>Connected projects</p>',
    '</section>',
    '',
    '<div class="toolbar">',
    '  <button type="button">Grid</button>',
    '  <tng-separator orientation="vertical"></tng-separator>',
    '  <button type="button">List</button>',
    '</div>',
    '',
  ].join('\n');
}
