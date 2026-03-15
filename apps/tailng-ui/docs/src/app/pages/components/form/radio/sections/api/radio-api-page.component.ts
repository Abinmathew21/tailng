import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-radio-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './radio-api-page.component.html',
  styleUrl: './radio-api-page.component.css',
})
export class RadioApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<label class="radio-row">',
    '  <input tngRadio name="plan" value="starter" />',
    '  <span>Starter</span>',
    '</label>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-radio',
    '  name="plan"',
    '  value="pro"',
    '  [checked]="plan === \'pro\'"',
    '  (checkedChange)="onPlanChecked(\'pro\', $event)"',
    '>',
    '  Pro',
    '</tng-radio>',
    '',
  ].join('\n');

  protected readonly helperCode = [
    '<p id="plan-help">Choose one plan.</p>',
    '<label class="radio-row">',
    '  <input tngRadio ariaDescribedBy="plan-help" />',
    '  <span>Starter</span>',
    '</label>',
    '',
  ].join('\n');
}
