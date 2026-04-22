import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-codeblock-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-codeblock-page.component.html',
})
export class OwnableCodeblockPageComponent {
  protected readonly usageCode = [
    '<tng-code-block',
    '  title="app.config.ts"',
    '  language="ts"',
    '  [code]="snippet"',
    '  [lineNumbers]="true"',
    '  [copy]="true"',
    '  caption="Configuration preview"',
    '></tng-code-block>',
    '',
  ].join('\n');
}
