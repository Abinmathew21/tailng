import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-spinner-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './progress-spinner-api-page.component.html',
  styleUrl: './progress-spinner-api-page.component.css',
})
export class ProgressSpinnerApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<span tngProgressSpinner [min]="0" [max]="100" [value]="68" aria-label="Upload progress">',
    '  <!-- Custom SVG/circle rendering -->',
    '</span>',
    '',
    '<span tngProgressSpinner [indeterminate]="true" aria-label="Loading"></span>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-progress-spinner [value]="68" ariaLabel="Upload progress"></tng-progress-spinner>',
    '<tng-progress-spinner [indeterminate]="true" ariaLabel="Syncing data"></tng-progress-spinner>',
    '',
  ].join('\n');
}
