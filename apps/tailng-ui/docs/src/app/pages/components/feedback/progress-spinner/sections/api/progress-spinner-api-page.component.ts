import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-spinner-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './progress-spinner-api-page.component.html',
  styleUrl: './progress-spinner-api-page.component.css',
})
export class ProgressSpinnerApiPageComponent {
  protected readonly wrapperUsageCode = [
    '<tng-progress-spinner [value]="68" ariaLabel="Upload progress"></tng-progress-spinner>',
    '<tng-progress-spinner [indeterminate]="true" ariaLabel="Syncing data"></tng-progress-spinner>',
    '',
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<span tngProgressSpinner [value]="68" aria-label="Upload progress">',
    '  <!-- owner-authored SVG/circle rendering -->',
    '</span>',
    '',
  ].join('\n');
}
