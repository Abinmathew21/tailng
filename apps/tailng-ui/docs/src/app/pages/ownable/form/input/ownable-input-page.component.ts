import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-input-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-input-page.component.html',
})
export class OwnableInputPageComponent {
  protected readonly usageCode = [
    '<tng-input',
    '  type="email"',
    '  placeholder="name@company.com"',
    '  [ariaLabel]="\'Email address\'"',
    '></tng-input>',
    '',
  ].join('\n');
}
