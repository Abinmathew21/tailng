import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-radio-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-radio-page.component.html',
})
export class OwnableRadioPageComponent {
  protected readonly usageCode = [
    '<tng-radio',
    '  name="billing-plan"',
    '  value="pro"',
    '  [checked]="selectedPlan === \'pro\'"',
    '  (checkedChange)="onPlanChange(\'pro\', $event)"',
    '>',
    '  Pro plan',
    '</tng-radio>',
    '',
  ].join('\n');
}
