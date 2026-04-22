import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-tag-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-tag-page.component.html',
})
export class OwnableTagPageComponent {
  protected readonly usageCode = [
    '<tng-tag tone="success" [removable]="true" label="Stable" (removed)="removeTag()">',
    '  Stable',
    '</tng-tag>',
    '',
  ].join('\n');
}
