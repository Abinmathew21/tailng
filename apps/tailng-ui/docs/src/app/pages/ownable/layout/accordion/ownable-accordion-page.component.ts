import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-accordion-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-accordion-page.component.html',
})
export class OwnableAccordionPageComponent {
  protected readonly usageCode = [
    '<tng-accordion ariaLabel="Security FAQ" [defaultValue]="\'keys\'">',
    '  <tng-accordion-item value="keys">',
    '    <tng-accordion-trigger>API keys</tng-accordion-trigger>',
    '    <tng-accordion-panel>',
    '      Rotate workspace keys, review scopes, and audit recent access.',
    '    </tng-accordion-panel>',
    '  </tng-accordion-item>',
    '  <tng-accordion-item value="sessions">',
    '    <tng-accordion-trigger>Active sessions</tng-accordion-trigger>',
    '    <tng-accordion-panel>',
    '      Manage device trust, revoke tokens, and review session history.',
    '    </tng-accordion-panel>',
    '  </tng-accordion-item>',
    '</tng-accordion>',
    '',
  ].join('\n');
}
