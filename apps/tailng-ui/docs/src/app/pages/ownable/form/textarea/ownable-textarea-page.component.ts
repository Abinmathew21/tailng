import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-textarea-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-textarea-page.component.html',
})
export class OwnableTextareaPageComponent {
  protected readonly usageCode = [
    '<tng-textarea',
    '  [rows]="5"',
    '  [placeholder]="\'Add release notes\'"',
    '  [value]="notes"',
    '  (valueChange)="notes = $event"',
    '></tng-textarea>',
    '',
  ].join('\n');
}
