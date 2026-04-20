import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-collapsible-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-collapsible-page.component.html',
})
export class OwnableCollapsiblePageComponent {
  protected readonly usageCode = [
    '<tng-collapsible',
    '  title="Release readiness"',
    '  [open]="releaseReadinessOpen()"',
    '  (openChange)="releaseReadinessOpen.set($event)"',
    '>',
    '  <ol class="release-readiness-list">',
    '    <li><span>1</span> Notes approved</li>',
    '    <li><span>2</span> QA sign-off</li>',
    '    <li><span>3</span> Publish</li>',
    '  </ol>',
    '</tng-collapsible>',
    '',
  ].join('\n');
}
