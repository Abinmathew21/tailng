import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-progress-spinner-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-progress-spinner-page.component.html',
})
export class OwnableProgressSpinnerPageComponent {
  protected readonly usageCode = [
    '<tng-progress-spinner [value]="72" ariaLabel="Sync progress"></tng-progress-spinner>',
    '<tng-progress-spinner [value]="92" [size]="48" ariaLabel="Quality checks"></tng-progress-spinner>',
    '<tng-progress-spinner [indeterminate]="true" [strokeWidth]="5" ariaLabel="Preparing release"></tng-progress-spinner>',
    '',
  ].join('\n');
}
