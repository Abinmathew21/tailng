import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-stepper-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-stepper-page.component.html',
})
export class OwnableStepperPageComponent {
  protected readonly usageCode = [
    '<tng-stepper ariaLabel="Release flow">',
    '  <ol class="release-stepper-list">',
    '    <li class="release-stepper-item is-complete"><span>✓</span> Draft</li>',
    '    <li aria-current="step" class="release-stepper-item is-current"><span>2</span> Review</li>',
    '    <li class="release-stepper-item"><span>3</span> Publish</li>',
    '  </ol>',
    '</tng-stepper>',
    '',
  ].join('\n');
}
