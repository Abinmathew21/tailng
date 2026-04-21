import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-bar-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './progress-bar-api-page.component.html',
  styleUrl: './progress-bar-api-page.component.css',
})
export class ProgressBarApiPageComponent {
  protected readonly wrapperUsageCode = [
    '<tng-progress-bar [value]="68" ariaLabel="Upload progress"></tng-progress-bar>',
    '<tng-progress-bar [indeterminate]="true" ariaLabel="Syncing data"></tng-progress-bar>',
    '',
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<div tngProgressBar [value]="68" class="progress-track">',
    '  <span tngProgressBarIndicator [style.width.%]="68" class="progress-indicator"></span>',
    '</div>',
    '',
  ].join('\n');
}
