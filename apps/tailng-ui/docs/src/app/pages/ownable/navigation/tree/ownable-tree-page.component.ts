import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-tree-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-tree-page.component.html',
})
export class OwnableTreePageComponent {
  protected readonly usageCode = [
    '<tng-tree',
    '  [nodes]="treeNodes"',
    '  [defaultExpandedIds]="[\'workspace\']"',
    '  [ariaLabel]="\'File tree\'"',
    '  (selectedIdChange)="onSelect($event)"',
    '/>',
    '',
  ].join('\n');
}
