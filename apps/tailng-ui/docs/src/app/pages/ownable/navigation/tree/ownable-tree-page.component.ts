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
    '  [nodes]="navigationNodes"',
    '  [defaultExpandedIds]="[\'workspace\', \'guides\']"',
    '  [defaultSelectedId]="\'tree\'"',
    '  ariaLabel="Documentation tree"',
    '/>',
    '',
    '<!-- navigationNodes -->',
    '<!--',
    'readonly navigationNodes = [',
    "  { id: 'workspace', label: 'Docs', description: 'Product documentation root' },",
    "  { id: 'guides', label: 'Guides', parentId: 'workspace' },",
    "  { id: 'navigation', label: 'Navigation', parentId: 'guides' },",
    "  { id: 'tree', label: 'Tree', parentId: 'navigation' },",
    '];',
    '-->',
    '',
  ].join('\n');
}
