import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-progress-bar-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-progress-bar-page.component.html',
})
export class OwnableProgressBarPageComponent {
  protected readonly usageCode = [
    '<tng-progress-bar [value]="72" ariaLabel="Upload progress"></tng-progress-bar>',
    '<tng-progress-bar [value]="92" ariaLabel="Quality checks"></tng-progress-bar>',
    '<tng-progress-bar [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-bar>',
    '',
  ].join('\n');
}
