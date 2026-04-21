import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-progress-spinner-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './progress-spinner-api-page.component.html',
  styleUrl: './progress-spinner-api-page.component.css',
})
export class HeadlessProgressSpinnerApiPageComponent {
  protected readonly rootCode = [
    '<span tngProgressSpinner [min]="0" [max]="100" [value]="68" class="spinner-root" aria-label="Upload progress">',
    '  <!-- owner-authored SVG -->',
    '</span>',
    '',
  ].join('\n');

  protected readonly svgCode = [
    '<span tngProgressSpinner [value]="68" class="spinner-root" aria-label="Upload progress">',
    '  <svg class="spinner-root__svg" viewBox="0 0 40 40">',
    '    <circle class="spinner-root__track" cx="20" cy="20" r="18"></circle>',
    '    <circle',
    '      class="spinner-root__indicator"',
    '      cx="20"',
    '      cy="20"',
    '      r="18"',
    '      stroke-dasharray="113.097"',
    '      [attr.stroke-dashoffset]="113.097 - (113.097 * 68) / 100"',
    '    ></circle>',
    '  </svg>',
    '</span>',
    '',
  ].join('\n');
}
