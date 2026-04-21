import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-tooltip-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-tooltip-page.component.html',
})
export class OwnableTooltipPageComponent {
  protected readonly usageCode = [
    '<tng-tooltip',
    '  triggerLabel="What does this do?"',
    '  text="Tooltips should stay short and non-interactive."',
    '></tng-tooltip>',
    '',
  ].join('\n');
}
