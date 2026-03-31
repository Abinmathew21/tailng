import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-radio-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './headless-radio-api-page.component.html',
  styleUrl: './headless-radio-api-page.component.css',
})
export class HeadlessRadioApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<label class="radio-row">',
    '  <input tngRadio name="plan" value="starter" />',
    '  <span>Starter</span>',
    '</label>',
    '',
  ].join('\n');

  protected readonly groupPatternCode = [
    '<fieldset class="radio-group">',
    '  <legend>Billing plan</legend>',
    '  <label class="radio-row">',
    '    <input tngRadio name="billing-plan" value="starter" />',
    '    <span>Starter</span>',
    '  </label>',
    '  <label class="radio-row">',
    '    <input tngRadio name="billing-plan" value="pro" [checked]="true" />',
    '    <span>Pro</span>',
    '  </label>',
    '</fieldset>',
    '',
  ].join('\n');

  protected readonly helperCode = [
    '<p id="billing-plan-help">Choose the plan that should ship with this environment.</p>',
    '<label class="radio-row">',
    '  <input tngRadio name="billing-plan" ariaDescribedBy="billing-plan-help" />',
    '  <span>Starter</span>',
    '</label>',
    '',
  ].join('\n');
}
