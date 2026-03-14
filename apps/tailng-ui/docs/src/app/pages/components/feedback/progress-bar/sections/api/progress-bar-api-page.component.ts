import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-bar-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './progress-bar-api-page.component.html',
  styleUrl: './progress-bar-api-page.component.css',
})
export class ProgressBarApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<div tngProgressBar [min]="0" [max]="100" [value]="68">',
    '  <span tngProgressBarIndicator [style.width.%]="68"></span>',
    '</div>',
    '',
    '<div tngProgressBar [indeterminate]="true" aria-label="Loading">',
    '  <span tngProgressBarIndicator class="indicator--indeterminate"></span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-progress-bar [value]="68" ariaLabel="Upload progress"></tng-progress-bar>',
    '<tng-progress-bar [indeterminate]="true" ariaLabel="Syncing data"></tng-progress-bar>',
    '',
  ].join('\n');
}
